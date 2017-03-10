"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class EnvPluginClass {
    constructor(env) {
        this.env = env;
    }
    bundleStart(context) {
        context.source.addContent(`var __process_env__ = ${JSON.stringify(this.env)};`);
    }
}
exports.EnvPluginClass = EnvPluginClass;
exports.EnvPlugin = (banner) => {
    return new EnvPluginClass(banner);
};
