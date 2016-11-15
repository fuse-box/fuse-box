"use strict";
class CSSPlugin {
    constructor(opts) {
        this.test = /\.css$/;
        this.dependencies = ["fsb-default-css-plugin"];
        this.minify = false;
        opts = opts || {};
        if (opts.minify !== undefined) {
            this.minify = opts.minify;
        }
    }
    init(context) {
        context.allowExtension(".css");
    }
    transform(file) {
        let contents = this.minify ?
            file.contents.replace(/\s{2,}/g, " ").replace(/\t|\r|\n/g, "").trim() : file.contents;
        file.contents = `require("fsb-default-css-plugin")(__filename, ${JSON.stringify(contents)} );`;
    }
}
exports.CSSPlugin = CSSPlugin;
