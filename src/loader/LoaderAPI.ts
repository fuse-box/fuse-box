/**
 * This whole file is wrapped in a function by our gulpfile.js
 * The function is injected the global `this` as `__root__`
 **/
const $isBrowser = typeof window !== "undefined" && window.navigator;
const g = $isBrowser ? window : global;
declare let __root__: any;
declare let __fbx__dnm__: any;

/**
 * Package name to version
 */
type PackageVersions = {
    [pkg: string]: /** version e.g. `1.0.0`` */string
};

/**
 * Holds the details for a loaded package
 */
type PackageDetails = {
    /** Holds the package scope */
    s: {
        entry?: string
        file?: any
    },
    /** Holds package files */
    f: {
        [name: string]: {
            fn: Function
            /** Locals if any */
            locals?: any
        }
    },
    v: PackageVersions,
};

/**
 * A runtime storage for FuseBox
 */
type FSBX = {
    p?: {
        [packageName: string]: PackageDetails;
    },
    /** FuseBox events */
    e?: {
        "after-import"?: any;
    }
};

// Patching global variable
if ($isBrowser) {
    g["global"] = window;
}

// Set root
// __fbx__dnm__ is a variable that is used in dynamic imports
// In order for dynamic imports to work, we need to switch window to module.exports
__root__ = !$isBrowser || typeof __fbx__dnm__ !== "undefined" ? module.exports : __root__;

/**
 * A runtime storage for FuseBox
 */
const $fsbx: FSBX = $isBrowser ? (window["__fsbx__"] = window["__fsbx__"] || {})
    : g["$fsbx"] = g["$fsbx"] || {}; // in case of nodejs

if (!$isBrowser) {
    g["require"] = require;
}
/**
 * All packages are here
 *  Used to reference to the outside world
 */
const $packages = $fsbx.p = $fsbx.p || {};

// A list of custom events
// For example "after-import"
const $events = $fsbx.e = $fsbx.e || {};

/**
 * Reference interface
 * Contain information about user import;
 * Having FuseBox.import("./foo/bar") makes analysis on the string
 * Detects if it's package or not, explicit references are given as well
 */
interface IReference {
    file?: any;
    /**
     * serverReference is a result of nodejs require statement
     * In case if module is not in a bundle
     */
    server?: string;
    /** Current package name */
    pkgName?: string;
    /** Custom version to take into a consideration */
    versions?: any;
    /** User path */
    filePath?: string;
    /**
     * Converted valid path (with extension)
     * That can be recognized by FuseBox
     */
    validPath?: string;
    /** Require with wildcards (e.g import("/lib/*")) */
    wildcard?: string;
}

/**
 * $getNodeModuleName
 * Considers a partial request
 * for Example
 * require("lodash/dist/hello")
 */
function $getNodeModuleName(name: string) {
    const n = name.charCodeAt(0);
    const s = name.charCodeAt(1);
    // basically a hack for windows to stop recognising
    // c:\ as a valid node module
    if (!$isBrowser && s === 58) {
        return;
    }
    // https://www.cambiaresearch.com/articles/15/javascript-char-codes-key-codes
    // basically lowcase alphabet starts with 97 ends with 122, and symbol @ is 64
    // which 2x faster than /^([@a-z].*)$/
    if (n >= 97 && n <= 122 || n === 64) {
        if (n === 64) { // if it's "@" symbol
            let s = name.split("/");
            let target = s.splice(2, s.length).join("/");
            return [`${s[0]}/${s[1]}`, target || undefined];
        }
        // this approach is 3x - 4x faster than
        // name.split(/\/(.+)?/);
        let index = name.indexOf("/");
        if (index === -1) {
            return [name];
        }
        let first = name.substring(0, index);
        let second = name.substring(index + 1);
        return [first, second];
    }
};

/** Gets file directory */
function $getDir(filePath: string) {
    return filePath.substring(0, filePath.lastIndexOf("/")) || "./";
};

/**
 * Joins paths
 * Works like nodejs path.join
 */
