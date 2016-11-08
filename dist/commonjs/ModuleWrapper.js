"use strict";
const Config_1 = require("./Config");
const path = require("path");
const fs = require("fs");
class ModuleWrapper {
    static wrapFinal(contents, entryPoint, standalone) {
        let file = path.join(Config_1.Config.ASSETS_DIR, standalone ? "FuseBox.js" : "local.js");
        let wrapper = fs.readFileSync(file).toString();
        if (entryPoint) {
            let entryJS = `FuseBox.import("${entryPoint}")`;
            wrapper = wrapper.split("// entry").join(entryJS);
        }
        wrapper = wrapper.split("// contents").join(contents);
        return wrapper;
    }
    static wrapModule(name, conflictingVersions, content, entry) {
        let conflictingSource = {};
        conflictingVersions.forEach((version, libname) => {
            conflictingSource[libname] = version;
        });
        return `FuseBox.module("${name}", ${JSON.stringify(conflictingSource)}, function(___scope___){
${content}
${entry ? 'return ___scope___.entry("' + entry + '")' : ""}
})`;
    }
    static wrapGeneric(name, content) {
        let fn = `___scope___.file("${name}", function(exports, require, module, __filename, __dirname){
${content}
});`;
        return fn;
    }
}
exports.ModuleWrapper = ModuleWrapper;
