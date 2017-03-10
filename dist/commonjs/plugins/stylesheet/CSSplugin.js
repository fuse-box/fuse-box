"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
const Config_1 = require("./../../Config");
const realm_utils_1 = require("realm-utils");
const CSSPluginDeprecated_1 = require("./CSSPluginDeprecated");
const Utils_1 = require("../../Utils");
class CSSPluginClass {
    constructor(opts) {
        this.test = /\.css$/;
        this.raw = false;
        this.minify = false;
        opts = opts || {};
        this.opts = opts;
        if (opts.raw !== undefined) {
            this.raw = opts.raw;
        }
        if (opts.write) {
            this.writeOptions = opts.write;
        }
        if (opts.minify !== undefined) {
            this.minify = opts.minify;
        }
        if (opts.serve !== undefined) {
            this.serve = opts.serve;
        }
    }
    init(context) {
        context.allowExtension(".css");
    }
    bundleStart(context) {
        let lib = path.join(Config_1.Config.FUSEBOX_MODULES, "fsbx-default-css-plugin", "index.js");
        context.source.addContent(fs.readFileSync(lib).toString());
    }
    inject(file, options, alternative) {
        const resolvedPath = realm_utils_1.utils.isFunction(options.inject)
            ? options.inject(file.info.fuseBoxPath) : file.info.fuseBoxPath;
        const result = options.inject !== false ? `__fsbx_css("${resolvedPath}");` : "";
        if (alternative) {
            file.alternativeContent = result;
        }
        else {
            file.contents = result;
        }
    }
    transformGroup(group) {
        const debug = (text) => group.context.debugPlugin(this, text);
        debug(`Start group transformation on "${group.info.fuseBoxPath}"`);
        let concat = new Utils_1.Concat(true, "", "\n");
        group.subFiles.forEach(file => {
            debug(`  -> Concat ${file.info.fuseBoxPath}`);
            concat.add(file.info.fuseBoxPath, file.contents, file.generateCorrectSourceMap());
        });
        let options = group.groupHandler.opts || {};
        const cssContents = concat.content;
        if (options.outFile) {
            let outFile = Utils_1.ensureUserPath(options.outFile);
            const bundleDir = path.dirname(outFile);
            const sourceMapsName = path.basename(outFile) + ".map";
            concat.add(null, `/*# sourceMappingURL=${sourceMapsName} */`);
            debug(`Writing ${outFile}`);
            return Utils_1.write(outFile, concat.content).then(() => {
                this.inject(group, options);
                group.context.sourceChangedEmitter.emit({
                    type: "css-file",
                    content: "",
                    path: group.info.fuseBoxPath,
                });
                const sourceMapsFile = Utils_1.ensureUserPath(path.join(bundleDir, sourceMapsName));
                return Utils_1.write(sourceMapsFile, concat.sourceMap);
            });
        }
        else {
            debug(`Inlining ${group.info.fuseBoxPath}`);
            const safeContents = JSON.stringify(cssContents.toString());
            group.contents = `__fsbx_css("${group.info.fuseBoxPath}", ${safeContents});`;
        }
        group.context.sourceChangedEmitter.emit({
            type: "css",
            content: cssContents.toString(),
            path: group.info.fuseBoxPath,
        });
    }
    transform(file) {
        if (file.hasSubFiles()) {
            return;
        }
        const debug = (text) => file.context.debugPlugin(this, text);
        file.loadContents();
        let contents;
        let filePath = file.info.fuseBoxPath;
        let context = file.context;
        file.contents = this.minify ? this.minifyContents(file.contents) : file.contents;
        if (this.opts.group) {
            const bundleName = this.opts.group;
            let fileGroup = context.getFileGroup(bundleName);
            if (!fileGroup) {
                fileGroup = context.createFileGroup(bundleName, file.collection, this);
            }
            fileGroup.addSubFile(file);
            debug(`  grouping -> ${bundleName}`);
            const chainExports = file.getProperty("exports");
            file.alternativeContent = `module.exports = ${chainExports && contents ? chainExports : "require('./" + bundleName + "')"}`;
            return;
        }
        let outFileFunction;
        if (this.opts.outFile !== undefined) {
            if (!realm_utils_1.utils.isFunction(this.opts.outFile)) {
                context.fatal(`Error in CSSConfig. outFile is expected to be a function that resolves a path`);
            }
            else {
                outFileFunction = this.opts.outFile;
            }
        }
        if (outFileFunction) {
            const userPath = Utils_1.ensureUserPath(outFileFunction(file.info.fuseBoxPath));
            file.alternativeContent = "";
            this.inject(file, this.opts, true);
            return Utils_1.write(userPath, file.contents).then(() => {
                if (file.sourceMap) {
                    const fileDir = path.dirname(userPath);
                    const sourceMapPath = path.join(fileDir, path.basename(userPath) + ".map");
                    return Utils_1.write(sourceMapPath, file.sourceMap);
                }
            });
        }
        else {
            let safeContents = JSON.stringify(file.contents);
            let serve = false;
            if (this.writeOptions) {
                const writeResult = CSSPluginDeprecated_1.CSSPluginDeprecated.writeOptions(this.writeOptions, file);
                if (writeResult) {
                    return writeResult;
                }
            }
            else {
                file.sourceMap = undefined;
            }
            if (this.serve) {
                if (realm_utils_1.utils.isFunction(this.serve)) {
                    let userResult = this.serve(file.info.fuseBoxPath, file);
                    if (realm_utils_1.utils.isString(userResult)) {
                        filePath = userResult;
                        serve = true;
                    }
                }
            }
            if (serve) {
                file.alternativeContent = `__fsbx_css("${filePath}")`;
            }
            else {
                file.context.sourceChangedEmitter.emit({
                    type: "css",
                    content: file.contents,
                    path: file.info.fuseBoxPath,
                });
                file.alternativeContent = `__fsbx_css("${filePath}", ${safeContents});`;
            }
        }
    }
    minifyContents(contents) {
        return contents.replace(/\s{2,}/g, " ").replace(/\t|\r|\n/g, "").trim();
    }
}
exports.CSSPluginClass = CSSPluginClass;
exports.CSSPlugin = (opts) => {
    return new CSSPluginClass(opts);
};
