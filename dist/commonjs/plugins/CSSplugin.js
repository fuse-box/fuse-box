"use strict";
class FuseBoxCSSPlugin {
    constructor() {
        this.test = /\.css$/;
        this.dependencies = ["fsb-default-css-plugin"];
    }
    init(context) {
        context.allowExtension(".css");
    }
    transform(file) {
        let contents = file.contents.replace(/\s{2,}/g, " ").replace(/\t|\r|\n/g, "").trim();
        file.contents = `require("fsb-default-css-plugin")(__filename, ${JSON.stringify(contents)} );`;
    }
}
exports.FuseBoxCSSPlugin = FuseBoxCSSPlugin;
exports.CSSPlugin = new FuseBoxCSSPlugin();
