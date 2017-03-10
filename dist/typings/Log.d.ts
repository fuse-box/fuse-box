import { ModuleCollection } from "./core/ModuleCollection";
import { WorkFlowContext } from "./core/WorkflowContext";
export declare class Log {
    context: WorkFlowContext;
    private timeStart;
    private totalSize;
    private printLog;
    constructor(context: WorkFlowContext);
    echoWith(str: string, opt: string): void;
    echo(str: string): void;
    echoStatus(str: string): void;
    echoWarning(str: string): void;
    echoDefaultCollection(collection: ModuleCollection, contents: string): void;
    echoCollection(collection: ModuleCollection, contents: string): void;
    end(header?: string): void;
    echoBundleStats(header: string, size: number, took: [number, number]): void;
}
