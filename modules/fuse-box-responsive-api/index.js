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
        let parts = [];
        for (let i = 0, l = arguments.length; i < l; i++) {
            parts = parts.concat(arguments[i].split("/"));
        };
        let newParts = [];
        for (let i = 0, l = parts.length; i < l; i++) {
            let part = parts[i];
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

})()