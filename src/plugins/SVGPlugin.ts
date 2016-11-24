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
export class SVGSimplePlugin implements Plugin {
    /**
     * 
     * 
     * @type {RegExp}
     * @memberOf FuseBoxHTMLPlugin
     */
    public test: RegExp = /\.svg$/;
    /**
     * 
     * 
     * @param {WorkFlowContext} context
     * 
     * @memberOf FuseBoxHTMLPlugin
     */
    public init(context: WorkFlowContext) {
        context.allowExtension(".svg");
    }
    /**
     * 
     * 
     * @param {File} file
     * 
     * @memberOf FuseBoxHTMLPlugin
     */
    public transform(file: File) {
        file.loadContents();
        let content = file.contents;
        content = content.replace(/"/g, "'");
        content = content.replace(/\s+/g, " ");
        content = content.replace(/[{}\|\\\^~\[\]`"<>#%]/g,  (match) => {
            return "%" + match[0].charCodeAt(0).toString(16).toUpperCase();
        });
        let data = "data:image/svg+xml;charset=utf8," + content.trim();
        file.contents = `module.exports = ${JSON.stringify(data)}`;
    }
};

export const SVGPlugin = new SVGSimplePlugin();
