import { WorkFlowContext } from "./WorkflowContext";
import { File } from "./File";
export declare class PluginChain {
    file: File;
    opts: any;
    context: WorkFlowContext;
    methodName: string;
    constructor(name: string, file: File, opts?: any);
    setContext(context: WorkFlowContext): void;
}
