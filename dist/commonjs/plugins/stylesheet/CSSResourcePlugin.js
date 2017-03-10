"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Utils_1 = require("../../Utils");
const path = require("path");
const realm_utils_1 = require("realm-utils");
const fs = require("fs");
const PostCSSResourcePlugin_1 = require("../../lib/postcss/PostCSSResourcePlugin");
const SVG2Base64_1 = require("../../lib/SVG2Base64");
const base64Img = require("base64-img");
const postcss = require("postcss");
const IMG_CACHE = {};
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
};
const generateNewFileName = (str) => {
    let s = str.split("node_modules");
    const ext = path.extname(str);
    if (s[1]) {
        str = s[1];
    }
    let hash = 0;
    let i;
    let chr;
    let len;
    if (str.length === 0) {
        return hash.toString() + ext;
    }
    for (i = 0, len = str.length; i < len; i++) {
        chr = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + chr;
        hash |= 0;
    }
    let fname = hash.toString() + ext;
    if (fname.charAt(0) === "-") {
        fname = "_" + fname.slice(1);
    }
    return fname;
};
class CSSResourcePluginClass {
    constructor(opts) {
        this.test = /\.css$/;
        this.resolveFn = (p) => path.join("/css-resources", p);
        opts = opts || {};
        if (opts.dist) {
            this.distFolder = Utils_1.ensureDir(opts.dist);
        }
        if (opts.inline) {
            this.inlineImages = opts.inline;
        }
        if (realm_utils_1.utils.isFunction(opts.resolve)) {
            this.resolveFn = opts.resolve;
        }
    }
    init(context) {
        context.allowExtension(".css");
    }
    createResouceFolder(file) {
        if (resourceFolderChecked === false) {
            resourceFolderChecked = true;
            if (this.distFolder) {
                return;
            }
            let outFilePath = Utils_1.ensureUserPath(file.context.outFile);
            let outFileDir = path.dirname(outFilePath);
            this.distFolder = Utils_1.ensureDir(path.join(outFileDir, "css-resources"));
        }
    }
    transform(file) {
        file.loadContents();
        let contents = file.contents;
        if (this.distFolder) {
            this.createResouceFolder(file);
        }
        const currentFolder = file.info.absDir;
        const files = {};
        const tasks = [];
        return postcss([PostCSSResourcePlugin_1.PostCSSResourcePlugin({
                fn: (url) => {
                    let urlFile = path.resolve(currentFolder, url);
                    urlFile = urlFile.replace(/[?\#].*$/, "");
                    if (this.inlineImages) {
                        if (IMG_CACHE[urlFile]) {
                            return IMG_CACHE[urlFile];
                        }
                        if (!fs.existsSync(urlFile)) {
                            file.context.debug("CSSResourcePlugin", `Can't find file ${urlFile}`);
                            return;
                        }
                        const ext = path.extname(urlFile);
                        let fontsExtensions = {
                            ".woff": "application/font-woff",
                            ".woff2": "application/font-woff2",
                            ".eot": "application/vnd.ms-fontobject",
                            ".ttf": "application/x-font-ttf",
                            ".otf": "font/opentype",
                        };
                        if (fontsExtensions[ext]) {
                            let content = new Buffer(fs.readFileSync(urlFile)).toString("base64");
                            return `data:${fontsExtensions[ext]};charset=utf-8;base64,${content}`;
                        }
                        if (ext === ".svg") {
                            let content = SVG2Base64_1.SVG2Base64.get(fs.readFileSync(urlFile).toString());
                            IMG_CACHE[urlFile] = content;
                            return content;
                        }
                        let result = base64Img.base64Sync(urlFile);
                        IMG_CACHE[urlFile] = result;
                        return result;
                    }
                    if (this.distFolder) {
                        let newFileName = generateNewFileName(urlFile);
                        if (!files[urlFile]) {
                            let newPath = path.join(this.distFolder, newFileName);
                            tasks.push(copyFile(urlFile, newPath));
                            files[urlFile] = true;
                        }
                        return this.resolveFn(newFileName);
                    }
                },
            })]).process(contents).then(result => {
            file.contents = result.css;
            return Promise.all(tasks);
        });
    }
}
exports.CSSResourcePluginClass = CSSResourcePluginClass;
exports.CSSResourcePlugin = (options) => {
    return new CSSResourcePluginClass(options);
};
