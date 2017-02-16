(function(__root__){ var $isBrowser = typeof window !== "undefined" && window.navigator;
if ($isBrowser) {
    window["global"] = window;
}
__root__ = !$isBrowser || typeof __fbx__dnm__ !== "undefined" ? module.exports : __root__;
var $fsbx = $isBrowser ? (window["__fsbx__"] = window["__fsbx__"] || {})
    : global["$fsbx"] = global["$fsbx"] || {};
if (!$isBrowser) {
    global["require"] = require;
}
var $packages = $fsbx.p = $fsbx.p || {};
var $events = $fsbx.e = $fsbx.e || {};
var $getNodeModuleName = function (name) {
    var n = name.charCodeAt(0);
    if (n >= 97 && n <= 122 || n === 64) {
        if (n === 64) {
            var s = name.split("/");
            var target = s.splice(2, s.length).join("/");
            return [s[0] + "/" + s[1], target || undefined];
        }
        var index = name.indexOf("/");
        if (index === -1) {
            return [name];
        }
        var first = name.substring(0, index);
        var second = name.substring(index + 1);
        return [first, second];
    }
};
var $getDir = function (filePath) {
    return filePath.substring(0, filePath.lastIndexOf('/')) || "./";
};
var $pathJoin = function () {
    var string = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        string[_i] = arguments[_i];
    }
    var parts = [];
    for (var i = 0, l = arguments.length; i < l; i++) {
        parts = parts.concat(arguments[i].split("/"));
    }
    var newParts = [];
    for (var i = 0, l = parts.length; i < l; i++) {
        var part = parts[i];
        if (!part || part === ".") {
            continue;
        }
        if (part === "..") {
            newParts.pop();
        }
        else {
            newParts.push(part);
        }
    }
    if (parts[0] === "") {
        newParts.unshift("");
    }
    return newParts.join("/") || (newParts.length ? "/" : ".");
};
var $ensureExtension = function (name) {
    var matched = name.match(/\.(\w{1,})$/);
    if (matched) {
        var ext = matched[1];
        if (!ext) {
            return name + ".js";
        }
        return name;
    }
    return name + ".js";
};
var $loadURL = function (url) {
    if ($isBrowser) {
        var d = document;
        var head = d.getElementsByTagName('head')[0];
        var target;
        if (/\.css$/.test(url)) {
            target = d.createElement('link');
            target.rel = 'stylesheet';
            target.type = 'text/css';
            target.href = url;
        }
        else {
            target = d.createElement('script');
            target.type = 'text/javascript';
            target.src = url;
            target.async = true;
        }
        head.insertBefore(target, head.firstChild);
    }
};
var $getRef = function (name, opts) {
    var basePath = opts.path || "./";
    var pkg_name = opts.pkg || "default";
    var nodeModule = $getNodeModuleName(name);
    if (nodeModule) {
        basePath = "./";
        pkg_name = nodeModule[0];
        if (opts.v && opts.v[pkg_name]) {
            pkg_name = pkg_name + "@" + opts.v[pkg_name];
        }
        name = nodeModule[1];
    }
    if (name && name.charCodeAt(0) === 126) {
        name = name.slice(2, name.length);
        basePath = "./";
    }
    var pkg = $packages[pkg_name];
    if (!pkg) {
        if ($isBrowser) {
            throw "Package was not found \"" + pkg_name + "\"";
        }
        else {
            return {
                serverReference: require(pkg_name)
            };
        }
    }
    if (!name) {
        name = "./" + pkg.s.entry;
    }
    var filePath = $pathJoin(basePath, name);
    var validPath = $ensureExtension(filePath);
    var file = pkg.f[validPath];
    var wildcard;
    if (!file && validPath.indexOf("*") > -1) {
        wildcard = validPath;
    }
    if (!file && !wildcard) {
        validPath = $pathJoin(filePath, "/", "index.js");
        file = pkg.f[validPath];
        if (!file) {
            validPath = filePath + ".js";
            file = pkg.f[validPath];
        }
        if (!file) {
            file = pkg.f[filePath + ".jsx"];
        }
    }
    return {
        file: file,
        wildcard: wildcard,
        pkgName: pkg_name,
        versions: pkg.v,
        filePath: filePath,
        validPath: validPath
    };
};
var $async = function (file, cb) {
    if ($isBrowser) {
        var xmlhttp;
        xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState == 4) {
                if (xmlhttp.status == 200) {
                    var contentType = xmlhttp.getResponseHeader("Content-Type");
                    var content = xmlhttp.responseText;
                    if (/json/.test(contentType)) {
                        content = "module.exports = " + content;
                    }
                    else {
                        if (!/javascript/.test(contentType)) {
                            content = "module.exports = " + JSON.stringify(content);
                        }
                    }
                    var normalized = $pathJoin("./", file);
                    FuseBox.dynamic(normalized, content);
                    cb(FuseBox.import(file, {}));
                }
                else {
                    console.error(file + " was not found upon request");
                    cb(undefined);
                }
            }
        };
        xmlhttp.open("GET", file, true);
        xmlhttp.send();
    }
    else {
        if (/\.(js|json)$/.test(file)) {
            return cb(global["require"](file));
        }
        return cb("");
    }
};
var $trigger = function (name, args) {
    var e = $events[name];
    if (e) {
        for (var i in e) {
            var res = e[i].apply(null, args);
            if (res === false) {
                return false;
            }
        }
        ;
    }
};
var $import = function (name, opts) {
    if (opts === void 0) { opts = {}; }
    if (name.charCodeAt(4) === 58 || name.charCodeAt(5) === 58) {
        return $loadURL(name);
    }
    var ref = $getRef(name, opts);
    if (ref.serverReference) {
        return ref.serverReference;
    }
    var file = ref.file;
    if (ref.wildcard) {
        var safeRegEx = new RegExp(ref.wildcard
            .replace(/\*/g, "@")
            .replace(/[.?*+^$[\]\\(){}|-]/g, "\\$&")
            .replace(/@/g, "[a-z0-9$_-]+"), "i");
        var pkg = $packages[ref.pkgName];
        if (pkg) {
            var batch = {};
            for (var n in pkg.f) {
                if (safeRegEx.test(n)) {
                    batch[n] = $import(ref.pkgName + "/" + n);
                }
            }
            return batch;
        }
    }
    if (!file) {
        var asyncMode_1 = typeof opts === "function";
        var processStopped = $trigger("async", [name, opts]);
        if (processStopped === false) {
            return;
        }
        return $async(name, function (result) {
            if (asyncMode_1) {
                return opts(result);
            }
        });
    }
    var validPath = ref.validPath;
    var pkgName = ref.pkgName;
    if (file.locals && file.locals.module) {
        return file.locals.module.exports;
    }
    var locals = file.locals = {};
    var fuseBoxDirname = $getDir(validPath);
    locals.exports = {};
    locals.module = { exports: locals.exports };
    locals.require = function (name, optionalCallback) {
        return $import(name, {
            pkg: pkgName,
            path: fuseBoxDirname,
            v: ref.versions
        });
    };
    locals.require.main = {
        filename: $isBrowser ? "./" : global["require"].main.filename,
        paths: $isBrowser ? [] : global["require"].main.paths
    };
    var args = [locals.module.exports, locals.require, locals.module, validPath, fuseBoxDirname, pkgName];
    $trigger("before-import", args);
    var fn = file.fn;
    fn.apply(0, args);
    $trigger("after-import", args);
    return locals.module.exports;
};
var FuseBox = (function () {
    function FuseBox() {
    }
    FuseBox.global = function (key, obj) {
        var target = $isBrowser ? window : global;
        if (obj === undefined) {
            return target[key];
        }
        target[key] = obj;
    };
    FuseBox.import = function (name, opts) {
        return $import(name, opts);
    };
    FuseBox.on = function (name, fn) {
        $events[name] = $events[name] || [];
        $events[name].push(fn);
    };
    FuseBox.exists = function (path) {
        try {
            var ref = $getRef(path, {});
            return ref.file !== undefined;
        }
        catch (err) {
            return false;
        }
    };
    FuseBox.remove = function (path) {
        var ref = $getRef(path, {});
        var pkg = $packages[ref.pkgName];
        if (pkg && pkg.f[ref.validPath]) {
            delete pkg.f[ref.validPath];
        }
    };
    FuseBox.main = function (name) {
        this.mainFile = name;
        return FuseBox.import(name, {});
    };
    FuseBox.expose = function (obj) {
        for (var key in obj) {
            var data = obj[key];
            var exposed = $import(data.pkg);
            __root__[data.alias] = exposed;
        }
    };
    FuseBox.dynamic = function (path, str, opts) {
        var pkg = opts && opts.pkg || "default";
        this.pkg(pkg, {}, function (___scope___) {
            ___scope___.file(path, function (exports, require, module, __filename, __dirname) {
                var res = new Function('__fbx__dnm__', 'exports', 'require', 'module', '__filename', '__dirname', '__root__', str);
                res(true, exports, require, module, __filename, __dirname, __root__);
            });
        });
    };
    FuseBox.flush = function (shouldFlush) {
        var def = $packages["default"];
        for (var fileName in def.f) {
            var doFlush = !shouldFlush || shouldFlush(fileName);
            if (doFlush) {
                var file = def.f[fileName];
                delete file.locals;
            }
        }
    };
    FuseBox.pkg = function (pkg_name, versions, fn) {
        if ($packages[pkg_name]) {
            return fn($packages[pkg_name].s);
        }
        var pkg = $packages[pkg_name] = {};
        var _files = pkg.f = {};
        pkg.v = versions;
        var _scope = pkg.s = {
            file: function (name, fn) {
                _files[name] = { fn: fn };
            },
        };
        return fn(_scope);
    };
    FuseBox.addPlugin = function (plugin) {
        this.plugins.push(plugin);
    };
    return FuseBox;
}());
FuseBox.packages = $packages;
FuseBox.isBrowser = $isBrowser !== undefined;
FuseBox.isServer = !$isBrowser;
FuseBox.plugins = [];
 
return __root__["FuseBox"] = FuseBox; } )(this)