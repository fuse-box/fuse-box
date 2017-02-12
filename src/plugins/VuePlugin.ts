import { File } from "../File";
import { WorkFlowContext } from "./../WorkflowContext";
import { Plugin } from "../WorkflowContext";


let vueCompiler;
export class VuePluginClass implements Plugin {
    public test: RegExp = /\.vue$/;

    public opts: any;
    constructor(opts) {
        this.opts = opts || {};
    }

    public init(context: WorkFlowContext) {
        context.allowExtension(".vue");
    }

    public transform(file: File) {
        file.loadContents();

        if (!vueCompiler) {
            vueCompiler = require("vue-template-compiler");
        }

        let result = vueCompiler.parseComponent(file.contents, this.opts)
        if (result.template && result.template.type === "template") {
            let html = result.template.content;
            let parsed = vueCompiler.compile(html);

            let jsContent = result.script.content;
            const ts = require("typescript");

            const jsTranspiled = ts.transpileModule(jsContent, file.context.getTypeScriptConfig());
            const tsResult = `
                var View = require('vue/dist/vue.js');
                var _view_exports = function(exports){${jsTranspiled.outputText}};
                var _params = {};
                _view_exports(_params);
                module.exports = new View(_params);
            `
            file.contents = tsResult;
            file.analysis.parseUsingAcorn();
            file.analysis.analyze();

            if (parsed.errors) {
                parsed.errors.forEach(e => {
                    console.log(e);
                });
            }
        }
    }
};

export const VuePlugin = (opts) => {
    return new VuePluginClass(opts);
};
