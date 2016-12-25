import { File } from '../File';
import { WorkFlowContext } from '../WorkflowContext';
import { Plugin } from '../WorkflowContext';
export declare class RawPluginClass implements Plugin {
    test: RegExp;
    extensions: Array<string>;
    constructor(options: any);
    init(context: WorkFlowContext): void;
    transform(file: File): void;
}
export declare const RawPlugin: (options: any) => RawPluginClass;
