declare let __root__: any;
const $isBrowser = typeof window !== "undefined" && window.navigator;

// Patching global variable
if ($isBrowser) {
    window["global"] = window;
}

__root__ = !$isBrowser ? module.exports : __root__;
// A runtime storage for Fusebox
const $fsbx = $isBrowser ? (window["__fsbx__"] = window["__fsbx__"] || {})
    : global["$fsbx"] = global["$fsbx"] || {}; // in case of nodejs

if (!$isBrowser) {
    global["require"] = require;
}
// All packages are here
// Used to reference to the outside world
const $packages = $fsbx.p = $fsbx.p || {};

// A list of custom events
// For example "after-import"
const $events = $fsbx.e = $fsbx.e || {};


/**
 * Reference interface
 * Contain information about user import;
 * Having FuseBox.import("./foo/bar") makes analysis on the string
 * Detects if it's package or not, explicit references are given as well
 * 
 * 
 * @interface IReference
 */
interface IReference {
    file?: any;
    // serverReference is a result of nodejs require statement
    // In case if module is not in a bundle
    serverReference?: string;
    // Current package name
    pkgName?: string;
    // Custom version to take into a consideration
    versions?: any;
    // User path
    filePath?: string;
    // Converted valid path (with extension)
    // That can be recognized by FuseBox
    validPath?: string;
}

/** 
 * $getNodeModuleName
 * Considers a partial request
 * for Example
 * require("lodash/dist/hello")
 * @param {any} name
 * @returns
 */
const $getNodeModuleName = (name) => {
    if (/^([@a-z].*)$/.test(name)) {
        if (name[0] === "@") {
            let s = name.split("/");
            let target = s.splice(2, s.length).join("/");
            return [`${s[0]}/${s[1]}`, target || undefined];
        }
        return name.split(/\/(.+)?/);
    }
}

// Gets file directory
const $getDir = (filePath: string) => {
    return filePath.substring(0, filePath.lastIndexOf('/')) || "./";
}

/**
 * Joins paths
 * Works like nodejs path.join
 * @param {any} name
 * @returns
 */
const $pathJoin = function (...string): string {
    let parts = [];
    for (let i = 0, l = arguments.length; i < l; i++) {
        parts = parts.concat(arguments[i].split("/"));
    }
    let newParts = [];
    for (let i = 0, l = parts.length; i < l; i++) {
        let part = parts[i];
        if (!part || part === ".") { continue; }
        if (part === "..") { newParts.pop(); } else { newParts.push(part); }
    }
    if (parts[0] === "") { newParts.unshift(""); }
    return newParts.join("/") || (newParts.length ? "/" : ".");
}

/**
 * Adds javascript extension if no extension was spotted
 */
const $ensureExtension = (name): string => {
    let matched = name.match(/\.(\w{1,})$/);
    if (matched) {
        let ext = matched[1];
        // Adding extension if none was found
        // Might ignore the case of weird convention like this:
        // modules/core.object.define (core-js)
        // Will be handled differently afterwards
        if (!ext) {
            return name + ".js";
        }
        return name;
    }
    return name + ".js";
}

const $loadURL = (url: string) => {
    if ($isBrowser) {
        let d = document;
        var head = d.getElementsByTagName('head')[0];
        var target;
        if (/\.css$/.test(url)) {
            target = d.createElement('link');
            target.rel = 'stylesheet';
            target.type = 'text/css';
            target.href = url;
        } else {
            target = d.createElement('script');
            target.type = 'text/javascript';
            target.src = url;
            target.async = true;
        }
        head.insertBefore(target, head.firstChild);
    }
}


const $getRef = (name, opts: any): IReference => {
    let basePath = opts.path || "./";
    let pkg_name = opts.pkg || "default";
    let nodeModule = $getNodeModuleName(name);

    if (nodeModule) {
        // reset base path
        basePath = "./";
        pkg_name = nodeModule[0];
        // if custom version is detected
        // We need to modify package path
        // To look like pkg@1.0.0
        if (opts.v && opts.v[pkg_name]) {
            pkg_name = `${pkg_name}@${opts.v[pkg_name]}`;
        }
        name = nodeModule[1];
    }
    // Tilde test
    if (/^~/.test(name)) {
        name = name.slice(2, name.length);
        basePath = "./";
    }

    let pkg = $packages[pkg_name];

    if (!pkg) {
        if ($isBrowser) {
            throw `Package was not found "${pkg_name}"`;
        } else {
            // Return "real" node module 
            return {
                serverReference: require(pkg_name)
            }
        }
    }
    if (!name) {
        name = "./" + pkg.s.entry;
    }

    let filePath = $pathJoin(basePath, name);
    // Try first adding .js if missing
    let validPath = $ensureExtension(filePath)
    let file = pkg.f[validPath];
    if (!file) {
        // try folder index.js
        validPath = $pathJoin(filePath, "/", "index.js");
        file = pkg.f[validPath];
        // last resort try adding .js extension
        // Some libraries have a weired convention of naming file lile "foo.bar""
        if (!file) {
            validPath = filePath + ".js";
            file = pkg.f[validPath];
        }
    }
    return {
        file: file,
        pkgName: pkg_name,
        versions: pkg.v,
        filePath: filePath,
        validPath: validPath
    }
}

