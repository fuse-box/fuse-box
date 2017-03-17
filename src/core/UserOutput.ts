import { WorkFlowContext } from "./WorkflowContext";
import { ensureDir, ensureUserPath } from "../Utils";
import * as path from "path";
import * as crypto from "crypto";
import * as fs from "fs";
import * as shortHash from "shorthash";

export class UserOutput {
    public dir: string;
    public template: string;
    public filename = "bundle.js";
    public useHash = false;
    public lastWrittenPath;
    public lastWrittenHash;
    constructor(public context: WorkFlowContext, public original: string) {
        this.setup();
    }

    public setName(name: string) {
        this.filename = name;
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

    /**
     * Md5 hash
     * @param content 
     */
    public generateHash(content: string) {
        return crypto.createHash("md5").update(content, "utf8")
            .digest('hex')
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
                fname = template.replace('$name', basename + "-" + hash);
            } else {
                fname = template
                    .replace('$name', basename)
                    .replace('$hash', hash);
            }
        } else {
            fname = template
                .replace('$name', basename)
                .replace('$hash', "")
        }
        let result = path.join(this.dir, dirname, fname);
        return result;
    }

    public getBundlePath() {

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
    public write(userPath: string, content: string | Buffer): Promise<string> {
        let hash;
        if (this.useHash) {
            hash = this.generateHash(content.toString());
            this.lastWrittenHash = hash;
        }

        let fullpath = this.getPath(userPath, hash);
        fullpath = ensureUserPath(fullpath);
        return new Promise((resolve, reject) => {
            fs.writeFile(fullpath, content, (e) => {
                if (e) {
                    return reject(e);
                }
                this.lastWrittenPath = fullpath;
                return resolve(fullpath)
            })
        });
    }

    public writeCurrent(content: string | Buffer): Promise<string> {
        return this.write(this.filename, content);
    }
}