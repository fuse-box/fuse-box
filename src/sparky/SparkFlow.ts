import * as glob from "glob";
import * as path from "path";
import { each } from "realm-utils";
import * as fs from "fs-extra";
import { ensureDir, string2RegExp } from "../Utils";
import { SparkyFile } from "./SparkyFile";
import { Config } from "../Config";
import { log } from "./Sparky";



export class SparkFlow {
    private activities = [];
    private files: SparkyFile[];
    private initialWatch = false;

    constructor() { }

    public glob(globString: string): SparkFlow {
        this.activities.push(() => this.getFiles(globString));
        return this;
    }

    public watch(globString: string, opts: any): SparkFlow {
        this.files = [];
        log.echoStatus(`Watch ${globString}`)
        this.activities.push(() => new Promise((resolve, reject) => {
            const chokidar = require("chokidar")
            chokidar.watch(globString, opts || {})
                .on('all', (event, fp) => {
                    if (this.initialWatch) {
                        this.files = [];
                        log.echoStatus(`Changed ${fp}`)
                    }
                    let root = path.isAbsolute(fp) ? path.dirname(fp) : Config.PROJECT_ROOT;
                    fp = path.isAbsolute(fp) ? fp : path.join(Config.PROJECT_ROOT, fp);

                    this.files.push(new SparkyFile(fp, root))
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

    /** Gets all user files */
    protected getFiles(globString: string) {
        let fp = path.join(Config.PROJECT_ROOT, globString);
        return new Promise((resolve, reject) => {
            glob(fp, (err, files: string[]) => {
                if (err) {
                    return reject(err);
                }
                let userFiles: SparkyFile[] = [];
                files.forEach(file => {
                    userFiles.push(new SparkyFile(file, Config.PROJECT_ROOT));
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
                this.files = [];
            });
    }

}