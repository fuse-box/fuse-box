import { File } from "../File";
import { WorkFlowContext } from "./../WorkflowContext";
import { Plugin } from "../WorkflowContext";

/**
 * 
 * 
 * @export
 * @class CSSBundleClass
 * @implements {Plugin}
 */
export class CSSBundleClass implements Plugin {

    constructor(opts: any = {}) {
        // if ("ext" in opts) { this.ext = opts.ext; }
        // if ("name" in opts) { this.bundleName = opts.name; }
        // if ("delimiter" in opts) { this.delimiter = opts.delimiter; }
    }
    /**
     * 
     * 
     * @type {RegExp}
     * @memberOf FuseBoxHTMLPlugin
     */
    public test: RegExp = /\.css$/;

    /**
     * 
     * 
     * @param {WorkFlowContext} context
     * 
     * @memberOf FuseBoxHTMLPlugin
     */
    public init(context: WorkFlowContext) {

    }

    public transformGroup(group: File) {
        let contents = [];
        console.log("tranform group", group);
        // group.subFiles.forEach(file => {
        //     contents.push(file.contents);
        // });
    }

};

export const CSSBundle = (opts?: any) => {
    return new CSSBundleClass(opts);
};

