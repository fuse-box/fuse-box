import { File } from "../../core/File";
import { Plugin, WorkFlowContext } from "../../core/WorkflowContext";

import * as path from "path";
import { Config } from "../../Config";

export interface PurgeCSSPluginOptions {
    content?: T[];
    css?: T[];
}
let Purgecss
let purge
let purgeHtml
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

        if (!css) {
            css = file.contents
        }

        if (!Purgecss) {
            Purgecss = require('purgecss');
            purgeHtml = require('purge-from-html');
        }

        if (!purge) {
            purge = new Purgecss({
                ...options,
                css: [
                    {
                        raw: css
                    }
                ],
                extractors: [
                    {
                        extractor: purgeHtml,
                        extensions: ['html', 'tpl']
                    }
                ],
                stdout: true,
            })
            purgecssResult = purge.purge();
        }
        //        console.log(purge);
        console.log(purgecssResult[0].css);

        //		    return purge
    }
}

export const PurgeCSSPlugin = (options?: PurgeCSSPluginOptions) => {
    return new PurgeCSSPluginClass(options)
}
