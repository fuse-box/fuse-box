import { ensureDir, Concat } from "../Utils";
import { Config } from "../Config";
import * as path from "path";
import * as fs from "fs";

import { RollupFuseResolver } from "../rollup/RollupFuseResolver";
import { VirtualFile } from "../rollup/VirtualFile";
import { MissingImportsRemoval } from "../rollup/MissingExportsRemoval";
import { WorkFlowContext } from "../core/WorkflowContext";

export class MagicalRollup {
    private outFile: string;
    private entryFile: string;
    private contents: String;
    public opts: any;
    constructor(public context: WorkFlowContext) {
        if (!context.rollupOptions.entry) {
            throw new Error("rollup.entry should be present");
        }
        this.opts = context.rollupOptions;
        this.entryFile = context.rollupOptions.entry;
        this.contents = context.source.getResult().content.toString();

    }
    public debug(msg: string) {
        this.context.debug("Rollup", msg);
    }
    public parse() {
        this.debug("Launching rollup ...");

        const lines = this.contents.split(/\r?\n/);

        let defaultCollectionConsume = true;
        let files = {};
        let fileNameConsume;
        lines.forEach(line => {
            // filling lines
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

    /**
     *
     *
     * @private
     * @param {*} files
     *
     * @memberOf Reverse
     */
    private rollup(files: any) {
        const rollup = require("rollup");

        const tmpFolder = path.join(Config.TEMP_FOLDER, "es6", new Date().getTime().toString());
        ensureDir(tmpFolder);

        let virtualMap = new Map<string, VirtualFile>();
        for (let fname in files) {
            if (files.hasOwnProperty(fname)) {
                const contents = files[fname].join("\n");
                let file = new VirtualFile(contents);
                virtualMap.set(fname, file);
            }
        }
        this.debug("Fixing missing imports");
        let fixer = new MissingImportsRemoval(virtualMap);
        fixer.ensureAll();

        virtualMap.forEach((file, name) => {
            const fpath = path.join(tmpFolder, name);
            const fdir = path.dirname(fpath);
            ensureDir(fdir);
            fs.writeFileSync(fpath, file.generate());
        });

        this.debug("Roll Roll Roll!");
        const bundleOptions = Object.assign(this.opts.bundle, {});

        let rollupOptions = Object.assign(this.opts, {});
        delete rollupOptions.bundle;
        rollupOptions.entry = path.join(tmpFolder, rollupOptions.entry);
        rollupOptions.plugins = [
            RollupFuseResolver(this.context, tmpFolder),
        ];

        return rollup.rollup(rollupOptions).then(bundle => {
            this.debug("Generate bundle");

            // default options
            const defaultOptions = Object.assign({ format: "umd" }, bundleOptions);

            var result = bundle.generate(defaultOptions);
            const ts = require("typescript");
            this.debug("Transpile to es5 with typescript");
            let transpiled = ts.transpileModule(result.code, { target: "es5" });
            this.debug(`Writing to ${this.outFile}`);
            let concat = new Concat(true, "", "\n");
            concat.add(null, transpiled.outputText);
            this.context.source.concat = concat;
        });
    }
}