function $pathJoin(...string: string[]): string {
    let parts: string[] = [];
    for (let i = 0, l = arguments.length; i < l; i++) {
        parts = parts.concat(arguments[i].split("/"));
    }
    let newParts = [];
    for (let i = 0, l = parts.length; i < l; i++) {
        let part = parts[i];
        if (!part || part === ".") continue;
        if (part === "..") {
            newParts.pop();
        } else {
            newParts.push(part);
        }
    }
    if (parts[0] === "") newParts.unshift("");
    return newParts.join("/") || (newParts.length ? "/" : ".");
};

/**
 * Adds javascript extension if no extension was spotted
 */
function $ensureExtension(name: string): string {
    let matched = name.match(/\.(\w{1,})$/);
    if (matched) {
        // @NOTE: matched [1] is the `ext` we are looking for
        //
        // Adding extension if none was found
        // Might ignore the case of weird convention like this:
        // modules/core.object.define (core-js)
        // Will be handled differently afterwards
        if (!matched[1]) {
            return name + ".js";
        }
        return name;
    }
    return name + ".js";
};

/**
 * Loads a url
 *  inserts a script tag or a css link based on url extension
 */
function $loadURL(url: string) {
    if ($isBrowser) {
        let d = document;
        var head = d.getElementsByTagName("head")[0];
        var target;
        if (/\.css$/.test(url)) {
            target = d.createElement("link");
            target.rel = "stylesheet";
            target.type = "text/css";
            target.href = url;
        } else {
            target = d.createElement("script");
            target.type = "text/javascript";
            target.src = url;
            target.async = true;
        }
        head.insertBefore(target, head.firstChild);
    }
};

/**
 * Loop through an objects own keys and call a function with the key and value
 */
function $loopObjKey(obj: Object, func: Function) {
    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            func(key, obj[key]);
        }
    }
};

function $serverRequire(path) {
    return { server: require(path) };
};

type RefOpts = {
    path?: string;
    pkg?: string;
    v?: PackageVersions;
};
function $getRef(name: string, o: RefOpts): IReference {
    let basePath = o.path || "./";
    let pkgName = o.pkg || "default";
    let nodeModule = $getNodeModuleName(name);

    if (nodeModule) {
        // reset base path
        basePath = "./";
        pkgName = nodeModule[0];
        // if custom version is detected
        // We need to modify package path
        // To look like pkg@1.0.0
        if (o.v && o.v[pkgName]) {
            pkgName = `${pkgName}@${o.v[pkgName]}`;
        }
        name = nodeModule[1];
    }
    // Tilde test
    // Charcode is 2x faster
    //if (/^~/.test(name)) {
    if (name) {
        if (name.charCodeAt(0) === 126) {
            name = name.slice(2, name.length);
            basePath = "./";
        } else {
            // check for absolute paths for nodejs
            // either first one is / (47 for *nix) or second one : (58 for windows)
            if (!$isBrowser && (name.charCodeAt(0) === 47 || name.charCodeAt(1) === 58)) {
                return $serverRequire(name);
            }
        }
    }

    let pkg = $packages[pkgName];

    if (!pkg) {
        if ($isBrowser && FuseBox.target !== "electron") {
            throw "Package not found " + pkgName;
        } else {
            // Return "real" node module
            return $serverRequire(pkgName + (name ? "/" + name : ""));
        }
    }

    name = name ? name : "./" + pkg.s.entry;

    // get rid of options
    // if (name.indexOf("?") > -1) {
    //     let paramsSplit = name.split(/\?(.+)/);
    //     name = paramsSplit[0];
    // }

    let filePath = $pathJoin(basePath, name);
    // Try first adding .js if missing
    let validPath = $ensureExtension(filePath);
    let file = pkg.f[validPath];
    let wildcard;
    // Probing for wildcard
    if (!file && validPath.indexOf("*") > -1) {
        wildcard = validPath;
    }
    if (!file && !wildcard) {
        // try folder index.js
        validPath = $pathJoin(filePath, "/", "index.js");
        file = pkg.f[validPath];
        // last resort try adding .js extension
        // Some libraries have a weired convention of naming file lile "foo.bar""
        if (!file) {
            validPath = filePath + ".js";
            file = pkg.f[validPath];
        }

        // if file is not found STILL
        // then we can try JSX
        if (!file) {
            // try for JSX one last time
            file = pkg.f[filePath + ".jsx"];
        }

        if (!file) {
            validPath = filePath + "/index.jsx";
            file = pkg.f[validPath];
        }
    }

    return {
        file,
        wildcard,
        pkgName,
        versions: pkg.v,
        filePath,
        validPath,
    };
};

