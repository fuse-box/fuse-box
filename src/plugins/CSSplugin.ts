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
    public dependencies = ["fsb-default-css-plugin"];

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
        let contents = file.contents.replace(/\s{2,}/g, " ").replace(/\t|\r|\n/g, "").trim();
        file.contents = `require("fsb-default-css-plugin")(__filename, ${JSON.stringify(contents)} );`;
    }
}

export const CSSPlugin = new FuseBoxCSSPlugin();