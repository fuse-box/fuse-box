const $isBrowser = typeof window !== "undefined";

// A runtime storage for Fusebox
const $fsbx = $isBrowser ? (window["__fsbx__"] = window["__fsbx__"] || {}) : {};

// All packages are here
// Used to reference to the outside world
const $packages = $fsbx.p = $fsbx.p || {};

/** 
 * $getNodeModuleName
 * Considers a partial request
 * for Example
 * require("lodash/dist/hello")
 * 
 * @param {any} name
 * @returns
 */
const $getNodeModuleName = (name) => {
    if (!name) { return; }
    var matched = name.match(/^([a-z].*)$/);
    return matched ? name.split(/\/(.+)?/) : undefined;
}

/**
 * Joins paths
 * Works like nodejs path.join
 * @param {any} name
 * @returns
 */
const $pathJoin = function(...string): string {
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
    public static import(name: string) {
        return $getNodeModuleName(name)
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
    public static pkg(name: string, versions: any, fn: any) {
        // Let's not register a package scope twice
        if ($packages[name]) { return fn($packages[name]); }

        // create new package
        let pkg: any = $packages[name] = {};
        let _files: any = pkg.f = {};
        let _scope = pkg.s = {
            // Scope file
            file: (name: string, fn: any) => { _files[name] = fn; },
            // Local import
            import: (path: string) => {
                return $pathJoin("a", "n")
            }
        };
        return pkg;
    }
}