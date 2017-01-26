import { File } from "../File";
import { WorkFlowContext } from "./../WorkflowContext";
import { Plugin } from "../WorkflowContext";

/**
 * 
 * 
 * @export
 * @class FuseBoxHTMLPlugin
 * @implements {Plugin}
 */
export class HotReloadPluginClass implements Plugin {
    public dependencies = ["fusebox-hot-reload"];
    constructor(opts: any = {}) { }
    public init() { }

    public bundleEnd(context: WorkFlowContext) {
        context.source.addContent(`FuseBox.import("fusebox-hot-reload").connect()`);
    }
};

export const HotReloadPlugin = (opts?: any) => {
    return new HotReloadPluginClass(opts);
};

