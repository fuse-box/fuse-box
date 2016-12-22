import { File } from '../File';
import { WorkFlowContext } from '../WorkflowContext';
import { Plugin } from '../WorkflowContext';
export declare class StylusPluginClass implements Plugin {
    test: RegExp;
    options: any;
    constructor(options: any);
    init(context: WorkFlowContext): void;
    transform(file: File): Promise<any>;
}
export declare const StylusPlugin: (options: any) => StylusPluginClass;
