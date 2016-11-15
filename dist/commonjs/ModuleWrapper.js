"use strict";
const Config_1 = require("./Config");
const path = require("path");
const fs = require("fs");
class ModuleWrapper {
    static wrapFinal(contents, entryPoint, standalone) {
        let userContents = ["(function(){\n"];
        if (standalone) {
            let fuseboxLibFile = path.join(Config_1.Config.ASSETS_DIR, standalone ? "fusebox.min.js" : "local.js");
            let wrapper = fs.readFileSync(fuseboxLibFile).toString();
            userContents.push(wrapper);
        }
        userContents.push("\n" + contents);
        if (entryPoint) {
            userContents.push(`\nFuseBox.import("${entryPoint}")`);
        }
        userContents.push("})()");
        return userContents.join('');
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
