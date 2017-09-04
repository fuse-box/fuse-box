import * as glob from "glob";
import * as fs from "fs-extra";
import * as chokidar from "chokidar";
import { each } from "realm-utils";
import { ensureDir, string2RegExp } from "../Utils";
import { SparkyFile } from "./SparkyFile";
import { log } from "./Sparky";
import { Plugin } from '../core/WorkflowContext';
import { parse, SparkyFilePatternOptions } from "./SparkyFilePattern";

export class SparkFlow {
    private activities = [];
    private watcher: any;
    private files: SparkyFile[];
    private completedCallback: any;
    private initialWatch = false;

    constructor() { }

    public glob(globs: string[], opts?: SparkyFilePatternOptions): SparkFlow {
        this.activities.push(() => this.getFiles(globs, opts));
        return this;
    }

    public stopWatching() {
        if (this.watcher) {
            this.watcher.close();
        }
    }

    public watch(globs: string[], opts?: SparkyFilePatternOptions): SparkFlow {
        this.files = [];
        log.echoStatus(`Watch ${globs}`)
        this.activities.push(() => new Promise((resolve, reject) => {

            var chokidarOptions = {
                cwd: opts ? opts.base : null
            };

            this.watcher = chokidar.watch(globs, chokidarOptions)
                .on('all', (event, fp) => {
                    if (event === 'addDir' || event === 'unlinkDir') return
                    if (this.initialWatch) {
                        this.files = [];
                        log.echoStatus(`Changed ${fp}`)
                    }
                    let info = parse(fp, opts);
                    this.files.push(new SparkyFile(info.filepath, info.root))
                    if (this.initialWatch) {
                        // call it again
                        this.exec();
                    }
                }).on('ready', () => {
                    this.initialWatch = true;
                    log.echoStatus(`Resolved ${this.files.length} files`)
                    this.activities[0] = undefined;
                    resolve();
                });
        }));
        return this;
    }

    public completed(fn: any): SparkFlow {
        this.completedCallback = fn;
        return this;
    }


    /** Gets all user files */
    protected getFiles(globs: string[], opts?: SparkyFilePatternOptions): Promise<SparkyFile[]> {
        this.files = [];
        const getFilePromises = [];
        globs.forEach(g => {
            getFilePromises.push(this.getFile(g, opts));
        })
        return Promise.all(getFilePromises)
            .then(results => {
                this.files = [].concat.apply([], results);
                return this.files;
            })
    }

    protected getFile(globString, opts?: SparkyFilePatternOptions) {
        let info = parse(globString, opts)

        return new Promise((resolve, reject) => {
            if (!info.isGlob) {
                return resolve([new SparkyFile(info.filepath, info.root)])
            }
            glob(info.glob, (err, files: string[]) => {
                if (err) {
                    return reject(err);
                }
                return resolve(files.map(file => new SparkyFile(file, info.root)))
            });
        });
    }

    /**
     * Removes folder if exists
     * @param dest
     */
    public clean(dest: string): SparkFlow {
        this.activities.push(() =>
            new Promise((resolve, reject) => {

                fs.remove(ensureDir(dest), err => {
                    if (err) return reject(err);
                    return resolve();
                })
            })
        );
        return this;
    }



    public plugin(plugin: Plugin): SparkFlow {
        this.activities.push(() => {
            //Promise.all(this.files.map(file => file.copy(dest)))
            //File.createByName(collection, "sd")
        });
        return this;
    }

    public file(mask: string, fn: any) {
        this.activities.push(() => {
            let regexp = string2RegExp(mask);
            return each(this.files, (file: SparkyFile) => {
                if (regexp.test(file.filepath)) {
                    log.echoStatus(`Captured file ${file.homePath}`);
                    return fn(file);
                }
            })
        });
        return this;
    }




    public dest(dest: string): SparkFlow {
        log.echoStatus(`Copy to ${dest}`)
        this.activities.push(() =>
            Promise.all(this.files.map(file => file.copy(dest)))
        );
        return this;
    }

    public exec() {
        return each(this.activities, (activity: any) => activity && activity())
            .then(() => {
                if (this.completedCallback) {
                    this.completedCallback(this.files);
                }
                this.files = [];
            });
    }

}
