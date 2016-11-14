"use strict";
class BabelPlugin {
    constructor(test, opts) {
        this.test = test;
        this.opts = opts;
    }
    init(context) {
        context.allowExtension(".html");
    }
    transform(file) {
        let babel = require("babel-core");
        const result = babel.transform(file.contents, this.opts || {});
        console.log(result.code);
        file.contents = result.code;
    }
}
exports.BabelPlugin = BabelPlugin;
;
