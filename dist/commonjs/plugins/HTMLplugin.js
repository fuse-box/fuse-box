"use strict";
class FuseBoxHTMLPlugin {
    constructor() {
        this.test = /\.html$/;
    }
    init(context) {
        context.allowExtension(".html");
    }
    transform(file) {
        file.contents = `module.exports.default =  ${JSON.stringify(file.contents)}`;
    }
}
exports.FuseBoxHTMLPlugin = FuseBoxHTMLPlugin;
;
exports.HTMLPlugin = new FuseBoxHTMLPlugin();
