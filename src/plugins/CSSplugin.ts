import { File } from "../File";
import { WorkFlowContext } from "./../WorkflowContext";
import { Plugin } from "../WorkflowContext";

/**
 *
 *
 * @export
 * @class FuseBoxCSSPlugin
 * @implements {Plugin}
 */
export class FuseBoxCSSPlugin implements Plugin {
    /**
     *
     *
     * @type {RegExp}
     * @memberOf FuseBoxCSSPlugin
     */
    public test: RegExp = /\.css$/;

    /**
     *
     *
     * @param {WorkFlowContext} context
     *
     * @memberOf FuseBoxCSSPlugin
     */
    public init(context: WorkFlowContext) {
        context.allowExtension(".css");
    }

    /**
     *
     *
     * @param {File} file
     *
     * @memberOf FuseBoxCSSPlugin
     */
    public transform(file: File) {
        file.contents = `
if (typeof window !== 'undefined') {
var styleId = encodeURIComponent(__filename);
var exists = document.getElementById(styleId);
if (!exists) {
    var s = document.createElement("style");
    s.id = styleId;
    s.innerHTML =${JSON.stringify(file.contents)};
    document.getElementsByTagName("head")[0].appendChild(s);
}}`;

    }
}

export const CSSPlugin = new FuseBoxCSSPlugin();