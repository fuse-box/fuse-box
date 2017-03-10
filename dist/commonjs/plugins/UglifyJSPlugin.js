"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BundleSource_1 = require("../BundleSource");
class UglifyJSPluginClass {
    constructor(options) {
        this.options = options || {};
    }
    postBundle(context) {
        const mainOptions = {
            fromString: true,
        };
        const UglifyJs = require("uglify-js");
        const concat = context.source.getResult();
        const source = concat.content.toString();
        const sourceMap = concat.sourceMap;
        const newSource = new BundleSource_1.BundleSource(context);
        context.source = newSource;
        const newConcat = context.source.getResult();
        if ("sourceMapConfig" in context) {
            if (context.sourceMapConfig.bundleReference) {
                mainOptions.inSourceMap = JSON.parse(sourceMap);
                mainOptions.outSourceMap = context.sourceMapConfig.bundleReference;
            }
        }
        let timeStart = process.hrtime();
        const result = UglifyJs.minify(source, Object.assign({}, this.options, mainOptions));
        let took = process.hrtime(timeStart);
        let bytes = Buffer.byteLength(result.code, "utf8");
        context.log.echoBundleStats("Bundle (Uglified)", bytes, took);
        newConcat.add(null, result.code, result.map || sourceMap);
    }
}
exports.UglifyJSPluginClass = UglifyJSPluginClass;
exports.UglifyJSPlugin = (options) => {
    return new UglifyJSPluginClass(options);
};
