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
        file.addStringDependency("fuse-box-css");
        return new Promise((resolve, reject) => {
            file.loadContents();
            return postcss([
                require('postcss-modules')({
                    root: file.info.absDir,
                    getJSON: (cssFileName, json) => {
                        let exportsKey = this.useDefault ? "module.exports.default" : "module.exports";
                        const cnt = [];
                        if (this.useDefault) {
                            cnt.push(`Object.defineProperty(exports, "__esModule", { value: true });`);
                        }
                        cnt.push(`${exportsKey} = ${JSON.stringify(json)};`);
                        file.addAlternativeContent(cnt.join('\n'));
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

export const CSSModules = (options?: CSSModulesOptions) => {
    return new CSSModulesClass(options);
};
