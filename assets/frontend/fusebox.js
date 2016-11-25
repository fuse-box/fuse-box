(function(__root__){ var $isBrowser = typeof window !== "undefined";
var $fsbx = $isBrowser ? (window["__fsbx__"] = window["__fsbx__"] || {})
    : global["$fsbx"] = global["$fsbx"] || {};
var $packages = $fsbx.p = $fsbx.p || {};
var $getNodeModuleName = function (name) {
    return name ? /^([a-z].*)$/.test(name) ? name.split(/\/(.+)?/) : false : false;
};
var $pathJoin = function () {
    var string = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        string[_i - 0] = arguments[_i];
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
var FuseBox = (function () {
    function FuseBox() {
    }
    FuseBox.import = function (name) {
        return $getNodeModuleName(name);
    };
    FuseBox.pkg = function (name, versions, fn) {
        if ($packages[name]) {
            return fn($packages[name]);
        }
        var pkg = $packages[name] = {};
        var _files = pkg.f = {};
        var _scope = pkg.s = {
            file: function (name, fn) { _files[name] = fn; },
            import: function (path) {
                return $pathJoin("a", "n");
            }
        };
        return pkg;
    };
    return FuseBox;
}());
 
__root__["FuseBox"] = FuseBox } )(this)