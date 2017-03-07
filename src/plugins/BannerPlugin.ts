import { WorkFlowContext } from "./../core/WorkflowContext";
import { Plugin } from "../core/WorkflowContext";

/**
 * @export
 * @class BannerPluginClass
 * @implements {Plugin}
 */
export class BannerPluginClass implements Plugin {
    /**
     * @type {RegExp}
     * @memberOf BannerPluginClass
     */
    public test: RegExp = /\.js$/;
    public banner: string;

    constructor(banner: string) {
        this.banner = banner || "";
    }

    public preBundle(context: WorkFlowContext) {
        context.source.addContent(this.banner);
    }
}

export const BannerPlugin = (banner: string) => {
    return new BannerPluginClass(banner);
};
