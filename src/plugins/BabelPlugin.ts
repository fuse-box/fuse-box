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
    public test: RegExp = /(\.js|\.jsx)$/;
    public context: WorkFlowContext;

    private config: any = {};

    constructor(opts: any) {
        opts = opts || {};
        if (opts.config !== undefined) {
            this.config = opts.config;
        }
        if (opts.test !== undefined) {
            this.test = opts.test;
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


        return new Promise((resolve, reject) => {
            if (!babelCore) {
                babelCore = require("babel-core");
            }
            if (this.context.useCache) {

                let cached = this.context.cache.getStaticCache(file);
                if (cached) {
                    if (cached.sourceMap) {
                        file.sourceMap = cached.sourceMap;
                    }
                    file.contents = cached.contents;
                    return resolve();
                }
            }
            let result = babelCore.transform(file.contents, this.config);
            if (result.map && file.collection.name === "default") {
                file.contents = result.code;
                let sm = result.map;
                sm.file = file.info.fuseBoxPath;
                sm.sources = [file.info.fuseBoxPath];
                file.sourceMap = JSON.stringify(sm);
            }

            if (this.context.useCache) {
                this.context.cache.writeStaticCache(file, file.sourceMap);
            }
            return resolve();
        });
    }
};

export const BabelPlugin = (opts: any) => {
    return new BabelPluginClass(opts);
}

