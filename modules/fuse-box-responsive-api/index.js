(function() {

    /* @if universal */
    var isBrowser = typeof window !== "undefined";
    var storage = isBrowser ? window : global;
    if (storage.$fsx) {
        return
    };
    var $fsx = storage.$fsx = {}

    /* @end */

    /* @if browser */
    if (window.$fsx) {
        return;
    };
    var $fsx = window.$fsx = {}

    /* @end */

    /* @if server */
    var $fsx = global.$fsx = {}
    if ($fsx.r) {
        return;
    };
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


    /** ******************** LAZY LOADING ********************  */
    /* @if ajaxRequired */
    function aj(url, cb) {
        var f = window.fetch;
        if (f) return f(url).then(function(res) { return res.text().then(function(data) { cb(null, data) }) }).catch(cb)

        var request = new XMLHttpRequest();
        request.onreadystatechange = function() {
            if (this.readyState == 4) {
                cb(this.status == 200 ? 0 : 1, this.responseText);
            }
        };
        request.open("GET", url, true);
        request.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        request.send();
        cb(null, require(url));
    }
    /* @end */


    /* @if lazyLoading  */
    function req(url, cb) {
        /* @if browser */
        aj(url, cb);
        /* @end */

        /* @if universal */
        isBrowser ? aj(url, cb) : cb(null, require(url));
        /* @end */

        /* @if server */
        cb(null, require(url));
        /* @end */
    }

    /* @if codeSplitting */
    var bMapping = $bundleMapping$;
    /* @end */

    function evaluateModule(id, code) {
        var fn = new Function('module', 'exports', code);
        var moduleExports = {};
        var moduleObject = { exports: moduleExports };
        fn(moduleObject, moduleExports);
        return moduleObject.exports;
    }

    /* @if cssLoader */
    // CSS LOADER ******************************************

    /* @if !server */
    function loadCSS(id) {
        return Promise.resolve().then(function() {
            let d = document;
            var head = d.getElementsByTagName("head")[0];
            var target = d.createElement("link");
            target.rel = "stylesheet";
            target.type = "text/css";
            target.href = id;
            head.insertBefore(target, head.firstChild);
        });
    }
    /* @end */
    $fsx.a = function(id) {
        /* @if universal */
        if (isBrowser) { return loadCSS(id); }
        /* @end */

        /* @if browser */
        return loadCSS(id);
        /* @end */

        /* @if server */
        return Promise.reject("Can't load css on server!");
        /* @end */
    }

    // ******************************************************
    /* @end */


    $fsx.l = function(id) {
        return new Promise(function(resolve, reject) {
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

                    resolve($fsx.r(data[1]));

                });
            } else {
                /* @end */
                req(id, function(err, result) {
                    if (!err) {
                        /* @if browser */
                        resolve(evaluateModule(id, result));
                        /* @end */

                        /* @if server */
                        resolve(result);
                        /* @end */

                        /* @if universal */
                        isBrowser ? resolve(evaluateModule(id, result)) : resolve(result);
                        /* @end */
                    }
                });
                /* @if codeSplitting */
            }
            /* @end */
        });
    }

    /* @end */
    /** ********************************************  */



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
})();