import { File } from "../../core/File";
import { WorkFlowContext } from "../../core/WorkflowContext";
import { Plugin } from "../../core/WorkflowContext";
import * as postcss from "postcss";

export interface Opts {

}

export class CSSModulesClass implements Plugin {

    public test: RegExp = /\.css$/;
    public options: Opts;

    constructor(options?: Opts) {
        this.options = options || {};
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
                    getJSON: function (cssFileName, json) {
                        file.addAlternativeContent(`module.exports.default = ${JSON.stringify(json)};`);
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
