import { WorkFlowContext } from "./../WorkflowContext";
import { Plugin } from "../WorkflowContext";

export interface HotReloadPluginOptions { 
    /** The port that the client JS connects to */
    port?: number | string 
}

/**
 * Hot reload plugin
 */
export class HotReloadPluginClass implements Plugin {
    public dependencies = ["fusebox-hot-reload"];
    public port: any = "";
    constructor(opts: HotReloadPluginOptions = {}) {
        if (opts.port) {
            this.port = opts.port;
        }
    }
    public init() { }

    public bundleEnd(context: WorkFlowContext) {
        context.source.addContent(`FuseBox.import("fusebox-hot-reload").connect(${this.port})`);
    }
};

export const HotReloadPlugin = (opts?: HotReloadPluginOptions) => {
    return new HotReloadPluginClass(opts);
};

