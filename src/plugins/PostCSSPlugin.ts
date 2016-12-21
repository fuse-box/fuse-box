import * as console from 'console';
import { PluginChain } from '../PluginChain';
import { File } from "../File";
import { WorkFlowContext } from "./../WorkflowContext";
import { Plugin } from "../WorkflowContext";


let postcss;
/**
 *
 *
 * @export
 * @class FuseBoxCSSPlugin
 * @implements {Plugin}
 */
export class PostCSSPluginClass implements Plugin {
    /**
     *
     *
     * @type {RegExp}
     * @memberOf FuseBoxCSSPlugin
     */
    public test: RegExp = /\.css$/;
    public dependencies = [];
    
    constructor(public processors: any, public opts: any) {
        this.opts = this.opts || {};
        this.processors = this.processors || [];
    }

    /**
     *
     *
     * @param {File} file
     *
     * @memberOf FuseBoxCSSPlugin
     */
    public transform(file: File): Promise<void> {
        file.loadContents();

        if (!postcss) {
            postcss = require("postcss");
        }

        return postcss(this.processors).process(file.contents).then(result => {
            file.contents = result.css;
        });
    }
}

export const PostCSSPlugin = (processors?: any, opts?: any) => {
    return new PostCSSPluginClass(processors, opts);
}