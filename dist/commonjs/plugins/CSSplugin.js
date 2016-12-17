"use strict";
const fs = require("fs");
const path = require("path");
const Config_1 = require("./../Config");
const realm_utils_1 = require("realm-utils");
class CSSPluginClass {
    constructor(opts) {
        this.test = /\.css$/;
        this.dependencies = ["fsb-default-css-plugin"];
        this.minify = false;
        opts = opts || {};
        if (opts.minify !== undefined) {
            this.minify = opts.minify;
        }
        if (opts.serve !== undefined) {
            this.serve = opts.serve;
        }
    }
    init(context) {
        context.allowExtension(".css");
    }
    bundleStart(context) {
        let lib = path.join(Config_1.Config.LOCAL_LIBS, "fsbx-default-css-plugin", "index.js");
        context.source.addContent(fs.readFileSync(lib).toString());
    }
    transform(file) {
        file.loadContents();
        let contents = "";
        let filePath = file.info.fuseBoxPath;
        let serve = false;
        if (this.serve) {
            if (realm_utils_1.utils.isFunction(this.serve)) {
                let userResult = this.serve(file.info.fuseBoxPath, file);
                if (realm_utils_1.utils.isString(userResult)) {
                    filePath = userResult;
                    serve = true;
                }
            }
        }
        if (serve) {
            contents = `__fsbx_css("${filePath}")`;
        }
        else {
            let cssContent = this.minify ?
                file.contents.replace(/\s{2,}/g, " ").replace(/\t|\r|\n/g, "").trim() : file.contents;
            contents = `__fsbx_css("${filePath}", ${JSON.stringify(cssContent)})`;
        }
        file.contents = contents;
    }
}
exports.CSSPluginClass = CSSPluginClass;
exports.CSSPlugin = (opts) => {
    return new CSSPluginClass(opts);
};
