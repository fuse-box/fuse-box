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
export class FuseBoxHTMLPlugin implements Plugin {
    private useDefault = true;
    constructor(opts: any = {}) {
        if (opts.useDefault !== undefined) {
            this.useDefault = opts.useDefault;
        }
    }
    /**
     * 
     * 
     * @type {RegExp}
     * @memberOf FuseBoxHTMLPlugin
     */
    public test: RegExp = /\.html$/;
    
    /**
     * 
     * 
     * @param {File} file
     * 
     * @memberOf FuseBoxHTMLPlugin
     */
    public transform(file: File) {
        file.loadContents();
        if (this.useDefault) {
            file.contents = `module.exports.default =  ${JSON.stringify(file.contents)}`;
        } else {
            file.contents = `module.exports =  ${JSON.stringify(file.contents)}`;
        }
    }
};

export const HTMLPlugin = (opts?: any) => {
    return new FuseBoxHTMLPlugin(opts);
};

