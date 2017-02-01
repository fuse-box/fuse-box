import { File } from "../File";
import { Plugin, WorkFlowContext } from "../WorkflowContext";
import { ensureUserPath, ensureDir } from "../Utils";
import * as path from "path";
import { utils } from "realm-utils";
import * as fs from "fs";

let resourceFolderChecked = false;

const copyFile = (source, target) => {
    return new Promise((resolve, reject) => {
        fs.exists(source, (exists) => {
            if (!exists) {
                return resolve();
            }
            let rd = fs.createReadStream(source);
            rd.on("error", (err) => {
                return reject(err);
            });
            let wr = fs.createWriteStream(target);
            wr.on("error", (err) => {
                return reject(err);
            });
            wr.on("close", (ex) => {
                return resolve();
            });
            rd.pipe(wr);
        });
    });
}

const generateNewFileName = (str): string => {
    let s = str.split("node_modules");
    const ext = path.extname(str);
    if (s[1]) {
        str = s[1];
    }
    let hash = 0;
    let i;
    let chr;
    let len;
    if (str.length === 0) { return hash.toString() + ext; }
    for (i = 0, len = str.length; i < len; i++) {
        chr = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + chr;
        hash |= 0; // Convert to 32bit integer
    }
    let fname = hash.toString() + ext;
    if (fname.charAt(0) === "-") {
        fname = "_" + fname.slice(1);
    }
    return fname;
}

/**
 * @export
 * @class RawPluginClass
 * @implements {Plugin}
 */
export class CSSResourcePluginClass implements Plugin {


    public distFolder: string;
    constructor(opts: any) {
        opts = opts || {};
        if (opts.dist) {
            this.distFolder = ensureDir(opts.dist);
        }
        if (utils.isFunction(opts.resolve)) {
            this.resolveFn = opts.resolve;
        }
    }

    public init(context: WorkFlowContext) {
        context.allowExtension(".css");
    }

    public resolveFn = (p) => path.join("/css-resources", p)

    public createResouceFolder(file: File) {
        if (resourceFolderChecked === false) {

            resourceFolderChecked = true;
            if (this.distFolder) {
                return;
            }
            // making sure dist folder exists
            let outFilePath = ensureUserPath(file.context.outFile);
            let outFileDir = path.dirname(outFilePath);
            this.distFolder = ensureDir(path.join(outFileDir, "css-resources"));
        }
    }



    public transform(file: File) {
        file.loadContents();
        let contents = file.contents;
        let match;

        this.createResouceFolder(file);
        let currentFolder = file.info.absDir;
        const files = {};
        const tasks = [];
        let re = /\s*url\((?!"data:)([^\)]+)/g;
        while (match = re.exec(contents)) {
            let relativeFile = match[1];
            // replacing slashes
            relativeFile = relativeFile.replace(/"|'/g, "");
            let urlFile = path.resolve(currentFolder, relativeFile);
            if (!files[urlFile]) {
                let newFileName = generateNewFileName(urlFile);
                let newPath = path.join(this.distFolder, newFileName);
                contents = contents.replace(relativeFile, `${this.resolveFn(newFileName)}`);
                files[urlFile] = true;
                tasks.push(copyFile(urlFile, newPath));
            }
        }
        file.contents = contents;
        return Promise.all(tasks);
    }
}

export const CSSResourcePlugin = (options) => {
    return new CSSResourcePluginClass(options);
};