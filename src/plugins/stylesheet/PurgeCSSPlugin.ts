import { File } from "../../core/File";
import { Plugin, WorkFlowContext } from "../../core/WorkflowContext";

import * as path from "path";
import { Config } from "../../Config";

export interface PurgeCSSPluginOptions {
    content?: T[];
    css?: T[];
}

let purge
let Purge
let purgecssResult
let css
/**
 * @export
 * @class PurgeCSSPlugin
 * @implements {Plugin}
 */
export class PurgeCSSPluginClass implements Plugin {
    public test: RegExp = /\.(css|html|tpl|js)$/
        public context: WorkFlowContext

    constructor(public options: PurgeCSSPluginOptions = {}) {}

    public init(context: WorkFlowContext) {
        context.allowExtension(".css")
        context.allowExtension(".html")
        context.allowExtension(".tpl")
        context.allowExtension(".js")
        this.context = context
    }

    public transform(file: File): Promise<any> {
        file.addStringDependency("fuse-box-css")
        const context = file.context
        const options = { ...this.options }

        file.loadContents()

        css = file.contents

        if (!Purge) {
            Purge = require("purgecss")
        }

        purge = new Purge({
            content: options.content,
            css: file.contents,
        })

        purgecssResult = purge.result()

		    return purge
    }
}

export const PurgeCSSPlugin = (options?: PurgeCSSPluginOptions) => {
    return new PurgeCSSPluginClass(options)
}
