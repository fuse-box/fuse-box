import * as path from "path";
import * as fs from "fs";
import * as fsExtra from "fs-extra";
import { utils } from "realm-utils";
import { Config } from "./Config";
import * as LegoAPI from "lego-api";
import { Log } from "./Log";

const userFuseDir = Config.PROJECT_ROOT;
const stylesheetExtensions = new Set<string>([".css", ".sass", ".scss", ".styl", ".less", ".pcss"]);
const MBLACKLIST = [
    "freelist",
    "sys",
];
export type Concat = {
    add(fileName: string | null, content: string | Buffer, sourceMap?: string): void;
    content: Buffer;
    sourceMap: string;
};
export type ConcatModule = {
    new(generateSourceMap: boolean, outputFileName: string, seperator: string): Concat;
};
export const Concat: ConcatModule = require("fuse-concat-with-sourcemaps");

export function contains(array: any[], obj: any) {
    return array && array.indexOf(obj) > -1;
}

export function replaceAliasRequireStatement(requireStatement: string, aliasName: string, aliasReplacement: string) {
    requireStatement = requireStatement.replace(aliasName, aliasReplacement);
    requireStatement = path.normalize(requireStatement);
    return requireStatement;
}

export function jsCommentTemplate(fname: string, conditions: any, variables: any, raw: any, replaceRaw?: any) {
    const contents = fs.readFileSync(fname).toString();

    let data = LegoAPI.parse(contents).render(conditions);
    for (let varName in variables) {
        data = data.replace(`$${varName}$`, JSON.stringify(variables[varName]));
    }
    if (replaceRaw) {
        for (let varName in replaceRaw) {
            data = data.split(varName).join(replaceRaw[varName]);
        }
    }

    for (let varName in raw) {
        data = data.replace(`$${varName}$`, raw[varName]);
    }
    return data;
}

export function getFuseBoxInfo() {
    return require(path.join(Config.FUSEBOX_ROOT, "package.json"));
}

let VERSION_PRINTED = false;
export function printCurrentVersion() {
    if(!VERSION_PRINTED){
        VERSION_PRINTED = true;
        const info = getFuseBoxInfo();
        Log.defer((log) => log.echoYellow(`--- FuseBox ${info.version} ---`));
    }
}


export function getDateTime(){
    const data = new Date();
    let hours : string  | number = data.getHours()
    let minutes : string  | number = data.getMinutes();
    let seconds : string  | number = data.getSeconds();
    hours = hours < 10 ? `0${hours}` : hours;
    minutes = minutes < 10 ? `0${minutes}` : minutes;
    seconds = seconds < 10 ? `0${seconds}` : seconds;
    return `${hours}:${minutes}:${seconds}`;
}


export function uglify(contents: string | Buffer, { es6 = false, ...opts }: any = {}) {
    const UglifyJs = es6 ? require("uglify-es") : require("uglify-js");
    return UglifyJs.minify(contents.toString(), opts);
}

export function readFuseBoxModule(target: string) {
    return fs.readFileSync(path.join(Config.FUSEBOX_MODULES, target)).toString();
}

export function write(fileName: string, contents: any) {
    return new Promise((resolve, reject) => {
        fs.writeFile(fileName, contents, (e) => {
            if (e) {
                return reject(e);
            }
            return resolve();
        });
    });
}

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
        userPath = path.join(userFuseDir, userPath);
    }
    userPath = path.normalize(userPath);
    let dir = path.dirname(userPath);

    fsExtra.ensureDirSync(dir);
    return userPath;
}

export function ensureAbsolutePath(userPath: string) {
    if (!path.isAbsolute(userPath)) {
        return path.join(userFuseDir, userPath);
    }
    return userPath;
}
export function joinFuseBoxPath(...any): string {
    return ensureFuseBoxPath(path.join(...any));
}
export function ensureDir(userPath: string) {
    if (!path.isAbsolute(userPath)) {
        userPath = path.join(userFuseDir, userPath);
    }
    userPath = path.normalize(userPath);

    fsExtra.ensureDirSync(userPath);
    return userPath;
}
export function isStylesheetExtension(str: string) {
    let ext = path.extname(str);
    return stylesheetExtensions.has(ext);
}

export function escapeRegExp(str: string) {
    return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}

