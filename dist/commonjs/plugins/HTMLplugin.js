"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class FuseBoxHTMLPlugin {
    constructor(opts = {}) {
        this.useDefault = true;
        this.test = /\.html$/;
        if (opts.useDefault !== undefined) {
            this.useDefault = opts.useDefault;
        }
    }
    init(context) {
        context.allowExtension(".html");
    }
    transform(file) {
        let context = file.context;
        if (context.useCache) {
            let cached = context.cache.getStaticCache(file);
            if (cached) {
                file.isLoaded = true;
                file.contents = cached.contents;
                return;
            }
        }
        file.loadContents();
        if (this.useDefault) {
            file.contents = `module.exports.default =  ${JSON.stringify(file.contents)}`;
        }
        else {
            file.contents = `module.exports =  ${JSON.stringify(file.contents)}`;
        }
        if (context.useCache) {
            context.emitJavascriptHotReload(file);
            context.cache.writeStaticCache(file, file.sourceMap);
        }
    }
}
exports.FuseBoxHTMLPlugin = FuseBoxHTMLPlugin;
;
exports.HTMLPlugin = (opts) => {
    return new FuseBoxHTMLPlugin(opts);
};
