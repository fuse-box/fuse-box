"use strict";
const babelCore = require("babel-core");
class BabelPlugin {
    constructor() {
        this.test = /\.js$/;
    }
    init(context) {
        this.context = context;
    }
    transform(file, ast) {
        return new Promise((resolve, reject) => {
            let result = babelCore.transform(file.contents, {
                presets: ["es2015"],
                plugins: ["add-module-exports"]
            });
            file.contents = result.code;
            return resolve();
        });
    }
}
exports.BabelPlugin = BabelPlugin;
;
