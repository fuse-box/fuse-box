/* @if !isContained */
(function() {
    /* @end */


    /* @if promisePolyfill */
    $promisePolyfill$
    /* @end */

    /* @if allowSyntheticDefaultImports */
    function syntheticDefaultExportPolyfill(input){
        return input !== null && ['function', 'object', 'array']
            .indexOf(typeof input) > -1 && input.default === undefined ?
                 Object.isFrozen(input) ? input.default = input : Object.defineProperty(input, "default", {value : input, writable : true, enumerable : false}) : void 0;
    }
    /* @end */

    /* @if universal */

    var isBrowser = typeof window !== "undefined";
    /* @if globalRequire */
    if (!isBrowser) {
        global.require = require;
    }
    /* @end */

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
    /* @if globalRequire */
    if (typeof global === "object") {
        global.require = require;
    }
    /* @end */
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

    /* @if extendServerImport */
    function extendServerImport(url, cb) {
        if (/^http(s)?\:/.test(url)) {
            return require("request")(url, function(error, response, body) {
                if (error) { return cb(error); }
                return cb(null, evaluateModule(url, body, response.headers['content-type']));
            });
        }
        if (/\.(js|json)$/.test(url)) {
            return cb(null, require(url))
        } else {
            return require("fs").readFile(require("path").join(__dirname, url), function(err, result) {
                if (err) { cb(err) } else {
                    cb(null, result.toString())
                }
            })
        }
    }
    /* @end */

    function req(url, cb) {
        /* @if browser */
        aj(url, cb);
        /* @end */

        /* @if universal */
        if (isBrowser) aj(url, cb)
        else try {
            /* @if extendServerImport */
            if (extendServerImport(url, cb)) {
                return;
            }
            /* @end */

            /* @if !extendServerImport */
            cb(null, require(url))

            /* @end */

        } catch (e) { cb(e) }

        /* @end */

        /* @if server */
        try {
            /* @if extendServerImport */
            if (extendServerImport(url, cb)) {
                return;
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
                /* @if universal */
                var path = isBrowser ? bMapping.c.b : bMapping.c.s;
                /* @end */
                /* @if server */
                var path = bMapping.c.s;
                /* @end */
                
                /* @if browser */
                var path = bMapping.c.b;
                /* @end */
                req(path + data[0], function(err, result) {

                    /* @if browser */
                    if (!err) { new Function(result)(); }
                    /* @end */

                    /* @if universal */
                    if (!err && isBrowser) { new Function(result)(); }
                    /* @end */

                    $cache[id] = $fsx.r(data[1]);
                    /* @if allowSyntheticDefaultImports */
                    syntheticDefaultExportPolyfill($cache[id]);
                    /* @end */
                    !err ? resolve($cache[id]) : reject(err);
                });
            } else {
                /* @end */

                /* @if loadRemoteScript */
                var isCSS;

                /* @if cssLoader */
                isCSS = /\.css$/.test(id);
                /* @end */
                // id.charCodeAt(4) === 58 || id.charCodeAt(5) === 58)
                if (isCSS) {
                    return loadRemoteScript(id, isCSS);
                }
                /* @end */
                req(id, function(err, result, ctype) {
                    if (!err) {
                        /* @if browser */
                        var res = $cache[id] = evaluateModule(id, result, ctype)
                        /* @if allowSyntheticDefaultImports */
                        syntheticDefaultExportPolyfill(res);
                        /* @end */
                        resolve(res);
                        /* @end */

                        /* @if server */
                            /* @if allowSyntheticDefaultImports */
                            syntheticDefaultExportPolyfill(result);
                            /* @end */
                        resolve(result);
                        /* @end */

                        /* @if universal */
                        if( isBrowser){
                            var res = $cache[id] = evaluateModule(id, result, ctype);
                            /* @if allowSyntheticDefaultImports */
                            syntheticDefaultExportPolyfill(res);
                            /* @end */
                            resolve(res);
                        } else {
                             /* @if allowSyntheticDefaultImports */
                             syntheticDefaultExportPolyfill(result);
                             /* @end */
                             resolve(result);
                        }
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
            var result = require(id);
             /* @if allowSyntheticDefaultImports */
                syntheticDefaultExportPolyfill(result);
              /* @end */
            return result;
            /* @end */

            /* @if universal */
            if (!isBrowser) {
                var result = require(id);
                /* @if allowSyntheticDefaultImports */
                    syntheticDefaultExportPolyfill(result);
                /* @end */
                return result;
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
        file.call(cached.exports, cached.m, cached.exports);
        /* @if allowSyntheticDefaultImports */
        syntheticDefaultExportPolyfill(cached.m.exports);
        /* @end */
        return cached.m.exports;
    };

    /* @if !isContained */
})();
/* @end */