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
