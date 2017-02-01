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
export class ImageBase64PluginClass implements Plugin {
    /**
     * 
     * 
     * @type {RegExp}
     * @memberOf FuseBoxHTMLPlugin
     */
    public test: RegExp = /\.(gif|png|jpg|jpeg)$/i;
    /**
     * 
     * 
     * @param {WorkFlowContext} context
     * 
     * @memberOf FuseBoxHTMLPlugin
     */
    public init(context: WorkFlowContext) {
        context.allowExtension(".gif");
        context.allowExtension(".png");
        context.allowExtension(".jpg");
        context.allowExtension(".jpeg");
    }
    /**
     * 
     * 
     * @param {File} file
     * 
     * @memberOf FuseBoxHTMLPlugin
     */
    public transform(file: File) {

        file.isLoaded = true;
        const context = file.context;
        const cached = context.cache.getStaticCache(file);
        if (cached) {
            file.contents = cached.contents;
        } else {
            const base64Img = require("base64-img");
            const data = base64Img.base64Sync(file.absPath);
            file.contents = `module.exports = ${JSON.stringify(data)}`;
            context.cache.writeStaticCache(file, undefined);
        }
    }
};

export const ImageBase64Plugin = (opts?: any) => {
    return new ImageBase64PluginClass();
}
