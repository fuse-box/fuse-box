import { WorkFlowContext } from "./WorkflowContext";
export interface PathInformation {
    isNodeModule: boolean;
}
export declare class PathMaster {
    context: WorkFlowContext;
    moduleRoot: string;
    constructor(context: WorkFlowContext, moduleRoot?: string);
    resolve(name: string, root: string): PathInformation;
}
