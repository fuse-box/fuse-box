import * as fs from 'fs';
import * as path from 'path';
import * as appRoot from 'app-root-path';
import { File } from "../../core/File";
import { WorkFlowContext } from "../../core/WorkflowContext";
import { Plugin } from "../../core/WorkflowContext";

let babelCore;
/**
 *
 *
 * @export
 * @class FuseBoxHTMLPlugin
 * @implements {Plugin}
 */
export class BabelPluginClass implements Plugin {


    /**
     * We can add tsx and ts here as well
     * Because Babel won't capture it just being a Plugin
     * Typescript files are handled before any external plugin is executed
     */
    public test: RegExp = /\.(j|t)s(x)?$/;
    public context: WorkFlowContext;
    private limit2project: boolean = true;

    private config: any = {};
    private configPrinted = false;

    constructor(opts: any) {
        let babelRcConfig;
        let babelRcPath = path.join(appRoot.path, `.babelrc`);
        if (fs.existsSync(babelRcPath)) {
            babelRcConfig = fs.readFileSync(babelRcPath).toString();
            if (babelRcConfig) babelRcConfig = JSON.parse(babelRcConfig);
        }
        opts = opts || {};
        this.config = opts.config ? opts.config : babelRcConfig;
        if (opts.test !== undefined) {
            this.test = opts.test;
        }
        if (opts.limit2project !== undefined) {
            this.limit2project = opts.limit2project;
        }
    }


    /**
     *
     *
     * @param {WorkFlowContext} context
     *
     * @memberOf FuseBoxHTMLPlugin
     */
    public init(context: WorkFlowContext) {
        this.context = context;
        context.allowExtension(".jsx");
    }


    /**
     *
     *
     * @param {File} file
     *
     * @memberOf FuseBoxHTMLPlugin
     */
    public transform(file: File, ast: any) {

        if (!babelCore) {
            babelCore = require("babel-core");
        }
        if (this.configPrinted === false) {
            file.context.debug("BabelPlugin", `\n\tConfiguration: ${JSON.stringify(this.config)}`)

            this.configPrinted = true;
        }
        if (this.context.useCache) {

            let cached = this.context.cache.getStaticCache(file);
            if (cached) {
                if (cached.sourceMap) {
                    file.sourceMap = cached.sourceMap;
                }
                file.analysis.skip();
                file.analysis.dependencies = cached.dependencies;
                file.contents = cached.contents;
                return;
            }
        }

        if (this.limit2project === false || file.collection.name === file.context.defaultPackageName) {
            let result = babelCore.transform(file.contents, this.config);
            // By default we would want to limit the babel 
            // And use acorn instead (it's faster)

            if (result.ast) {
                file.analysis.loadAst(result.ast);
                file.analysis.analyze();
                file.contents = result.code;
                if (result.map) {
                    let sm = result.map;
                    sm.file = file.info.fuseBoxPath;
                    sm.sources = [file.info.fuseBoxPath];
                    file.sourceMap = JSON.stringify(sm);
                }
                if (this.context.useCache) {
                    this.context.emitJavascriptHotReload(file);
                    this.context.cache.writeStaticCache(file, file.sourceMap);
                }
            }
        }

    }
}
;

export const BabelPlugin = (opts: any) => {
    return new BabelPluginClass(opts);
}

