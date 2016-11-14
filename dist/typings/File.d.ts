import { WorkFlowContext } from "./WorkflowContext";
import { IPathInformation } from "./PathMaster";
export declare function extractRequires(contents: string, absPath: string): {
    requires: any[];
    ast: any;
};
export declare class File {
    context: WorkFlowContext;
    info: IPathInformation;
    absPath: string;
    contents: string;
    isLoaded: boolean;
    isNodeModuleEntry: boolean;
    constructor(context: WorkFlowContext, info: IPathInformation);
    getCrossPlatormPath(): string;
    tryPlugins(_ast?: any): void;
    consume(): string[];
}
