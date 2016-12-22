"use strict";
let less;
class LESSPluginClass {
    constructor(options) {
        this.test = /\.less$/;
        this.options = options || {};
    }
    init(context) {
        context.allowExtension(".less");
    }
    transform(file) {
        file.loadContents();
        if (!less) {
            less = require("less");
        }
        return less.render(file.contents, this.options).then(output => {
            file.contents = output.css;
        });
    }
}
exports.LESSPluginClass = LESSPluginClass;
exports.LESSPlugin = (opts) => {
    return new LESSPluginClass(opts);
};
