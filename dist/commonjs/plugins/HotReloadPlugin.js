"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class HotReloadPluginClass {
    constructor(opts = {}) {
        this.dependencies = ["fusebox-hot-reload"];
        this.port = "";
        this.uri = "";
        if (opts.port) {
            this.port = opts.port;
        }
        if (opts.uri) {
            this.uri = opts.uri;
        }
    }
    init() { }
    bundleEnd(context) {
        context.source.addContent(`FuseBox.import("fusebox-hot-reload").connect(${this.port}, ${JSON.stringify(this.uri)})`);
    }
}
exports.HotReloadPluginClass = HotReloadPluginClass;
;
exports.HotReloadPlugin = (opts) => {
    return new HotReloadPluginClass(opts);
};
