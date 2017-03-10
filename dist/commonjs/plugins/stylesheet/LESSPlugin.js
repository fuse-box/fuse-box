"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
        const context = file.context;
        const options = Object.assign({}, this.options);
        file.loadContents();
        const sourceMapDef = {
            sourceMapBasepath: ".",
            sourceMapRootpath: file.info.absDir,
        };
        if (!less) {
            less = require("less");
        }
        options.filename = file.info.fuseBoxPath;
        if ("sourceMapConfig" in context) {
            options.sourceMap = Object.assign({}, sourceMapDef, options.sourceMap || {});
        }
        return less.render(file.contents, options).then(output => {
            if (output.map) {
                file.sourceMap = output.map;
            }
            file.contents = output.css;
        });
    }
}
exports.LESSPluginClass = LESSPluginClass;
exports.LESSPlugin = (opts) => {
    return new LESSPluginClass(opts);
};
