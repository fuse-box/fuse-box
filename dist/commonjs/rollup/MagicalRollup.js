"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Utils_1 = require("../Utils");
const Config_1 = require("../Config");
const path = require("path");
const fs = require("fs");
const RollupFuseResolver_1 = require("../rollup/RollupFuseResolver");
const VirtualFile_1 = require("../rollup/VirtualFile");
const MissingExportsRemoval_1 = require("../rollup/MissingExportsRemoval");
class MagicalRollup {
    constructor(context) {
        this.context = context;
        if (!context.rollupOptions.entry) {
            throw new Error("rollup.entry should be present");
        }
        this.opts = context.rollupOptions;
        this.entryFile = context.rollupOptions.entry;
        this.contents = context.source.getResult().content.toString();
        this.outFile = Utils_1.ensureUserPath(context.outFile);
    }
    debug(msg) {
        this.context.debug("Rollup", msg);
    }
    parse() {
        this.debug("Launching rollup ...");
        const lines = this.contents.split(/\r?\n/);
        let defaultCollectionConsume = true;
        let files = {};
        let fileNameConsume;
        lines.forEach(line => {
            if (fileNameConsume && files[fileNameConsume]) {
                files[fileNameConsume].push(line);
            }
            if (defaultCollectionConsume) {
                const matchedName = line.match(/\/\* fuse:start-file "(.*)"\*\//);
                if (matchedName) {
                    fileNameConsume = matchedName[1];
                    files[fileNameConsume] = [];
                }
                const matchedEndName = line.match(/\/\* fuse:end-file "(.*)"\*\//);
                if (matchedEndName) {
                    fileNameConsume = false;
                }
            }
            if (line.indexOf(`/* fuse:start-collection "default"*/`) === 0) {
                defaultCollectionConsume = true;
            }
            if (line.indexOf(`/* fuse:end-collection "default"*/`) === 0) {
                defaultCollectionConsume = false;
                fileNameConsume = false;
            }
        });
        this.debug("Files reverse engineered");
        return this.rollup(files);
    }
    rollup(files) {
        const rollup = require("rollup");
        const tmpFolder = path.join(Config_1.Config.TEMP_FOLDER, "es6", encodeURIComponent(this.context.outFile), new Date().getTime().toString());
        Utils_1.ensureDir(tmpFolder);
        let virtualMap = new Map();
        for (let fname in files) {
            if (files.hasOwnProperty(fname)) {
                const contents = files[fname].join("\n");
                let file = new VirtualFile_1.VirtualFile(contents);
                virtualMap.set(fname, file);
            }
        }
        this.debug("Fixing missing imports");
        let fixer = new MissingExportsRemoval_1.MissingImportsRemoval(virtualMap);
        fixer.ensureAll();
        virtualMap.forEach((file, name) => {
            const fpath = path.join(tmpFolder, name);
            const fdir = path.dirname(fpath);
            Utils_1.ensureDir(fdir);
            fs.writeFileSync(fpath, file.generate());
        });
        this.debug("Roll Roll Roll!");
        const bundleOptions = Object.assign(this.opts.bundle, {});
        let rollupOptions = Object.assign(this.opts, {});
        delete rollupOptions.bundle;
        rollupOptions.entry = path.join(tmpFolder, rollupOptions.entry);
        rollupOptions.plugins = [
            RollupFuseResolver_1.RollupFuseResolver(this.context, tmpFolder),
        ];
        return rollup.rollup(rollupOptions).then(bundle => {
            this.debug("Generate bundle");
            const defaultOptions = Object.assign({ format: "umd" }, bundleOptions);
            var result = bundle.generate(defaultOptions);
            const ts = require("typescript");
            this.debug("Transpile to es5 with typescript");
            let transpiled = ts.transpileModule(result.code, { target: "es5" });
            this.debug(`Writing to ${this.outFile}`);
            let concat = new Utils_1.Concat(true, "", "\n");
            concat.add(null, transpiled.outputText);
            this.context.source.concat = concat;
        });
    }
}
exports.MagicalRollup = MagicalRollup;
