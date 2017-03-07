import { File } from '../core/File';
import { WorkFlowContext, Plugin } from '../core/WorkflowContext';

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
        context.allowExtension('.json');
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
        file.contents = `module.exports = ${file.contents || {}};`;
    }
};

export const JSONPlugin = () => {
    return new FuseBoxJSONPlugin();
};
