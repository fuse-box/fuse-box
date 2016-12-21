import * as fs from 'fs';
import { File } from "../File";
import { WorkFlowContext } from "./../WorkflowContext";
import { Plugin } from "../WorkflowContext";

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
     * 
     * 
     * @type {RegExp}
     * @memberOf FuseBoxHTMLPlugin
     */
    public test: RegExp = /\.js(x)?$/;
    public context: WorkFlowContext;
    private limit2project: boolean = true;

    private config: any = {};

    constructor(opts: any) {
        opts = opts || {};
        if (opts.config !== undefined) {
            this.config = opts.config;
        }
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

        let result = babelCore.transform(file.contents, this.config);

        // By default we would want to limit the babel 
        // And use acorn instead (it's faster)
        let pass = result.map
            && (this.limit2project && file.collection.name === "default");

        if (pass) {

            file.analysis.loadAst(result.ast);
            file.analysis.analyze();
            file.contents = result.code;
            let sm = result.map;
            sm.file = file.info.fuseBoxPath;
            sm.sources = [file.info.fuseBoxPath];
            file.sourceMap = JSON.stringify(sm);

            if (this.context.useCache) {
                this.context.cache.writeStaticCache(file, file.sourceMap);
            }
        }
    }
};

export const BabelPlugin = (opts: any) => {
    return new BabelPluginClass(opts);
}

