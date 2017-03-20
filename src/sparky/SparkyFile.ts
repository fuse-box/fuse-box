import * as fs from "fs-extra";
import { ensureDir, replaceExt } from "../Utils";
import * as path from "path";
import { Config } from "../Config";
import { Plugin } from "../core/WorkflowContext";
export class SparkyFile {
    public homePath: string;
    public name: string;
    public contents: Buffer | string;
    public extension: string;

    constructor(public filepath: string, public root: string) {
        let hp = this.filepath.split(root)[1];
        this.homePath = hp.slice(1);
        this.name = path.basename(this.filepath);
    }

    public read(): SparkyFile {
        this.contents = fs.readFileSync(this.filepath)
        return this;
    }

    public write(contents: string | Buffer): SparkyFile {
        this.contents = contents;
        fs.writeFileSync(this.filepath, contents);
        return this;
    }

    public save(): SparkyFile {
        if (this.contents) {
            let contents = this.contents;
            if (typeof this.contents === "object") {
                this.contents = JSON.stringify(contents, null, 2);
            }
            fs.writeFileSync(this.filepath, this.contents);
        }
        return this;
    }

    public ext(ext: string): SparkyFile {
        this.extension = ext;
        return this;
    }

    public json(fn: any): SparkyFile {
        if (!this.contents) {
            this.read();
        }
        if (typeof fn === "function") {
            let contents = this.contents ? JSON.parse(this.contents.toString()) : {};
            this.contents = fn(contents);
        }
        return this;
    }

    public plugin(plugin: Plugin) {
        if (!this.contents) {
            this.read();
        }


    }

    public copy(dest: string) {
        return new Promise((resolve, reject) => {
            const isTemplate = dest.indexOf("$") > -1;
            if (isTemplate) {
                if (!path.isAbsolute(dest)) {
                    dest = path.join(Config.PROJECT_ROOT, dest)
                }
                dest = dest.replace("$name", this.name).replace("$path", this.filepath);
            } else {
                dest = path.join(dest, this.homePath);
                dest = ensureDir(dest);
            }
            if (this.extension) {
                dest = replaceExt(dest, "." + this.extension);
                delete this.extension;
            }
            fs.copy(this.filepath, dest, err => {
                if (err) return reject(err);
                this.filepath = dest;
                return resolve();
            });
        });
    }
}