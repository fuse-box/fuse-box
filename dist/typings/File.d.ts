import { WorkFlowContext } from "./WorkflowContext";
import { IPathInformation } from "./PathMaster";
export declare class File {
    context: WorkFlowContext;
    info: IPathInformation;
    absPath: string;
    contents: string;
    isLoaded: boolean;
    isNodeModuleEntry: boolean;
    headerContent: string[];
    isTypeScript: boolean;
    resolving: Promise<any>[];
    constructor(context: WorkFlowContext, info: IPathInformation);
    getCrossPlatormPath(): string;
    tryPlugins(_ast?: any): void;
    addHeaderContent(str: string): void;
    consume(): string[];
    private handleTypescript();
}