export function string2RegExp(obj: any) {
    let escapedRegEx = obj
        .replace(/\*/g, "@")

        .replace(/[.?*+[\]-]/g, "\\$&")
        .replace(/@@/g, ".*", "i")
        .replace(/@/g, "\\w{1,}", "i");

    if (escapedRegEx.indexOf("$") === -1) {
        escapedRegEx += "$";
    }
    return new RegExp(escapedRegEx);
}

export function removeFolder(userPath) {
    fsExtra.removeSync(userPath);
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

export function isGlob(str: string): Boolean {
    if (!str) {
        return false;
    }
    return /\*/.test(str);
}

export function hashString(text: string) {
    var hash = 5381,
        index = text.length;

    while (index) {
        hash = (hash * 33) ^ text.charCodeAt(--index);
    }
    let data = hash >>> 0;
    return data.toString(16);
}
export function isClass(obj) {
    const isCtorClass = obj.constructor
        && obj.constructor.toString().substring(0, 5) === 'class'
    if (obj.prototype === undefined) {
        return isCtorClass
    }
    const isPrototypeCtorClass = obj.prototype.constructor
        && obj.prototype.constructor.toString
        && obj.prototype.constructor.toString().substring(0, 5) === 'class'
    return isCtorClass || isPrototypeCtorClass
}

export function fastHash(text: string) {
    let hash = 0;
    if (text.length == 0) return hash;
    for (let i = 0; i < text.length; i++) {
        let char = text.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    let result = hash.toString(16).toString();
    if( result.charAt(0) === '-'){
        result = result.replace(/-/, '0');
    }
    return result;
}
export function extractExtension(str: string) {
    const result = str.match(/\.([a-z0-9]+)\$?$/);
    if (!result) {
        throw new Error(`Can't extract extension from string ${str}`);
    }
    return result[1];
}
export function ensureFuseBoxPath(input: string) {
    return input.replace(/\\/g, "/").replace(/\/$/, "");
}
export function ensureCorrectBundlePath(input : string){
    input = ensureFuseBoxPath(input);
    input = ensurePublicExtension(input);
    return input;
}

export function transpileToEs5(contents: string) {
    const ts = require("typescript");
    let tsconfg: any = {
        compilerOptions: {
            module: "commonjs",
            target: "es5"
        },
    };;
    let result = ts.transpileModule(contents, tsconfg);
    return result.outputText;
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

export function walk(dir, options?: any) {
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
            if (stat && stat.isDirectory()) results = results.concat(walk(file));
            else results.push(file);
        } else if (stat && stat.isFile()) {
            results.push(file);
        }
    });
    return results;
}


/* UTILITIES */

export function filter(items: any, fn: any) {
    if (Array.isArray(items)) {
        return items.filter(fn);
    }

    if (utils.isPlainObject(items)) {
        let newObject = {};
        for (let key in items) {
            if (items.hasOwnProperty(key)) {
                if (fn(items[key], key)) {
                    newObject[key] = items[key]
                }
            }
        }
        return newObject;
    }
}

// converted and optimized from https://www.npmjs.com/package/cli-spinner
const readline = require('readline');
class Spinner {
    public text: string = '';
    public title: string = '';
    public chars: string = "⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏";
    public stream: any = process.stdout;
    public id: number | any;
    public delay: number = 60;

    constructor(options: any) {
        if (typeof options === "string") {
            options = { text: options };
        } else if (!options) {
            options = {};
        }

        if (options.text) this.text = options.text;
        if (options.onTick) this.onTick = options.onTick;
        if (options.stream) this.stream = options.stream;
        if (options.title) this.title = options.title;
        if (options.delay) this.delay = options.delay;
    }

    public start() {
        let current = 0
        this.id = setInterval(() => {
            let msg = this.chars[current] + ' ' + this.text
            if (this.text.includes('%s')) {
                msg = this.text.replace('%s', this.chars[current])
            }

            this.onTick(msg)
            current = ++current % this.chars.length
        }, this.delay)
        return this
    }

    public stop(clear: boolean) {
        clearInterval(this.id)
        this.id = undefined
        if (clear) {
            this.clearLine(this.stream)
        }
        return this
    }

    public isSpinning(): boolean {
        return this.id !== undefined
    }

    public onTick(msg: any) {
        this.clearLine(this.stream)
        this.stream.write(msg)
        return this
    }

    public clearLine(stream: any) {
        readline.clearLine(stream, 0)
        readline.cursorTo(stream, 0)
        return this
    }
}

export { Spinner };
