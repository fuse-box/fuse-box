import { Config } from "./../Config";
import { File } from "../File";
import { WorkFlowContext } from "./../WorkflowContext";
import { Plugin } from "../WorkflowContext";
import * as fs from "fs";
import * as path from "path";
/**
 *
 *
 * @export
 * @class FuseBoxCSSPlugin
 * @implements {Plugin}
 */
export class TypeScriptHelpersClass implements Plugin {
    /**
     *  
     *
     * @type {RegExp}
     * @memberOf FuseBoxCSSPlugin
     */
    public test: RegExp = /(\.js|\.ts)$/;

    private helpers: Set<string>;
    private registeredHelpers: Map<string, string> = new Map();


    constructor(opts: any) {
        opts = opts || {};

        let folder = path.join(Config.LOCAL_LIBS, "fuse-typescript-helpers")
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
     * @memberOf FuseBoxCSSPlugin
     */
    public init(context: WorkFlowContext) {
        this.helpers = new Set();
    }


    public bundleEnd(context: WorkFlowContext) {
        this.helpers.forEach(name => {
            let contents = this.registeredHelpers.get(name);
            context.source.addContent(contents);
        });
    }
    /**
     *
     *
     * @param {File} file
     *
     * @memberOf FuseBoxCSSPlugin
     */
    public transform(file: File) {
        let patchDecorate = false;
        // Check which helpers are actually used
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

export let TypeScriptHelpers = () => {
    return new TypeScriptHelpersClass({});
}