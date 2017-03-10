"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
        return postcss(this.processors)
            .process(file.contents, this.opts)
            .then(result => {
            file.contents = result.css;
            return result.css;
        });
    }
}
exports.PostCSSPluginClass = PostCSSPluginClass;
exports.PostCSS = (processors, opts) => {
    return new PostCSSPluginClass(processors, opts);
};
