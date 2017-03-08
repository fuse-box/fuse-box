import { ensureDir, ensureUserPath } from "../Utils";
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
    public opts: any;
    constructor(public context: WorkFlowContext, public bundle: Buffer, opts: any) {
        this.opts = opts || {};
        if (!this.opts.outFile) {
            throw new Error("outFile Should be here");
        }

        if (!this.opts.entry) {
            throw new Error("entry should be here");
        }
        this.entryFile = this.opts.entry;
        this.outFile = ensureUserPath(this.opts.outFile);
    }

    public parse() {
        this.context.log.echo("Launching rollup ...");
        const contents = this.bundle.toString();/**/
        const lines = contents.split(/\r?\n/);

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

        this.context.log.echo("Files reverse engineered");
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

        const tmpFolder = path.join(Config.TEMP_FOLDER, "es6", encodeURIComponent(this.context.outFile), new Date().getTime().toString());
        ensureDir(tmpFolder);

        let virtualMap = new Map<string, VirtualFile>();
        for (let fname in files) {
            if (files.hasOwnProperty(fname)) {
                const contents = files[fname].join("\n");
                let file = new VirtualFile(contents);
                virtualMap.set(fname, file);
            }
        }
        this.context.log.echo("Fixing missing imports");
        let fixer = new MissingImportsRemoval(virtualMap);
        fixer.ensureAll();

        virtualMap.forEach((file, name) => {
            const fpath = path.join(tmpFolder, name);
            const fdir = path.dirname(fpath);
            ensureDir(fdir);
            fs.writeFileSync(fpath, file.generate());
        });
        this.context.log.echo("Rollup roll!");
        return rollup.rollup({
            entry: path.join(tmpFolder, this.entryFile),
            plugins: [
                RollupFuseResolver(this.context, tmpFolder),
            ],
            treeshake: true,
        }).then(bundle => {
            this.context.log.echo("Generate bundle");
            var result = bundle.generate({
                format: "cjs",
            });

            const ts = require("typescript");
            this.context.log.echo("Transpile to es5 with typescript");
            let transpiled = ts.transpileModule(result.code, { target: "es5" });
            this.context.log.echo(`Writing to ${this.outFile}`);
            fs.writeFileSync(this.outFile, transpiled.outputText);
        });
    }
}
