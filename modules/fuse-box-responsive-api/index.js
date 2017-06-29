/* @if !isContained */
(function() {
    /* @end */


    /* @if promisePolyfill */
    $promisePolyfill$
    /* @end */

    /* @if universal */
    var isBrowser = typeof window !== "undefined";

    /* @if !isContained */
    var storage = isBrowser ? window : global;
    if (storage.$fsx) {
        return
    };
    /* @end */

    /* @if isContained */
    var storage = {}

    /* @end */


    var $fsx = storage.$fsx = {}

    /* @end */

    /* @if browser */
    /* @if !isContained */
    if (window.$fsx) {
        return;
    };
    var $fsx = window.$fsx = {}
        /* @end */

    /* @if isContained */
    var $fsx = {};
    /* @end */

    /* @end */



    /* @if server */
    /* @if !isContained */
    var $fsx = global.$fsx = {}
    if ($fsx.r) {
        return;
    };
    /* @end */
    /* @if isContained */
    var $fsx = {};
    /* @end */
    /* @end */

    /* @if hashes */
    function fastHash(text) {
        var hash = 0;
        if (text.length == 0) return hash;
        for (var i = 0; i < text.length; i++) {
            var char = text.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        };
        return hash.toString(16);
    }
    /* @end */


    /* @if isServerFunction */
    $fsx.cs = !isBrowser

    /* @end */

    /* @if isBrowserFunction */
    $fsx.cb = isBrowser

    /* @end */


    /* @if computedStatements */

    // define a collection of file names based on id
    // so here $fsx.s["f9ee3k"] = "foo/bar.js"
    $fsx.s = {};

    function $join() {
        var parts = [];
        for (var i = 0, l = arguments.length; i < l; i++) {
            parts = parts.concat(arguments[i].split("/"));
        };
        var newParts = [];
        for (var i = 0, l = parts.length; i < l; i++) {
            var part = parts[i];
            if (!part || part === ".") continue;
            if (part === "..") {
                newParts.pop();
            } else {
                newParts.push(part);
            }
        };
        if (parts[0] === "") newParts.unshift("");
        return newParts.join("/") || (newParts.length ? "/" : ".");
    };


    function findModule(id, path) {
        if (!$fsx.s[id]) {
            return;
        };
        var target = $join($fsx.s[id][1], path);
        var pkg = $fsx.s[id][0];
        var targetStr = pkg + "/" + target;
        var combo = [targetStr]
        if (!/\.js$/.test(target)) {
            combo.push(targetStr + ".js", targetStr + "/index.js")
        };
        var dest;
        var index = 0;
        while (!dest && index < combo.length) {
            var hash = fastHash(combo[index]);
            if ($fsx.f[hash]) {
                dest = hash;
            }
            index++;
        };
        if (dest) {
            return $fsx.r(dest);
        };
        return dest;
    }


    $fsx.c = function(path) {
        // getting the base
        return findModule(this.id, path);
    }

    /* @end */
    $fsx.f = {}


    /* @if customStatementResolve  */
    $fsx.z = $customMappings$;
    $fsx.p = function(id) {
        var id;
        if ((id = $fsx.z[id])) {
            return $fsx.r(id)
        }
    }

    /* @end */

    /* @if ajaxRequired */
    var ajaxCache = {};

    function aj(url, cb) {
        var request = new XMLHttpRequest();
        request.onreadystatechange = function() {
            if (this.readyState == 4) {
                var err;
                if (this.status !== 200) {
                    err = { code: this.status, msg: this.statusText }
                }
                cb(err, this.responseText, request.getResponseHeader("Content-Type"));
            }
        };
        request.open("GET", url, true);
        request.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        request.send();
    }
    /* @end */

    /* @if loadRemoteScript  */
    function loadRemoteScript(url, isCSS) {
        /* @if server */
        return Promise.resolve();
        /* @end */

        /* @if browser || universal */
        return Promise.resolve().then(function() {
            /* @if universal */
            if (!isBrowser) { return }
            /* @end */

            var d = document;
            var head = d.getElementsByTagName("head")[0];
            var target;
            /* @if cssLoader */
            if (isCSS) {
                target = d.createElement("link");
                target.rel = "stylesheet";
                target.type = "text/css";
                target.href = url;
            } else {
                /* @end */

                target = d.createElement("script");
                target.type = "text/javascript";
                target.src = url;
                target.async = true;

                /* @if cssLoader */
            }
            /* @end */
            head.insertBefore(target, head.firstChild);
        });
        /* @end */
    }
    /* @end */



    /* @if codeSplitting */
    var bMapping = $bundleMapping$;
    /* @end */


    /* @if lazyLoading */



    function evaluateModule(id, input, type) {
        if (/javascript/.test(type)) {
            var fn = new Function('module', 'exports', input);
            var moduleExports = {};
            var moduleObject = { exports: moduleExports };
            fn(moduleObject, moduleExports);
            return moduleObject.exports;
        }
        /* @if jsonLoader  */
        if (/json/.test(type)) {
            return JSON.parse(input);
        }
        /* @end */

        return input;
    }


    function req(url, cb) {
        /* @if browser */
        aj(url, cb);
        /* @end */

        /* @if universal */
        if (isBrowser) aj(url, cb)
        else try {
            /* @if extendServerImport */
            if (/\.(js|json)$/.test(url)) {
                cb(null, require(url))
            } else {
                cb(null, require("fs")
                    .readFile(require("path")
                        .join(__dirname, url)),
                    function(err, result) {
                        if (err) { reject(err) } else { resolve(result.toString()) }
                    });
            }

            /* @end */

            /* @if !extendServerImport */
            cb(null, require(url))

            /* @end */

        } catch (e) { cb(e) }

        /* @end */

        /* @if server */
        try {
            /* @if extendServerImport  */
            if (/\.(js|json)$/.test(url)) {
                cb(null, require(url))
            } else {
                cb(null, require("fs")
                    .readFileSync(require("path")
                        .join(__dirname, url)).toString());
            }
            /* @end */

            /* @if !extendServerImport  */
            cb(null, require(url))
                /* @end */

        } catch (e) { cb(e) }

        /* @end */
    }
    var $cache = {}
    $fsx.l = function(id) {
        return new Promise(function(resolve, reject) {
            if ($cache[id]) { return resolve($cache[id]) }
            /* @if codeSplitting */
            if (bMapping.i && bMapping.i[id]) {
                var data = bMapping.i[id];
                req(bMapping.c.b + data[0], function(err, result) {

                    /* @if browser */
                    if (!err) { new Function(result)(); }
                    /* @end */

                    /* @if universal */
                    if (!err && isBrowser) { new Function(result)(); }
                    /* @end */

                    $cache[id] = $fsx.r(data[1]);
                    !err ? resolve($cache[id]) : reject(err);
                });
            } else {
                /* @end */

                /* @if loadRemoteScript */
                var isCSS;

                /* @if cssLoader */
                isCSS = /\.css$/.test(id);
                /* @end */

                if ((id.charCodeAt(4) === 58 || id.charCodeAt(5) === 58) || isCSS) {
                    return loadRemoteScript(id, isCSS);
                }
                /* @end */
                req(id, function(err, result, ctype) {
                    if (!err) {
                        /* @if browser */
                        resolve($cache[id] = evaluateModule(id, result, ctype));
                        /* @end */

                        /* @if server */
                        resolve(result);
                        /* @end */

                        /* @if universal */
                        isBrowser ? resolve($cache[id] = evaluateModule(id, result, ctype)) : resolve(result);
                        /* @end */
                    } else {
                        reject(err);
                    }
                });
                /* @if codeSplitting */
            }
            /* @end */
        });
    }

    /* @end */




    // cached modules
    $fsx.m = {};
    $fsx.r = function(id) {
        var cached = $fsx.m[id];

        // resolve if in cache
        if (cached) {
            return cached.m.exports;
        }
        var file = $fsx.f[id];
        if (!file)
            return;

        cached = $fsx.m[id] = {};
        cached.exports = {};
        cached.m = { exports: cached.exports };
        file(cached.m, cached.exports);
        return cached.m.exports;
    };

    /* @if !isContained */
})();
/* @end */