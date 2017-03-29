import { WorkFlowContext } from "../core/WorkflowContext";
import { Plugin } from "../core/WorkflowContext";

export interface HotReloadPluginOptions {
    /** The port that the client JS connects to */
    port?: number | string,
    uri?: string;
}

/**
 * Hot reload plugin
 */
export class HotReloadPluginClass implements Plugin {
    public dependencies = ["fusebox-hot-reload"];
    public port: any = "";
    public uri: any = "";
    constructor(opts: HotReloadPluginOptions = {}) {
        if (opts.port) {
            this.port = opts.port;
        }
        if (opts.uri) {
            this.uri = opts.uri;
        }
    }
    public init() { }

    public bundleEnd(context: WorkFlowContext) {
        context.source.addContent(`FuseBox.import("fusebox-hot-reload").connect(${this.port}, ${JSON.stringify(this.uri)})`);
    }
};

export const HotReloadPlugin = (options?: HotReloadPluginOptions) => {
    return new HotReloadPluginClass(options);
};

