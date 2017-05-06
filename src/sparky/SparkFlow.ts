import * as glob from "glob";
import { each } from "realm-utils";
import * as fs from "fs-extra";
import { ensureDir, string2RegExp } from "../Utils";
import { SparkyFile } from "./SparkyFile";
import { log } from "./Sparky";
import { parse, SparkyFilePatternOptions } from "./SparkyFilePattern";
import * as  chokidar from "chokidar";

export class SparkFlow {
    private activities = [];
    private watcher: any;
    private files: SparkyFile[];
    private complatedCallback: any;
    private initialWatch = false;

    constructor() { }

    public glob(globString: string, opts?: SparkyFilePatternOptions): SparkFlow {
        this.activities.push(() => this.getFiles(globString, opts));
        return this;
    }

    public stopWatching() {
        if (this.watcher) {
            this.watcher.close();
        }
    }

    public watch(globString: string, opts?: SparkyFilePatternOptions): SparkFlow {
        this.files = [];
        log.echoStatus(`Watch ${globString}`)
        this.activities.push(() => new Promise((resolve, reject) => {

            var chokidarOptions = {
                cwd: opts ? opts.base : null
            };

            this.watcher = chokidar.watch(globString, chokidarOptions)
                .on('all', (event, fp) => {
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
        this.complatedCallback = fn;
        return this;
    }


    /** Gets all user files */
    protected getFiles(globString: string, opts?: SparkyFilePatternOptions) {
        this.files = [];
        let info = parse(globString, opts)
        let root = info.root;
        return new Promise((resolve, reject) => {
            let userFiles: SparkyFile[] = [];
            if (!info.isGlob) {

                this.files = [new SparkyFile(info.filepath, info.root)];
                return resolve()
            }
            glob(info.glob, (err, files: string[]) => {
                if (err) {
                    return reject(err);
                }
                files.forEach(file => {

                    userFiles.push(new SparkyFile(file, root));
                });
                this.files = userFiles;
                return resolve(userFiles);
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
                if (this.complatedCallback) {
                    this.complatedCallback(this.files);
                }
                this.files = [];
            });
    }

}