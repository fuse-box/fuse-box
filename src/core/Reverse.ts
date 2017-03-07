import { ensureDir } from '../Utils';
import { WorkFlowContext } from './WorkflowContext';
import { Config } from '../Config';
import * as path from 'path';
import * as fs from 'fs';
import * as rollup from "rollup";
import { RollupFuseResolver } from '../rollup/RollupFuseResolver';



export class Reverse {
    private outDir: string;

    constructor(public context: WorkFlowContext, public bundle: Buffer, outDir) {
        this.outDir = ensureDir(outDir);
        this.parse();
    }

    private parse() {

        const contents = this.bundle.toString();/**/
        const lines = contents.split(/\r?\n/);

        let defaultCollectionConsume = true
        let files = {};
        let fileNameConsume;
        lines.forEach(line => {
            // filling lines
            if (fileNameConsume && files[fileNameConsume]) {
                files[fileNameConsume].push(line);
            }

            if (defaultCollectionConsume) {
                const matchedName = line.match(/\/\* fuse:start-file "(.*)"\*\//)
                if (matchedName) {
                    fileNameConsume = matchedName[1];
                    files[fileNameConsume] = [];

                }
                const matchedEndName = line.match(/\/\* fuse:end-file "(.*)"\*\//)
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
        this.createTemporaryStructure(files);
    }

    /**
     * 
     * 
     * @private
     * @param {*} files
     * 
     * @memberOf Reverse
     */
    private createTemporaryStructure(files: any) {
        const tmpFolder = path.join(Config.TEMP_FOLDER, "es6", encodeURIComponent(this.context.outFile), new Date().getTime().toString())
        ensureDir(tmpFolder);

        for (let fname in files) {
            if (files.hasOwnProperty(fname)) {
                const fpath = path.join(tmpFolder, fname);
                const fdir = path.dirname(fpath);
                ensureDir(fdir);
                fs.writeFileSync(fpath, files[fname].join("\n"));
            }
        }

        rollup.rollup({
            entry: path.join(tmpFolder, 'packages/inferno/src/index.js'),
            plugins: [RollupFuseResolver(this.context, tmpFolder)],
        }).then(function (bundle) {
            // Generate bundle + sourcemap
            var result = bundle.generate({
                // output format - 'amd', 'cjs', 'es', 'iife', 'umd'
                format: 'cjs'
            });
            console.log(result);
        }).catch(e => {
            console.log(e.stack || e);
        })


    }
}