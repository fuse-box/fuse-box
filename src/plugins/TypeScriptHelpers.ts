import { Config } from "./../Config";
import { File } from "../core/File";
import { WorkFlowContext, Plugin } from "../core/WorkflowContext";
import * as fs from "fs";
import * as path from "path";

export interface TypeScriptHelpersOptions {

}

/**
 *
 *
 * @export
 * @class FuseBoxTypeScriptHelpersPlugin
 * @implements {Plugin}
 */
export class TypeScriptHelpersClass implements Plugin {
    /**
     *
     *
     * @type {RegExp}
     * @memberOf FuseBoxTypeScriptHelpersPlugin
     */
    public test: RegExp = /\.tsx?$/;

    private registeredHelpers: Map<string, string> = new Map();

    constructor(opts: TypeScriptHelpersOptions = {}) {
        let folder = path.join(Config.FUSEBOX_MODULES, "fuse-typescript-helpers");
        let files = fs.readdirSync(folder);
        files.forEach(fileName => {
            let contents = fs.readFileSync(path.join(folder, fileName)).toString();
            let name = fileName.replace(/\.js/, "");
            this.registeredHelpers.set(name, contents);
        });
    }

    /**
     *
     *
     * @param {WorkFlowContext} context
     *
     * @memberOf FuseBoxTypeScriptHelpersPlugin
     */
    public init(context: WorkFlowContext) {
        context.setItem("ts_helpers", new Set());
    }

    public bundleEnd(context: WorkFlowContext) {
        let helpers: Set<string> = context.getItem("ts_helpers");
        helpers.forEach(name => {
            let contents = this.registeredHelpers.get(name);
            context.source.addContent(contents);
        });
    }

    /**
     *
     *
     * @param {File} file
     *
     * @memberOf FuseBoxTypeScriptHelpersPlugin
     */
    public transform(file: File) {
        let patchDecorate = false;

        // Ignore anything but our current package
        if (file.collection.name !== file.context.defaultPackageName) {
            return;
        }
        let helpers: Set<string> = file.context.getItem("ts_helpers");
        // Check which helpers are actually used
        this.registeredHelpers.forEach((cont, name) => {
            let regexp = new RegExp(name, "gm");
            if (regexp.test(file.contents)) {

                if (name === "__decorate") {
                    patchDecorate = true;
                    // temp solution
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

export let TypeScriptHelpers = (options?: TypeScriptHelpersOptions) => {
    return new TypeScriptHelpersClass(options);
};
