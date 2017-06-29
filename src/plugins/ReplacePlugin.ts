import { File } from "../core/File";
import { Plugin } from "../core/WorkflowContext";

export interface ReplacePluginOptions {
    [key: string]: string;
}

export class ReplacePluginClass implements Plugin {

    public test: RegExp = /.*/;
    public extensions: Array<string>;
    constructor(public options: ReplacePluginOptions = {}) { };
    transform(file: File) {
        file.loadContents();
        for (let key in this.options) {
            if (this.options.hasOwnProperty(key)) {
                const regexp = new RegExp(key, 'g');
                file.contents = file.contents.replace(regexp, this.options[key]);
            }
        }
    }
}

export const ReplacePlugin = (options?: ReplacePluginOptions) => {
    return new ReplacePluginClass(options);
};
