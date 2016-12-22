"use strict";
const fs = require("fs");
const path = require("path");
const Config_1 = require("./../Config");
const realm_utils_1 = require("realm-utils");
class CSSPluginClass {
    constructor(opts) {
        this.test = /\.css$/;
        this.dependencies = ["fsb-default-css-plugin"];
        this.raw = false;
        this.minify = false;
        opts = opts || {};
        if (opts.raw !== undefined) {
            this.raw = opts.raw;
        }
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
        let contents;
        let filePath = file.info.fuseBoxPath;
        let serve = false;
        if (file.params && file.params.get("raw") !== undefined) {
            let cssContent = (this.minify) ? this.minifyContents(file.contents) : file.contents;
            file.contents = `exports.default = ${JSON.stringify(cssContent)};`;
            return;
        }
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
            let cssContent = this.minify ? this.minifyContents(file.contents) : file.contents;
            contents = `__fsbx_css("${filePath}", ${JSON.stringify(cssContent)})`;
        }
        file.contents = contents;
    }
    minifyContents(contents) {
        return contents.replace(/\s{2,}/g, " ").replace(/\t|\r|\n/g, "").trim();
    }
}
exports.CSSPluginClass = CSSPluginClass;
exports.CSSPlugin = (opts) => {
    return new CSSPluginClass(opts);
};
