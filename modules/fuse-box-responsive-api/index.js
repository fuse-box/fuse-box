/* @if !isContained */
(function() {
    /* @end */


    /* @if promisePolyfill */
    $promisePolyfill$
    /* @end */

    /* @if universal */
    var isBrowser = typeof window !== "undefined";
    if (!isBrowser) {
        global.require = require;
    }

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
    global.require = require;
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


    /* @if isServerFunction */
    $fsx.cs = !isBrowser

    /* @end */

    /* @if isBrowserFunction */
    $fsx.cb = isBrowser
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

    /* @if serverRequire */
    $fsx.s = function(id) {
        var result = $fsx.r(id);
        if (result === undefined) {
            /* @if server */
            return require(id);
            /* @end */

            /* @if universal */
            if (!isBrowser) {
                return require(id);
            }
            /* @end */
        }
    }

    /* @end */

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