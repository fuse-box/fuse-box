import { WorkFlowContext } from "./WorkflowContext";
import { Config } from "./Config";
import * as path from "path";
import * as fs from "fs";


/**
 *
 *
 * @export
 * @class ModuleWrapper
 */
export class ModuleWrapper {

    public static wrapFinal(context: WorkFlowContext, contents: string, entryPoint: string, standalone: boolean) {


        let userContents = ["(function(){\n"];
        if (standalone) {
            let fuseboxLibFile = path.join(Config.ASSETS_DIR, standalone ? "fusebox.min.js" : "local.js");
            let wrapper = fs.readFileSync(fuseboxLibFile).toString();
            userContents.push(wrapper);
        }
        userContents.push("\n" + contents);
        // Handle globals
        if (context.globals.length > 0) {
            let data = [];
            context.globals.forEach(name => {
                if (name === "default" && entryPoint) {
                    data.push(`default/` + entryPoint);
                    entryPoint = undefined;
                } else {
                    data.push(name);
                }
            });
            userContents.push(`\nFuseBox.expose(${JSON.stringify(data)})`);
        }

        if (entryPoint) {
            userContents.push(`\nFuseBox.import("${entryPoint}")`);
        }
        userContents.push("})()");
        return userContents.join("");
    }

    public static wrapModule(name: string, conflictingVersions: Map<string, string>, content: string, entry?: string) {
        let conflictingSource = {};
        conflictingVersions.forEach((version, libname) => {
            conflictingSource[libname] = version;
        });
        return `FuseBox.module("${name}", ${JSON.stringify(conflictingSource)}, function(___scope___){
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