import * as fs from "fs-extra";
import * as path from "path";
import * as Mustache from "mustache";
import { replaceExt, ensureUserPath } from "../Utils";
import { Config } from "../Config";
import { Plugin } from "../core/WorkflowContext";

export class SparkyFile {
    public homePath: string;
    public name: string;
    public contents: Buffer | string;
    public extension: string;
    public filepath: string;
    public root: string;
    private savingRequired = false;

    constructor(filepath: string, root: string) {
        this.filepath = path.normalize(filepath);
        this.root = path.normalize(root);

        let hp = path.relative(this.root, this.filepath);
        this.homePath = path.isAbsolute(hp) ? hp.slice(1) : hp;
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

    public template(obj: any) {
        if (!this.contents) { this.read(); }
        this.contents = Mustache.render(this.contents.toString(), obj);
        this.savingRequired = true;
    }
    public save(): SparkyFile {
        this.savingRequired = false;
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
            let contents = this.contents.toString() ? JSON.parse(this.contents.toString()) : {};
            const response = fn(contents);
            this.contents = response ? response : contents;
            this.savingRequired = true;
        }
        return this;
    }

    public plugin(plugin: Plugin) {
        if (!this.contents) {
            this.read();
        }
    }

    public setContent(cnt: string): SparkyFile {
        this.contents = cnt;
        this.savingRequired = true;
        return this;
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
                dest = ensureUserPath(dest);
            }
            if (this.extension) {
                dest = replaceExt(dest, "." + this.extension);
                delete this.extension;
            }
            fs.copy(this.filepath, dest, err => {
                if (err) return reject(err);
                this.filepath = dest;
                // save is required
                if (this.savingRequired) {
                    this.save();
                }
                return resolve();
            });
        });
    }
}
