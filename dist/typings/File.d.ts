import { ModuleCollection } from "./ModuleCollection";
import { FileAnalysis } from "./FileAnalysis";
import { WorkFlowContext } from "./WorkflowContext";
import { IPathInformation } from "./PathMaster";
export declare class File {
    context: WorkFlowContext;
    info: IPathInformation;
    isFuseBoxBundle: boolean;
    notFound: boolean;
    absPath: string;
    contents: string;
    isLoaded: boolean;
    isNodeModuleEntry: boolean;
    collection: ModuleCollection;
    headerContent: string[];
    isTypeScript: boolean;
    sourceMap: any;
    analysis: FileAnalysis;
    resolving: Promise<any>[];
    constructor(context: WorkFlowContext, info: IPathInformation);
    getCrossPlatormPath(): string;
    tryPlugins(_ast?: any): void;
    addHeaderContent(str: string): void;
    loadContents(): void;
    consume(): void;
    private handleTypescript();
}
