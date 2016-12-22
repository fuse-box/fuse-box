import { PluginChain } from '../PluginChain';
import { File } from "../File";
import { WorkFlowContext } from "./../WorkflowContext";
import { Plugin } from "../WorkflowContext";
export declare class PostCSSPluginClass implements Plugin {
    processors: any;
    opts: any;
    test: RegExp;
    dependencies: any[];
    constructor(processors: any, opts: any);
    init(context: WorkFlowContext): void;
    transform(file: File): Promise<PluginChain>;
}
export declare const PostCSS: (processors?: any, opts?: any) => PostCSSPluginClass;
