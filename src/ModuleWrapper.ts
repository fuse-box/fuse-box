import { FuseBox } from './FuseBox';

import * as path from "path";
import * as fs from "fs";
const appRoot = require("app-root-path");

/**
 *
 *
 * @export
 * @class ModuleWrapper
 */
export class ModuleWrapper {

    public static wrapFinal(contents: string, entryPoint: string, standalone: boolean) {
        let file = `${__dirname}/../../assets/${standalone ? "fusebox" : "local"}.js`;
        let wrapper = fs.readFileSync(file).toString();
        if (entryPoint) {
            let entryJS = `FuseBox.import("${entryPoint}")`;
            wrapper = wrapper.split("// entry").join(entryJS);
        }
        wrapper = wrapper.split("// contents").join(contents);
        return wrapper;
    }

    public static wrapModule(name: string, content: string, entry?: string) {
        return `FuseBox.module("${name}", function(___scope___){
${content}
${entry ? 'return ___scope___.entry("' + entry + '")' : ""}
})`;
    }
    /**
     *
     *
     * @static
     * @param {string} name
     * @param {string} content
     * @returns
     *
     * @memberOf ModuleWrapper
     */
    public static wrapGeneric(name: string, content: string) {
        let fn = `___scope___.file("${name}", function(exports, require, module, __filename, __dirname){
${content}
});`;
        return fn;
    }
}