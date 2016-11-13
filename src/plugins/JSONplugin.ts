import { File } from "../File";
import { WorkFlowContext } from "./../WorkflowContext";
import { Plugin } from "../WorkflowContext";

/**
 * 
 * 
 * @export
 * @class FuseBoxHTMLPlugin
 * @implements {Plugin}
 */
export class FuseBoxJSONPlugin implements Plugin {
    /**
     * 
     * 
     * @type {RegExp}
     * @memberOf FuseBoxHTMLPlugin
     */
    public test: RegExp = /\.json$/
    /**
     * 
     * 
     * @param {WorkFlowContext} context
     * 
     * @memberOf FuseBoxHTMLPlugin
     */
    public init(context: WorkFlowContext) {
        context.allowExtension(".json");
    }
    /**
     * 
     * 
     * @param {File} file
     * 
     * @memberOf FuseBoxHTMLPlugin
     */
    public transform(file: File) {
        file.contents = `module.exports = ${file.contents || {}};`;
    }
};

export const JSONPlugin = new FuseBoxJSONPlugin();