/**
 * $async
 * Async request
 * Makes it possible to request files asynchronously
 */
function $async(file: string, cb: (imported?: any) => any, o: any = {}) {
    if ($isBrowser) {
        if (o && o.ajaxed === file) {
            return console.error(file, 'does not provide a module');
        }
        var xmlhttp: XMLHttpRequest = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState == 4) {
                if (xmlhttp.status == 200) {
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
                    cb(FuseBox.import(file, { ajaxed: file }));
                } else {
                    console.error(file, 'not found on request');
                    cb(undefined);
                }
            }
        };
        xmlhttp.open("GET", file, true);
        xmlhttp.send();
    } else {
        if (/\.(js|json)$/.test(file)) return cb(g["require"](file));
        return cb("");
    }
};

/**
 * Trigger events
 * If a registered callback returns "false"
 * We break the loop
 */
function $trigger(name: string, args: any) {
    let e = $events[name];
    if (e) {
        for (let i in e) {
            let res = e[i].apply(null, args);
            if (res === false) {
                return false;
            }
        }
        ;
    }
};

/**
 * Imports File
 * With opt provided it's possible to set:
 *   1) Base directory
 *   2) Target package name
 */
function $import(name: string, o: any = {}) {

    // Test for external URLS
    // Basically : symbol can occure only at 4 and 5 position
    // Cuz ":" is a not a valid symbol in filesystem
    // Charcode test is 3-4 times faster than regexp
    // 58 charCode is ":""
    // console.log( ":".charCodeAt(0) )
    // if (/^(http(s)?:|\/\/)/.test(name)) {
    //     return $loadURL(name);
    // }
    if (name.charCodeAt(4) === 58 || name.charCodeAt(5) === 58) {
        return $loadURL(name);
    }

    let ref = $getRef(name, o);
    if (ref.server) {
        return ref.server;
    }
    let file = ref.file;

    // Wild card reference
    if (ref.wildcard) {
        // Prepare wildcard regexp
        let safeRegEx: RegExp = new RegExp(ref.wildcard
            .replace(/\*/g, "@")
            .replace(/[.?*+^$[\]\\(){}|-]/g, "\\$&")
            .replace(/@@/g, ".*")
            .replace(/@/g, "[a-z0-9$_-]+"), "i");

        let pkg = $packages[ref.pkgName];
        if (pkg) {
            let batch = {};
            for (let n in pkg.f) {
                if (safeRegEx.test(n)) {
                    batch[n] = $import(`${ref.pkgName}/${n}`);
                }
            }
            return batch;
        }
    }

    if (!file) {
        let asyncMode = typeof o === "function";
        let processStopped = $trigger("async", [name, o]);
        if (processStopped === false) {
            return;
        }
        return $async(name, (result) => asyncMode ? o(result) : null, o);
        // throw `File not found ${ref.validPath}`;
    }

    // pkgName
    let pkg = ref.pkgName;

    if (file.locals && file.locals.module) return file.locals.module.exports;
    let locals: any = file.locals = {};

    // @NOTE: is fuseBoxDirname
    const path = $getDir(ref.validPath);

    locals.exports = {};
    locals.module = { exports: locals.exports };
    locals.require = (name: string, optionalCallback: any) => {
        return $import(name, {
            pkg,
            path,
            v: ref.versions,
        });
    };

    if ($isBrowser || !g["require"].main) {
        locals.require.main = { filename: "./", paths: [] };
    } else {
        locals.require.main = g["require"].main;
    }

    let args = [locals.module.exports, locals.require, locals.module, ref.validPath, path, pkg];
    $trigger("before-import", args);

    file.fn.apply(0, args);
    // fn(locals.module.exports, locals.require, locals.module, validPath, fuseBoxDirname, pkgName)
    $trigger("after-import", args);
    return locals.module.exports;
};

type SourceChangedEvent = {
    type: "js" | "css",
    content: string,
    path: string
};

