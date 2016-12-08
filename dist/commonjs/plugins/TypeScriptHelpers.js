"use strict";
const Config_1 = require("./../Config");
const fs = require("fs");
const path = require("path");
class TypeScriptHelpersClass {
    constructor(opts) {
        this.test = /(\.js|\.ts)$/;
        this.registeredHelpers = new Map();
        opts = opts || {};
        let folder = path.join(Config_1.Config.LOCAL_LIBS, "fuse-typescript-helpers");
        let files = fs.readdirSync(folder);
        files.forEach(fileName => {
            let contents = fs.readFileSync(path.join(folder, fileName)).toString();
            let name = fileName.replace(/\.js/, "");
            this.registeredHelpers.set(name, contents);
        });
    }
    init(context) {
        this.helpers = new Set();
    }
    bundleEnd(context) {
        this.helpers.forEach(name => {
            let contents = this.registeredHelpers.get(name);
            context.source.addContent(contents);
        });
    }
    transform(file) {
        let patchDecorate = false;
        this.registeredHelpers.forEach((cont, name) => {
            let regexp = new RegExp(name, "gm");
            if (regexp.test(file.contents)) {
                if (name === "__decorate") {
                    patchDecorate = true;
                }
                if (!this.helpers.has(name)) {
                    this.helpers.add(name);
                }
            }
        });
        if (patchDecorate) {
            file.addHeaderContent("var __decorate = __fsbx_decorate(arguments)");
        }
    }
}
exports.TypeScriptHelpersClass = TypeScriptHelpersClass;
exports.TypeScriptHelpers = new TypeScriptHelpersClass({});
