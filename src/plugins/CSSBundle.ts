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
    public test: RegExp = /\.css$/;
    constructor(opts: any = {}) { }
    public init(context: WorkFlowContext) { }

    public transformGroup(group: File) {
        let contents = [];
    }

};

export const CSSBundle = (opts?: any) => {
    return new CSSBundleClass(opts);
};

