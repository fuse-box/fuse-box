"use strict";
let postcss;
class PostCSSPluginClass {
    constructor(processors, opts) {
        this.processors = processors;
        this.opts = opts;
        this.test = /\.css$/;
        this.dependencies = [];
        this.opts = this.opts || {};
        this.processors = this.processors || [];
    }
    init(context) {
        context.allowExtension(".css");
    }
    transform(file) {
        file.loadContents();
        if (!postcss) {
            postcss = require("postcss");
        }
        return new Promise((resolve, reject) => {
            return postcss(this.processors).process(file.contents).then(result => {
                file.contents = result.css;
                return resolve(file.createChain("style", file));
            });
        });
    }
}
exports.PostCSSPluginClass = PostCSSPluginClass;
exports.PostCSS = (processors, opts) => {
    return new PostCSSPluginClass(processors, opts);
};
