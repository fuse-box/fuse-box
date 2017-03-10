"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const realm_utils_1 = require("realm-utils");
const Utils_1 = require("../Utils");
class RawPluginClass {
    constructor(options) {
        this.test = /.*/;
        if (realm_utils_1.utils.isPlainObject(options)) {
            if ("extensions" in (options || {}))
                this.extensions = options.extensions;
        }
        if (realm_utils_1.utils.isArray(options)) {
            this.extensions = [];
            options.forEach(str => {
                this.extensions.push("." + Utils_1.extractExtension(str));
            });
            this.test = Utils_1.string2RegExp(options.join("|"));
        }
    }
    init(context) {
        if (Array.isArray(this.extensions)) {
            return this.extensions.forEach(ext => context.allowExtension(ext));
        }
    }
    transform(file) {
        const context = file.context;
        if (context.useCache) {
            let cached = context.cache.getStaticCache(file);
            if (cached) {
                file.isLoaded = true;
                file.analysis.skip();
                file.contents = cached.contents;
                return;
            }
        }
        file.loadContents();
        file.contents = `module.exports = ${JSON.stringify(file.contents)}`;
        if (context.useCache) {
            context.emitJavascriptHotReload(file);
            context.cache.writeStaticCache(file, file.sourceMap);
        }
    }
}
exports.RawPluginClass = RawPluginClass;
exports.RawPlugin = (options) => {
    return new RawPluginClass(options);
};
