"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let stylus;
class StylusPluginClass {
    constructor(options) {
        this.test = /\.styl$/;
        this.options = options || {};
    }
    init(context) {
        context.allowExtension(".styl");
    }
    transform(file) {
        const context = file.context;
        const options = Object.assign({}, this.options);
        const sourceMapDef = {
            comment: false,
            sourceRoot: file.info.absDir,
        };
        file.loadContents();
        if (!stylus)
            stylus = require("stylus");
        options.filename = file.info.fuseBoxPath;
        if ("sourceMapConfig" in context) {
            options.sourcemap = Object.assign({}, sourceMapDef, this.options.sourcemap || {});
        }
        return new Promise((res, rej) => {
            const renderer = stylus(file.contents, options);
            return renderer.render((err, css) => {
                if (err)
                    return rej(err);
                if (renderer.sourcemap) {
                    file.sourceMap = JSON.stringify(renderer.sourcemap);
                }
                file.contents = css;
                return res(css);
            });
        });
    }
}
exports.StylusPluginClass = StylusPluginClass;
exports.StylusPlugin = (options) => {
    return new StylusPluginClass(options);
};
