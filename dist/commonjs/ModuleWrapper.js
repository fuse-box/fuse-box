"use strict";
const fs = require("fs");
const appRoot = require("app-root-path");
class ModuleWrapper {
    static wrapFinal(contents, entryPoint, standalone) {
        let file = `${__dirname}/../../assets/${standalone ? "fusebox" : "local"}.js`;
        let wrapper = fs.readFileSync(file).toString();
        if (entryPoint) {
            let entryJS = `FuseBox.import("${entryPoint}")`;
            wrapper = wrapper.split("// entry").join(entryJS);
        }
        wrapper = wrapper.split("// contents").join(contents);
        return wrapper;
    }
    static wrapModule(name, content, entry) {
        return `FuseBox.module("${name}", function(___scope___){
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
