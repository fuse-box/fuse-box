import { File } from './File';
import { WorkFlowContext } from "./WorkflowContext";
export declare class ModuleWrapper {
    static wrapFinal(context: WorkFlowContext, contents: string, entryPoint: string, standalone: boolean): string;
    static wrapModule(name: string, conflictingVersions: Map<string, string>, content: string, entry?: string): string;
    static wrapFile(file: File): string;
}