/**
 * $async
 * Async request 
 * Makes it possible to request files asynchronously
 * 
 */
const $async = (file: string, cb) => {
    if ($isBrowser) {
        var xmlhttp;
        xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                let contentType = xmlhttp.getResponseHeader("Content-Type");
                let content = xmlhttp.responseText;
                if (/json/.test(contentType)) {
                    content = `module.exports = ${content}`;
                } else {
                    if (!/javascript/.test(contentType)) {
                        content = `module.exports = ${JSON.stringify(content)}`;
                    }
                }
                let normalized = $pathJoin("./", file);
                FuseBox.dynamic(normalized, content);
                cb(FuseBox.import(file, {}));
            }
        }
        xmlhttp.open("GET", file, true);
        xmlhttp.send();
    } else {
        if (/\.(js|json)$/.test(file)) {
            return cb(global["require"](file));
        } return cb("");
    }
}


/**
 * Trigger events
 * If a registered callback returns "false"
 * We break the loop
 */
const $trigger = (name: string, args: any) => {
    let e = $events[name];
    if (e) {
        for (let i in e) {
            let res = e[i].apply(null, args);
            if (res === false) {
                return false;
            }
        };
    }
}

/**
 * Imports File
 * With opt provided it's possible to set:
 *   1) Base directory
 *   2) Target package name
 * @param {any} name
 * @returns
 */
const $import = (name: string, opts: any = {}) => {
    // Test for external URLS  

    if (/^(http(s)?:|\/\/)/.test(name)) {
        return $loadURL(name);
    }


    let ref = $getRef(name, opts);
    if (ref.serverReference) {
        return ref.serverReference;
    }
    let file = ref.file;



    if (!file) {
        let asyncMode = typeof opts === "function";
        let processStopped = $trigger("async", [name, opts]);
        if (processStopped === false) {
            return;
        }
        return $async(name, (result) => {
            if (asyncMode) {
                return opts(result)
            }
        });
        //throw `File not found ${ref.validPath}`;
    }
    let validPath = ref.validPath;
    let pkgName = ref.pkgName;

    if (file.locals && file.locals.module) {
        return file.locals.module.exports;
    }
    let locals: any = file.locals = {};
    let __filename = name;
    let fuseBoxDirname = $getDir(validPath);

    locals.exports = {};
    locals.module = { exports: locals.exports };
    locals.require = (name: string, optionalCallback: any) => {
        return $import(name, {
            pkg: pkgName,
            path: fuseBoxDirname,
            v: ref.versions
        });
    }
    locals.require.main = {
        filename: $isBrowser ? "./" : global["require"].main.filename
    }

    let args = [locals.module.exports, locals.require, locals.module, validPath, fuseBoxDirname, pkgName];
    $trigger("before-import", args);
    file.fn.apply(0, args);
    $trigger("after-import", args);
    return locals.module.exports;
}

/**
 * 
 * 
 * @class FuseBox
 */
class FuseBox {
    public static get isBrowser() {
        return $isBrowser !== undefined;
    }

    public static get isServer() {
        return !$isBrowser;
    }

    public static global(key: string, obj?: any) {
        let target = $isBrowser ? window : global;
        if (obj === undefined) {
            return target[key];
        }
        target[key] = obj;
    }

    /**
     * 
     * 
     * @static
     * @param {string} name
     * @returns
     * 
     * @memberOf FuseBox
     */
    public static import(name: string, opts: any) {
        return $import(name, opts);
    }

    public static on(name: string, fn: any) {
        $events[name] = $events[name] || [];
        $events[name].push(fn);
    }

    /**
     * Check if a file exists in path
     * 
     * @static
     * @param {string} path
     * @returns
     * 
     * @memberOf FuseBox
     */
    public static exists(path: string) {
        let ref = $getRef(path, {});
        return ref.file !== undefined;
    }

    public static main() { }

    public static expose(obj: any) {
        for (let key in obj) {
            let data = obj[key];
            let exposed = $import(data.pkg);
            __root__[data.alias] = exposed;
        }
    }


    /**
     * Registers a dynamic path
     * 
     * @static
     * @param {string} path
     * @param {string} str
     * 
     * @memberOf FuseBox
     */
    public static dynamic(path: string, str: string) {
        this.pkg("default", {}, function (___scope___) {
            ___scope___.file(path, function (exports, require, module, __filename, __dirname) {
                var res = new Function('exports', 'require', 'module', '__filename', '__dirname', '__root__', str);
                res(exports, require, module, __filename, __dirname, __root__);
            });
        });
    }

    /**
     * 
     * Register a package
     * @static
     * @param {string} name
     * @param {*} versions
     * @param {*} fn
     * 
     * @memberOf FuseBox
     */
    public static pkg(pkg_name: string, versions: any, fn: any) {
        // Let's not register a package scope twice
        if ($packages[pkg_name]) { return fn($packages[pkg_name].s); }
        // create new package
        let pkg: any = $packages[pkg_name] = {};
        let _files: any = pkg.f = {};
        // storing versions
        pkg.v = versions;
        let _scope = pkg.s = {
            // Scope file
            file: (name: string, fn: any) => { _files[name] = { fn: fn }; },
        };
        return fn(_scope);
    }
}