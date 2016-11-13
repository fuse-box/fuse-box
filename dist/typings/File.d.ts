import { WorkFlowContext } from "./WorkflowContext";
import { IPathInformation } from "./PathMaster";
export declare function extractRequires(contents: string, absPath: string): string[];
export declare class File {
    context: WorkFlowContext;
    info: IPathInformation;
    absPath: string;
    contents: string;
    isLoaded: boolean;
    isNodeModuleEntry: boolean;
    constructor(context: WorkFlowContext, info: IPathInformation);
    getCrossPlatormPath(): string;
    consume(): string[];
}
