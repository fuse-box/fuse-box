"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Config_1 = require("./../Config");
const fs = require("fs");
const path = require("path");
class TypeScriptHelpersClass {
    constructor(opts) {
        this.test = /\.tsx?$/;
        this.registeredHelpers = new Map();
        opts = opts || {};
        let folder = path.join(Config_1.Config.FUSEBOX_MODULES, "fuse-typescript-helpers");
        let files = fs.readdirSync(folder);
        files.forEach(fileName => {
            let contents = fs.readFileSync(path.join(folder, fileName)).toString();
            let name = fileName.replace(/\.js/, "");
            this.registeredHelpers.set(name, contents);
        });
    }
    init(context) {
        context.setItem("ts_helpers", new Set());
    }
    bundleEnd(context) {
        let helpers = context.getItem("ts_helpers");
        helpers.forEach(name => {
            let contents = this.registeredHelpers.get(name);
            context.source.addContent(contents);
        });
    }
    transform(file) {
        let patchDecorate = false;
        if (file.collection.name !== file.context.defaultPackageName) {
            return;
        }
        let helpers = file.context.getItem("ts_helpers");
        this.registeredHelpers.forEach((cont, name) => {
            let regexp = new RegExp(name, "gm");
            if (regexp.test(file.contents)) {
                if (name === "__decorate") {
                    patchDecorate = true;
                    if (file.headerContent && file.headerContent.indexOf("var __decorate = __fsbx_decorate(arguments)") === 0) {
                        patchDecorate = false;
                    }
                }
                if (!helpers.has(name)) {
                    helpers.add(name);
                }
            }
        });
        if (patchDecorate) {
            file.addHeaderContent("var __decorate = __fsbx_decorate(arguments)");
        }
    }
}
exports.TypeScriptHelpersClass = TypeScriptHelpersClass;
exports.TypeScriptHelpers = () => {
    return new TypeScriptHelpersClass({});
};
