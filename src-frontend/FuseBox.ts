declare let __root__: any;
const $isBrowser = typeof window !== "undefined";
__root__ = !$isBrowser ? module.exports : __root__;
// A runtime storage for Fusebox
const $fsbx = $isBrowser ? (window["__fsbx__"] = window["__fsbx__"] || {})
    : global["$fsbx"] = global["$fsbx"] || {}; // in case of nodejs

// All packages are here
// Used to reference to the outside world
const $packages = $fsbx.p = $fsbx.p || {};

const $events = $fsbx.e = $fsbx.e || {};

/** 
 * $getNodeModuleName
 * Considers a partial request
 * for Example
 * require("lodash/dist/hello")
 * @param {any} name
 * @returns
 */
const $getNodeModuleName = (name) => {
    return name ? /^([a-z].*)$/.test(name) ? name.split(/\/(.+)?/) : false : false
}

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

const $getRef = (name, opts: any) => {
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
        throw `Package was not found "${pkg_name}"`;
    }
    if (!name) {
        name = "./" + pkg.s.entry;
    }

    if (!pkg) { return; } // package not found


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

    return [file, pkg_name, pkg.v, filePath, validPath]
}


const $trigger = (name: string, args: any) => {
    let e = $events[name];
    if (e) {
        for (let i in e) { e[i].apply(null, args) };
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
    let [file, pkg_name, pkgCustomVersions, filePath, validPath] = $getRef(name, opts);

    if (!file) {
        throw `File not found ${filePath}`;
    }
    if (file.locals && file.locals.module) {
        return file.locals.module.exports;
    }
    let locals: any = file.locals = {};
    let __filename = name;
    let __dirname = $getDir(validPath);

    locals.exports = {};
    locals.module = { exports: locals.exports };
    locals.require = (name: string) => {
        return $import(name, { pkg: pkg_name, path: __dirname, v: pkgCustomVersions });
    }
    let args = [locals.module.exports, locals.require, locals.module, validPath, __dirname, pkg_name];
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
        let [file] = $getRef(path, {});
        return file !== undefined;
    }

    public static expose(obj: any) {
        for (let key in obj) {
            let data = obj[key];
            let exposed;
            if (data.entry) {
                exposed = $import("./" + data.entry);
            } else {
                exposed = $import(data.pkg);
            }
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