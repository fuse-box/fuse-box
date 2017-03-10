"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let coffee;
class CoffeePluginClass {
    constructor(options) {
        this.test = /\.coffee$/;
        this.options = Object.assign({}, {
            bare: true,
            sourceMap: false,
            sourceRoot: "",
            literate: false,
            filename: false,
            sourceFiles: false,
            generatedFile: false,
        }, options);
    }
    init(context) {
        context.allowExtension(".coffee");
    }
    transform(file) {
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
            }
            catch (err) {
                rej(err);
            }
        });
    }
}
exports.CoffeePluginClass = CoffeePluginClass;
exports.CoffeePlugin = (options = {}) => {
    return new CoffeePluginClass(options);
};
