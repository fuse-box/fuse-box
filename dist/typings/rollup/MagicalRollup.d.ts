import { WorkFlowContext } from "../core/WorkflowContext";
export declare class MagicalRollup {
    context: WorkFlowContext;
    private outFile;
    private entryFile;
    private contents;
    opts: any;
    constructor(context: WorkFlowContext);
    debug(msg: string): void;
    parse(): any;
    /**
     *
     *
     * @private
     * @param {*} files
     *
     * @memberOf Reverse
     */
    private rollup(files);
}