interface LoaderPlugin {
    /**
     * If true is returned by the plugin
     *  it means that module change has been handled
     *  by plugin and no special work is needed by FuseBox
     **/
    hmrUpdate?(evt: SourceChangedEvent): boolean;
}

/**
 * The FuseBox client side loader API
 */
class FuseBox {
    public static packages = $packages;
    public static mainFile: string;
    public static isBrowser = $isBrowser;
    public static isServer = !$isBrowser;

    public static global(key: string, obj?: any) {
        if (obj === undefined) return g[key];
        g[key] = obj;
    }

    /**
     * Imports a module
     */
    public static import(name: string, o?: any) {
        return $import(name, o);
    }

    /**
     * @param  {string} n name
     * @param  {any}    fn   [description]
     * @return void
     */
    public static on(n: string, fn: any) {
        $events[n] = $events[n] || [];
        $events[n].push(fn);
    }

    /**
     * Check if a file exists in path
     */
    public static exists(path: string) {
        try {
            let ref = $getRef(path, {});
            return ref.file !== undefined;
        }
        catch (err) {
            return false;
        }
    }

    /**
     * Removes a module
     */
    public static remove(path: string) {
        let ref = $getRef(path, {});
        let pkg = $packages[ref.pkgName];
        if (pkg && pkg.f[ref.validPath]) {
            delete pkg.f[ref.validPath];
        }
    }

    public static main(name: string) {
        this.mainFile = name;
        return FuseBox.import(name, {});
    }

    public static expose(obj: any) {
        for (let k in obj) {
            let alias = obj[k].alias;
            let xp = $import(obj[k].pkg);
            if (alias === "*") {
                $loopObjKey(xp, (exportKey, value) => __root__[exportKey] = value);
            } else if (typeof alias === "object") {
                $loopObjKey(alias, (exportKey, value) => __root__[value] = xp[exportKey]);
            } else {
                __root__[alias] = xp;
            }
        }
    }

    /**
     * Registers a dynamic path
     *
     * @param str a function that is invoked with
     *  - `true, exports,require,module,__filename,__dirname,__root__`
     */
    public static dynamic(path: string, str: string, opts?: {
        /** The name of the package */
        pkg: string
    }) {
        this.pkg(opts && opts.pkg || "default", {}, function (___scope___: any) {
            ___scope___.file(path, function (exports: any, require: any, module: any, __filename: string, __dirname: string) {
                var res = new Function("__fbx__dnm__", "exports", "require", "module", "__filename", "__dirname", "__root__", str);
                res(true, exports, require, module, __filename, __dirname, __root__);
            });
        });
    }

    /**
     * Flushes the cache for the default package
     * @param shouldFlush you get to chose if a particular file should be flushed from cache
     */
    public static flush(
        shouldFlush?: (fileName: string) => boolean
    ) {
        let def = $packages["default"];
        for (let fileName in def.f) {
            if (!shouldFlush || shouldFlush(fileName)) {
                delete def.f[fileName].locals;
            }
        }
    }

    /**
     *
     * Register a package
     */
    public static pkg(name: string, v: PackageVersions, fn: Function) {
        // Let's not register a package scope twice
        if ($packages[name]) return fn($packages[name].s);

        // create new package
        let pkg = $packages[name] = {} as PackageDetails;

        // file
        pkg.f = {};

        // storing v
        pkg.v = v;

        // scope
        pkg.s = {
            // Scope file
            file: (name: string, fn: any) => pkg.f[name] = { fn },
        };
        return fn(pkg.s);
    }
    public static target: string;
    /**
     * Loader plugins
     */
    public static plugins: LoaderPlugin[] = [];

    /** Adds a Loader plugin */
    public static addPlugin(plugin: LoaderPlugin) {
        this.plugins.push(plugin);
    }
}

if (!$isBrowser) {
    g["FuseBox"] = FuseBox;
}

/**
 * Injected into the global namespace by the fsbx-default-css-plugin
 * Generates a tag with an `id` based on `__filename`
 * If you call it it again with the same file name the same tag is patched
 * @param __filename the name of the source file
 * @param contents if provided creates a style tag
 *  otherwise __filename is added as a link tag
 **/
declare var __fsbx_css: { (__filename: string, contents?: string): void };