import { WorkFlowContext } from "../../core/WorkflowContext";
import { Plugin } from "../../core/WorkflowContext";
import { File } from "../../core/File";

export interface CoffeePluginOptions {
    bare?: boolean,
    sourceMap?: boolean,
    sourceRoot?: string,
    literate?: boolean,
    filename?: boolean,
    sourceFiles?: boolean,
    generatedFile?: boolean,
}

let coffee;

/**
 * This plugin compile coffeescript to Javascript
 *
 * @export
 * @class CoffeePluginClass
 * @implements {Plugin}
 */
export class CoffeePluginClass implements Plugin {

    public test: RegExp = /\.coffee$/

    // When dependencies is set it creates an
    // "Invalid labeled declaration" error :(
    // public dependencies = ['coffee-script']

    public options: CoffeePluginOptions

    /**
     * @param {Object} options - Options for coffee compiler
     */
    constructor(options: CoffeePluginOptions = {}) {
        this.options = Object.assign({
            bare: true,
            sourceMap: false,
            sourceRoot: "",
            literate: false,
            filename: false,
            sourceFiles: false,
            generatedFile: false,
        }, options);
    }

    public init(context: WorkFlowContext) {
        context.allowExtension(".coffee");
    }

    public transform(file: File) {
        file.loadContents();

        if (!coffee) {
            coffee = require("coffee-script");
        }

        return new Promise((res, rej) => {
            try {
                let options = Object.assign({}, this.options, {
                    filename: file.absPath,
                });
                file.contents = coffee.compile(file.contents, options);
                res(file.contents);
            } catch (err) {
                rej(err);
            }
        });

    }
}

export const CoffeePlugin = (options?: CoffeePluginOptions) => {
    return new CoffeePluginClass(options);
};
