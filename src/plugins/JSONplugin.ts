import { File } from "../core/File";
import { WorkFlowContext, Plugin } from "../core/WorkflowContext";

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
        const context = file.context;
        if (context.useCache) {
            if (file.loadFromCache()) {
                return;
            }
        }

        file.loadContents();
        file.contents = `module.exports = ${file.contents || {}};`;
        if (context.useCache) {
            context.emitJavascriptHotReload(file);
            context.cache.writeStaticCache(file, file.sourceMap);
        }
    }
};

export const JSONPlugin = () => {
    return new FuseBoxJSONPlugin();
};
