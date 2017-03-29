import { File } from "../../core/File";
import { WorkFlowContext } from "../../core/WorkflowContext";
import { Plugin } from "../../core/WorkflowContext";
import * as postcss from "postcss";

export interface CSSModulesOptions {
    useDefault?: boolean;
}

export class CSSModulesClass implements Plugin {

    public test: RegExp = /\.css$/;
    public options: CSSModulesOptions;
    public useDefault = true;

    constructor(options: CSSModulesOptions = {}) {
        this.options = options;
        if (this.options.useDefault !== undefined) {
            this.useDefault = this.options.useDefault;
        }
    }

    public init(context: WorkFlowContext) {
        context.allowExtension(".css");
    }

    public transform(file: File): Promise<any> {
        return new Promise((resolve, reject) => {
            file.loadContents();
            return postcss([
                require('postcss-modules')({
                    root: file.info.absDir,
                    getJSON: (cssFileName, json) => {
                        let exportsKey = this.useDefault ? "module.exports.default" : "module.exports";
                        file.addAlternativeContent(`${exportsKey} = ${JSON.stringify(json)};`);
                    }
                })
            ]).process(file.contents, {})
                .then(result => {
                    file.contents = result.css;
                    return resolve()
                });
        });
    }
}

export const CSSModules = (options: any) => {
    return new CSSModulesClass(options);
};
