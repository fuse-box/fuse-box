import { File } from "../File";
import { WorkFlowContext } from "./../WorkflowContext";
import { Plugin } from "../WorkflowContext";

const babelCore = require("babel-core");
/**
 * 
 * 
 * @export
 * @class FuseBoxHTMLPlugin
 * @implements {Plugin}
 */
export class BabelPlugin implements Plugin {
    /**
     * 
     * 
     * @type {RegExp}
     * @memberOf FuseBoxHTMLPlugin
     */
    public test: RegExp = /\.js$/;
    public context: WorkFlowContext;
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
        return new Promise((resolve, reject) => {
            let result = babelCore.transform(file.contents, {
                presets: ["es2015"],
                plugins : ["add-module-exports"]
            });
            file.contents = result.code;
            return resolve();
        });
    }
};
