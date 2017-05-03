import { File } from "../core/File";
import { Plugin } from "../core/WorkflowContext";

export class PlainJSPluginClass implements Plugin {
    constructor() { }
    public test: RegExp = /\.js$/;

    public transform(file: File) {
        let context = file.context;
        if (context.useCache) {
            if (file.loadFromCache()) {
                return;
            }
        }
        if (context.useCache) {
            context.emitJavascriptHotReload(file);
            context.cache.writeStaticCache(file, file.sourceMap);
        }
    }
};

export const PlainJSPlugin = () => {
    return new PlainJSPluginClass
};

