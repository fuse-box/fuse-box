"use strict";
class FuseBoxCSSPlugin {
    constructor() {
        this.test = /\.css$/;
    }
    init(context) {
        context.allowExtension(".css");
    }
    transform(file) {
        file.contents = `
if (typeof window !== 'undefined') {
var styleId = encodeURIComponent(__filename);
var exists = document.getElementById(styleId);
if (!exists) {
    var s = document.createElement("style");
    s.id = styleId;
    s.innerHTML =${JSON.stringify(file.contents)};
    document.getElementsByTagName("head")[0].appendChild(s);
}}`;
    }
}
exports.FuseBoxCSSPlugin = FuseBoxCSSPlugin;
exports.CSSPlugin = new FuseBoxCSSPlugin();
