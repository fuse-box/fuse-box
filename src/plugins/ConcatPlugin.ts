import { File } from "../core/File";
import { WorkFlowContext, Plugin } from "./../core/WorkflowContext";

/**
 *
 *
 * @export
 * @class FuseBoxHTMLPlugin
 * @implements {Plugin}
 */
export class ConcatPluginClass implements Plugin {
    private ext: any;
    private bundleName: string;
    private delimiter = "\n";
    constructor(opts: any = {}) {
        if ("ext" in opts) { this.ext = opts.ext; }
        if ("name" in opts) { this.bundleName = opts.name; }
        if ("delimiter" in opts) { this.delimiter = opts.delimiter; }
    }
    /**
     *
     *
     * @type {RegExp}
     * @memberOf FuseBoxHTMLPlugin
     */
    public test: RegExp = /\.txt$/;

    /**
     *
     *
     * @param {WorkFlowContext} context
     *
     * @memberOf FuseBoxHTMLPlugin
     */
    public init(context: WorkFlowContext) {
        if (this.ext) {
            context.allowExtension(this.ext);
        }
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

        let context = file.context;
        let fileGroup = context.getFileGroup(this.bundleName);
        if (!fileGroup) {
            fileGroup = context.createFileGroup(this.bundleName, file.collection, this);
        }
        fileGroup.addSubFile(file);

        // making sure the current file refers to an object at runtime that calls our bundle
        file.alternativeContent = `module.exports = require("./${this.bundleName}")`;
    }

    public transformGroup(group: File) {
        let contents = [];
        group.subFiles.forEach(file => {
            contents.push(file.contents);
        });
        let text = contents.join(this.delimiter);
        group.contents = `module.exports = ${JSON.stringify(text)}`;
    }

};

export const ConcatPlugin = (opts?: any) => {
    return new ConcatPluginClass(opts);
};

