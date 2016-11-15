import {File} from "../File";
import {WorkFlowContext} from "./../WorkflowContext";
import {Plugin} from "../WorkflowContext";

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
        file.contents = JSON.stringify(file.contents);
        file.contents = `if (typeof window !== 'undefined') {
    var styleId = __filename.replace(/[\.\/]+/g, "-");
    if(styleId.charAt(0) === '-' ) styleId = styleId.substring(1);
    var exists = document.getElementById(styleId);
    if (!exists) {
        var s = document.createElement("style");
        s.id = styleId;
        s.innerHTML =${file.contents};
        document.getElementsByTagName("head")[0].appendChild(s);
    }
}
`
    }
}

export const CSSPlugin = new FuseBoxCSSPlugin();