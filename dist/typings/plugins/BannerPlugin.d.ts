import { WorkFlowContext } from "./../core/WorkflowContext";
import { Plugin } from "../core/WorkflowContext";
/**
 * @export
 * @class BannerPluginClass
 * @implements {Plugin}
 */
export declare class BannerPluginClass implements Plugin {
    /**
     * @type {RegExp}
     * @memberOf BannerPluginClass
     */
    test: RegExp;
    banner: string;
    constructor(banner: string);
    preBundle(context: WorkFlowContext): void;
}
export declare const BannerPlugin: (banner: string) => BannerPluginClass;
