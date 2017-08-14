import { File } from "../core/File";
import { WorkFlowContext } from "../core/WorkflowContext";
import { Plugin } from "../core/WorkflowContext";
import * as fs from "fs";
import * as path from "path";

export interface VuePluginOptions {
    babel?: any,
}

let vueCompiler;
let vueTranspiler;
let typescriptTranspiler;
let babelCore;
let babelConfig;
export class VuePluginClass implements Plugin {
    public test: RegExp = /\.vue$/;

    //
    constructor(public options: VuePluginOptions = {}) {}

    public init(context: WorkFlowContext) {
        context.allowExtension(".vue");
    }

    public transform(file: File) {
        const context = file.context;

        // caching ...
        if (context.useCache) {
            let cached = context.cache.getStaticCache(file);
            if (cached) {
                file.isLoaded = true;
                if (cached.sourceMap) {
                    file.sourceMap = cached.sourceMap;
                }
                file.analysis.skip();
                file.analysis.dependencies = cached.dependencies;
                file.contents = cached.contents;

                return;
            }
        }

        file.loadContents();

        if (!vueCompiler) {
            vueCompiler = require("vue-template-compiler");
            vueTranspiler = require("vue-template-es2015-compiler");
        }

        let result = vueCompiler.parseComponent(file.contents, this.options);
        if (result.template && result.template.type === "template") {
            let templateLang = (result.template.attrs) ? result.template.attrs.lang : null;
            return compileTemplateContent(context, templateLang, result.template.content).then(html => {

                file.contents = compileScript(this.options, context, html, result.script)
                file.analysis.parseUsingAcorn();
                file.analysis.analyze();

                if (context.useCache) {
                    context.emitJavascriptHotReload(file);
                    context.cache.writeStaticCache(file, file.sourceMap);
                }
                return true
            }).catch(err => {
                console.error(err);
            });
        }
    }
};

function toFunction (code) {
  return vueTranspiler('function render () {' + code + '}')
}

function compileTemplateContent (context: any, engine: string, content: string) {
    return new Promise((resolve, reject) => {
        if (!engine) { return resolve(content); }

        const cons = require('consolidate');
        if (!cons[engine]) { return content; }

        cons[engine].render(content, {
            filename: 'base',
            basedir: context.homeDir,
            includeDir: context.homeDir
        }, (err, html) => {
            if (err) { return reject(err); }
            resolve(html)
        });
    });
}
function compileScript(options, context, html, script) : string {
    let lang = script.attrs.lang;
    if (lang === 'babel') {
        return compileBabel(options, context, html, script);
    } else {
        return compileTypeScript(options, context, html, script);
    }
}
function compileTypeScript(options, context, html, script) : string {
    if (!typescriptTranspiler) {
        typescriptTranspiler = require("typescript");
    }
    try {
        const jsTranspiled = typescriptTranspiler.transpileModule(script.content, context.getTypeScriptConfig());
        return reduceVueToScript(jsTranspiled.outputText, html)
    } catch (err) {
        console.log(err)
    }
    return ''
}
function compileBabel(options, context, html, script) : string {
    if (!babelCore) {
        babelCore = require("babel-core");
        if (options.babel !== undefined) {
            babelConfig = options.babel.config;
        } else {
            let babelRcPath = path.join(context.appRoot, `.babelrc`);
            if (fs.existsSync(babelRcPath)) {
                let babelRcConfig = fs.readFileSync(babelRcPath).toString();
                if (babelRcConfig)
                    babelConfig = JSON.parse(babelRcConfig);
            }
        }
        if (babelConfig === undefined) {
            babelConfig = { plugins: ['transform-es2015-modules-commonjs'] }
        }
    }
    try {
        let jsTranspiled = babelCore.transform(script.content, babelConfig);
        return reduceVueToScript(jsTranspiled.code, html)
    } catch (err) {
        console.log(err)
    }
    return '';
}
function reduceVueToScript(jsContent, html) : string {
    const compiled = vueCompiler.compile(html);
    return `var _p = {};
var _v = function(exports){${jsContent}
};
_p.render = ` + toFunction(compiled.render) + `
_p.staticRenderFns = [ ` + compiled.staticRenderFns.map(toFunction).join(',') + ` ];
var _e = {}; _v(_e); Object.assign(_e.default.options||_e.default, _p)
module.exports = _e
    `;
}

export const VuePlugin = (options?: VuePluginOptions) => {
    return new VuePluginClass(options);
};
