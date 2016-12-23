import { WorkFlowContext } from "./../WorkflowContext";
import { Plugin } from "../WorkflowContext";
export declare class BannerPluginClass implements Plugin {
    test: RegExp;
    banner: string;
    constructor(banner: string);
    preBundle(context: WorkFlowContext): void;
}
export declare const BannerPlugin: (banner: string) => BannerPluginClass;
