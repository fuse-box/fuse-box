"use strict";
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
        file.loadContents();
        if (this.useDefault) {
            file.contents = `module.exports.default =  ${JSON.stringify(file.contents)}`;
        }
        else {
            file.contents = `module.exports =  ${JSON.stringify(file.contents)}`;
        }
    }
}
exports.FuseBoxHTMLPlugin = FuseBoxHTMLPlugin;
;
exports.HTMLPlugin = (opts) => {
    return new FuseBoxHTMLPlugin(opts);
};
