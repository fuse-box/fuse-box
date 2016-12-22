"use strict";
let stylus;
class StylusPluginClass {
    constructor(options) {
        this.test = /\.styl$/;
        this.options = options || {};
    }
    init(context) {
        context.allowExtension('.styl');
    }
    transform(file) {
        file.loadContents();
        if (!stylus)
            stylus = require('stylus');
        return new Promise((res, rej) => {
            return stylus.render(file.contents, this.options, (err, css) => {
                if (err)
                    return rej(err);
                file.contents = css;
                return res(file);
            });
        });
    }
}
exports.StylusPluginClass = StylusPluginClass;
exports.StylusPlugin = (options) => {
    return new StylusPluginClass(options);
};
