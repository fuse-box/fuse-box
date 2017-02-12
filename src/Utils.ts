import * as path from "path";
import * as fs from 'fs';
const appRoot = require("app-root-path");
const mkdirp = require("mkdirp");

const MBLACKLIST = [
    "freelist",
    "sys"
];

export function camelCase(str: string) {
    let DEFAULT_REGEX = /[-_]+(.)?/g;
    function toUpper(match, group1) {
        return group1 ? group1.toUpperCase() : "";
    }
    return str.replace(DEFAULT_REGEX, toUpper);
}

export function parseQuery(qstr) {
    let query = new Map<string, string>();
    let a = qstr.split("&");
    for (let i = 0; i < a.length; i++) {
        let b = a[i].split("=");
        query.set(decodeURIComponent(b[0]), decodeURIComponent(b[1] || ""));
    }
    return query;
}

/**
 * Does two things:
 * - If a relative path is given,
 *  it is assumed to be relative to appRoot and is then made absolute
 * - Ensures that the directory containing the userPath exits (creates it if needed)
 */
export function ensureUserPath(userPath: string) {
    if (!path.isAbsolute(userPath)) {
        userPath = path.join(appRoot.path, userPath);
    }
    let dir = path.dirname(userPath);
    mkdirp.sync(dir);
    return userPath;
}

export function ensureDir(userPath: string) {
    if (!path.isAbsolute(userPath)) {
        userPath = path.join(appRoot.path, userPath);
    }
    mkdirp.sync(userPath);
    return userPath;
}



export function replaceExt(npath, ext): string {
    if (typeof npath !== "string") {
        return npath;
    }

    if (npath.length === 0) {
        return npath;
    }
    if (/\.[a-z0-9]+$/i.test(npath)) {
        return npath.replace(/\.[a-z0-9]+$/i, ext);
    } else {
        return npath + ext;
    }
}

export function ensurePublicExtension(url: string) {
    let ext = path.extname(url);
    if (ext === ".ts") {
        url = replaceExt(url, ".js");
    }
    if (ext === ".tsx") {
        url = replaceExt(url, ".jsx");
    }
    return url;
}


export function getBuiltInNodeModules(): Array<string> {
    const process: any = global.process;

    return Object.keys(process.binding("natives")).filter(m => {
        return !/^_|^internal|\//.test(m) && MBLACKLIST.indexOf(m) === -1;
    });
}

export function findFileBackwards(target: string, limitPath: string): string {

    let [found, reachedLimit] = [false, false];
    let filename = path.basename(target);
    let current = path.dirname(target);
    let iterations = 0;
    const maxIterations = 10;

    while (found === false && reachedLimit === false) {

        let targetFilePath = path.join(current, filename);
        if (fs.existsSync(targetFilePath)) {
            return targetFilePath;
        }

        if (limitPath === current) {
            reachedLimit = true;
        }
        // going backwards
        current = path.join(current, "..");
        // Making sure we won't have any perpetual loops here
        iterations++;
        if (iterations > maxIterations) {
            reachedLimit = true;
        }
    }
}