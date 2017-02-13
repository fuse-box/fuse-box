import { File } from "../File";
import { WorkFlowContext } from "./../WorkflowContext";
import { Plugin } from "../WorkflowContext";

export interface CSSBundleOptions {

}

/**
 * 
 * 
 * @export
 * @class CSSBundleClass
 * @implements {Plugin}
 */
export class CSSBundleClass implements Plugin {
    public test: RegExp = /\.css$/;
    constructor(opts: CSSBundleOptions) { }
    public init(context: WorkFlowContext) { }

    public transformGroup(group: File) {

    }

};

export const CSSBundle = (opts: CSSBundleOptions = {}) => {
    return new CSSBundleClass(opts);
};

