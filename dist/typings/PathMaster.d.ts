import { WorkFlowContext } from "./WorkflowContext";
export interface INodeModuleRequire {
    name: string;
    target?: string;
}
export interface PathInformation {
    isNodeModule: boolean;
    nodeModuleName?: string;
    nodeModulePartialOriginal?: string;
    absPath?: string;
}
export declare class PathMaster {
    context: WorkFlowContext;
    moduleRoot: string;
    constructor(context: WorkFlowContext, moduleRoot?: string);
    resolve(name: string, root: string): PathInformation;
    private ensureFolderAndExtensions(name, root);
    private getNodeModuleInfo(name);
}
