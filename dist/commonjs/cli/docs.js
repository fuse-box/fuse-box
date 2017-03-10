"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fsbx = require("../index");
const fs = require("fs");
const path = require("path");
const appRoot = require("app-root-path");
const Utils_1 = require("../Utils");
const base = appRoot.path;
const src = path.resolve(base, "./src");
const resolveSrc = file => path.resolve(src, file);
const resolveRoot = file => path.resolve(base, file);
const mds = {};
const mdKeys = [];
const plugins = Object.keys(fsbx).filter((key) => key.includes("Plugin"));
exports.plugins = plugins;
function findDocsFor(name) {
    let found = ``;
    const mdsFound = [];
    const keysFound = [];
    mdKeys.forEach(key => {
        const md = mds[key];
        const anyU = `.[\\s\\S]*?`;
        const titleToMatch = `(#{1,2}(${anyU}))`;
        const untilNextTitle = `(?!#{1,5})`;
        const untilNextHeader = `(?:^#{1,2})${untilNextTitle})`;
        const reg = new RegExp(`(${titleToMatch}(${name})(${anyU}${untilNextHeader})`, "gmi");
        const match = md.match(reg);
        if (match) {
            mdsFound.push(md);
            const spl = match[0].split(/#{1,6}/gmi).filter(line => line && line.length > 0);
            found += spl.pop();
            keysFound.push(key);
        }
    });
    return "";
}
exports.findDocsFor = findDocsFor;
function gatherDocs() {
    const mdFiles = Utils_1.walk(resolveRoot("./docs"));
    mdFiles.forEach(md => {
        const contents = fs.readFileSync(md, "utf8");
        const file = md.split("/").pop().replace(".md", "");
        mds[file] = contents;
        mdKeys.push(file);
    });
}
gatherDocs();
function githubSrcFor(name) {
    return `https://github.com/fuse-box/fuse-box/tree/master/src/plugins/` + name + ".ts";
}
exports.githubSrcFor = githubSrcFor;
function docsLinkFor(name) {
    return `http://fuse-box.org/#` + name.toLowerCase();
}
exports.docsLinkFor = docsLinkFor;
function codeFor(file) {
    try {
        const fileAbs = resolveSrc(file);
        const contents = fs.readFileSync(fileAbs, "utf8");
        return contents;
    }
    catch (e) {
        console.log(e);
        return false;
    }
}
exports.codeFor = codeFor;
exports.default = {
    findDocsFor,
    githubSrcFor,
    docsLinkFor,
    codeFor,
    plugins,
};
