import { WorkFlowContext } from "./WorkflowContext";
import { ensureDir, ensureUserPath, hashString, joinFuseBoxPath } from "../Utils";
import * as path from "path";
import * as crypto from "crypto";
import * as fs from "fs";
import * as shortHash from "shorthash";

export class UserOutputResult {
    public path: string;
    public hash: string;
    public filename: string;
    public relativePath?: string;
    public content?: string | Buffer;
}

export class UserOutput {
    public dir: string;
    public template: string;
    public filename = "bundle.js";
    public useHash = false;
    public lastWrittenPath;
    public lastWrittenHash;
    public lastGeneratedFileName: string;
    public folderFromBundleName: string;
    public lastPrimaryOutput: UserOutputResult;

    constructor(public context: WorkFlowContext, public original: string) {
        this.setup();
    }

    public setName(name: string) {
        this.filename = name;
        const split = name.split("/");
        if (split.length > 1) {
            this.folderFromBundleName = split.splice(0, split.length - 1).join("/");
        }
    }

    public getUniqueHash() {
        return `${shortHash.unique(this.original)}-${encodeURIComponent(this.filename)}`;
    }

    private setup() {
        // $name is require
        if (this.original.indexOf('$name') === -1) {
            this.filename = path.basename(this.original);
            this.original = this.original.replace(this.filename, '$name');
        }

        const dir = path.dirname(this.original);
        this.template = path.basename(this.original);
        this.dir = ensureDir(dir);
        this.useHash = this.context.isHashingRequired();
    }

    public read(fname: string): Promise<string> {
        return new Promise((resolve, reject) => {
            fs.readFile(fname, (err, data) => {
                if (err) {
                    return reject(err);
                }
                return resolve(data.toString())
            })
        });
    }

    /**
     * Md5 hash
     * @param content
     */
    public generateHash(content: string) {
        return hashString(crypto.createHash("md5").update(content, "utf8")
            .digest('hex'))
    }

    /**
     * Gets path
     * Processes a template + hash if required by Context
     *
     * @param {string} str
     * @param {string} [hash]
     * @returns
     *
     * @memberOf UserOutput
     */
    public getPath(str: string, hash?: string) {
        let template = this.template;

        const userExt = path.extname(str);
        const templateExt = path.extname(template);

        // making use user has a priority on extensions
        if (userExt && templateExt) {
            template = template.replace(templateExt, '')
        }

        let basename = path.basename(str);
        let dirname = path.dirname(str);
        let fname;
        if (hash) {
            if (template.indexOf('$hash') === -1) {
                fname = template.replace('$name', hash + "-" + basename);
            } else {
                fname = template
                    .replace('$name', basename)
                    .replace('$hash', hash);
            }
        } else {
            fname = template
                .replace('$name', basename)
                .replace(/([-_]*\$hash[-_]*)/, "")
        }
        this.lastGeneratedFileName = fname;
        let result = path.join(this.dir, dirname, fname);
        return result;
    }

    public getBundlePath() { }

    public writeManifest(obj: any) {
        let fullpath = this.getPath(`${this.context.bundle.name}.manifest.json`);
        fullpath = ensureUserPath(fullpath);
        fs.writeFileSync(fullpath, JSON.stringify(obj, null, 2));
    }

    public getManifest() {
        let fullpath = this.getPath(`${this.context.bundle.name}.manifest.json`);
        if (fs.existsSync(fullpath)) {
            return require(fullpath)
        }
    }

    /**
     *
     *
     * @param {string} userPath
     * @param {(string | Buffer)} content
     * @returns {string}
     *
     * @memberOf UserOutput
     */
    public write(userPath: string, content: string | Buffer, ignoreHash?: boolean): Promise<UserOutputResult> {
        let hash;
        if (this.useHash) {
            hash = this.generateHash(content.toString());
            this.lastWrittenHash = hash;
        }

        let fullpath = this.getPath(userPath, !ignoreHash ? hash : undefined);

        fullpath = ensureUserPath(fullpath);
        let result = new UserOutputResult();
        return new Promise((resolve, reject) => {
            result.path = fullpath;
            result.hash = hash;
            result.filename = path.basename(fullpath);
            result.relativePath = joinFuseBoxPath(this.folderFromBundleName || ".", result.filename);
            this.lastWrittenPath = fullpath;
            if (this.context.userWriteBundles) {
                fs.writeFile(fullpath, content, (e) => {
                    if (e) {
                        return reject(e);
                    }
                    return resolve(result)
                })
            } else {
                result.content = content;
                return resolve(result);
            }
        });
    }

    public writeCurrent(content: string | Buffer): Promise<UserOutputResult> {
        return this.write(this.filename, content).then(out => {
            this.lastPrimaryOutput = out;

            return out;
        });
    }
}
