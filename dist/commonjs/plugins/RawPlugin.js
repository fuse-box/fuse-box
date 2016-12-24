"use strict";
class RawPluginClass {
    constructor(options) {
        this.test = /.*/;
        if ('extensions' in (options || {}))
            this.extensions = options.extensions;
    }
    init(context) {
        if (Array.isArray(this.extensions)) {
            return this.extensions.forEach(ext => context.allowExtension(ext));
        }
        return this.extensions !== undefined && context.allowExtension(this.extensions);
    }
    transform(file) {
        file.loadContents();
        file.contents = `module.exports = ${JSON.stringify(file.contents)}`;
    }
}
exports.RawPluginClass = RawPluginClass;
exports.RawPlugin = (options) => {
    return new RawPluginClass(options);
};
