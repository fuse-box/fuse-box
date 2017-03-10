"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const fs = require("fs");
const fsExtra = require("fs-extra");
const realm_utils_1 = require("realm-utils");
const appRoot = require("app-root-path");
const MBLACKLIST = [
    "freelist",
    "sys",
];
exports.Concat = require("concat-with-sourcemaps");
function contains(array, obj) {
    return array && array.indexOf(obj) > -1;
}
exports.contains = contains;
function replaceAliasRequireStatement(requireStatement, aliasName, aliasReplacement) {
    requireStatement = requireStatement.replace(aliasName, aliasReplacement);
    requireStatement = path.normalize(requireStatement);
    return requireStatement;
}
exports.replaceAliasRequireStatement = replaceAliasRequireStatement;
function write(fileName, contents) {
    return new Promise((resolve, reject) => {
        fs.writeFile(fileName, contents, (e) => {
            if (e) {
                return reject(e);
            }
            return resolve();
        });
    });
}
exports.write = write;
function camelCase(str) {
    let DEFAULT_REGEX = /[-_]+(.)?/g;
    function toUpper(match, group1) {
        return group1 ? group1.toUpperCase() : "";
    }
    return str.replace(DEFAULT_REGEX, toUpper);
}
exports.camelCase = camelCase;
function parseQuery(qstr) {
    let query = new Map();
    let a = qstr.split("&");
    for (let i = 0; i < a.length; i++) {
        let b = a[i].split("=");
        query.set(decodeURIComponent(b[0]), decodeURIComponent(b[1] || ""));
    }
    return query;
}
exports.parseQuery = parseQuery;
function ensureUserPath(userPath) {
    if (!path.isAbsolute(userPath)) {
        userPath = path.join(appRoot.path, userPath);
    }
    userPath = path.normalize(userPath);
    let dir = path.dirname(userPath);
    fsExtra.ensureDirSync(dir);
    return userPath;
}
exports.ensureUserPath = ensureUserPath;
function ensureDir(userPath) {
    if (!path.isAbsolute(userPath)) {
        userPath = path.join(appRoot.path, userPath);
    }
    userPath = path.normalize(userPath);
    fsExtra.ensureDirSync(userPath);
    return userPath;
}
exports.ensureDir = ensureDir;
function string2RegExp(obj) {
    let escapedRegEx = obj
        .replace(/\*/g, "@")
        .replace(/[.?*+[\]-]/g, "\\$&")
        .replace(/@/g, "\\w{1,}", "i");
    if (escapedRegEx.indexOf("$") === -1) {
        escapedRegEx += "$";
    }
    return new RegExp(escapedRegEx);
}
exports.string2RegExp = string2RegExp;
function removeFolder(userPath) {
    fsExtra.removeSync(userPath);
}
exports.removeFolder = removeFolder;
function replaceExt(npath, ext) {
    if (typeof npath !== "string") {
        return npath;
    }
    if (npath.length === 0) {
        return npath;
    }
    if (/\.[a-z0-9]+$/i.test(npath)) {
        return npath.replace(/\.[a-z0-9]+$/i, ext);
    }
    else {
        return npath + ext;
    }
}
exports.replaceExt = replaceExt;
function extractExtension(str) {
    const result = str.match(/\.([a-z0-9]+)\$?$/);
    if (!result) {
        throw new Error(`Can't extract extension from string ${str}`);
    }
    return result[1];
}
exports.extractExtension = extractExtension;
function ensureFuseBoxPath(input) {
    return input.replace(/\\/g, "/");
}
exports.ensureFuseBoxPath = ensureFuseBoxPath;
function ensurePublicExtension(url) {
    let ext = path.extname(url);
    if (ext === ".ts") {
        url = replaceExt(url, ".js");
    }
    if (ext === ".tsx") {
        url = replaceExt(url, ".jsx");
    }
    return url;
}
exports.ensurePublicExtension = ensurePublicExtension;
function getBuiltInNodeModules() {
    const process = global.process;
    return Object.keys(process.binding("natives")).filter(m => {
        return !/^_|^internal|\//.test(m) && MBLACKLIST.indexOf(m) === -1;
    });
}
exports.getBuiltInNodeModules = getBuiltInNodeModules;
function findFileBackwards(target, limitPath) {
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
        current = path.join(current, "..");
        iterations++;
        if (iterations > maxIterations) {
            reachedLimit = true;
        }
    }
}
exports.findFileBackwards = findFileBackwards;
function walk(dir, options) {
    var defaults = {
        recursive: false,
    };
    options = Object.assign(defaults, options);
    var results = [];
    var list = fs.readdirSync(dir);
    list.forEach(function (file) {
        file = dir + "/" + file;
        var stat = fs.statSync(file);
        if (options.recursive) {
            if (stat && stat.isDirectory())
                results = results.concat(walk(file));
            else
                results.push(file);
        }
        else if (stat && stat.isFile()) {
            results.push(file);
        }
    });
    return results;
}
exports.walk = walk;
function filter(items, fn) {
    if (Array.isArray(items)) {
        return items.filter(fn);
    }
    if (realm_utils_1.utils.isPlainObject(items)) {
        let newObject = {};
        for (let key in items) {
            if (items.hasOwnProperty(key)) {
                if (fn(items[key], key)) {
                    newObject[key] = items[key];
                }
            }
        }
        return newObject;
    }
}
exports.filter = filter;
