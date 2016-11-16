var __root__ = this;
var FuseBox = __root__.FuseBox = (function() {
    var isBrowser = typeof window !== "undefined";
    var modules = isBrowser ? (window.__npm__ = window.__npm__ || {}) : {};
    var $interceptors = isBrowser ? (window.__interceptors__ = window.__interceptors__ || {}) : {};
    var getNodeModuleName = function(name) {
        if (!name) { return; }
        var matched = name.match(/^([a-z].*)$/);
        if (matched) {
            return name.split(/\/(.+)?/);
        }
    }

    function getFileDirectory(filePath) {
        return filePath.substring(0, filePath.lastIndexOf('/'));
    }
    var pathJoin = function() {
        var parts = [];
        for (var i = 0, l = arguments.length; i < l; i++) {
            parts = parts.concat(arguments[i].split("/"));
        }
        var newParts = [];
        for (i = 0, l = parts.length; i < l; i++) {
            var part = parts[i];
            if (!part || part === ".") {
                continue
            }
            if (part === "..") {
                newParts.pop();
            } else {
                newParts.push(part);
            }
        }
        if (parts[0] === "") {
            newParts.unshift("")
        }
        return newParts.join("/") || (newParts.length ? "/" : ".");
    }
    var ensureExtension = function(name) {
        var matched = name.match(/\.(\w{1,})$/);
        if (matched) {
            var ext = matched[1];
            if (!ext) {
                return name + ".js";
            }
            return name;
        }
        return name + ".js";
    }

    return {
        evaluate: function(moduleName, customPath, parent) {
            if (modules[moduleName]) {
                var mod = modules[moduleName];
                if (mod.cache) {
                    return mod.cache;
                }
                mod.cache = mod.scope.evaluate(customPath, null, parent);
                return mod.cache;
            }
        },
        dynamic: function(userPath, str) {
            this.module("default", {}, function(___scope___) {
                ___scope___.file(userPath, function(exports, require, module, __filename, __dirname) {
                    var res = new Function('exports', 'require', 'module', '__filename', '__dirname', str);
                    res(exports, require, module, __filename, __dirname);
                });
            });
        },
        exists: function(moduleName, name) {
            if (!modules[moduleName]) return;
            return modules[moduleName].files[name] !== undefined;
        },
        intercept: function(name, mask, fn) {
            $interceptors[name] = $interceptors[name] || [];
            $interceptors[name].push({ mask: mask, fn: fn });
        },
        import: function(userPath, packageName, parent) {
            packageName = packageName || "default";
            if (modules[packageName]) {
                var mod = modules[packageName];
                return mod.scope.evaluate(userPath, null, parent);
            }
        },
        module: function(moduleName, customVersions, fn) {
            if (modules[moduleName]) {
                return fn(modules[moduleName].scope)
            }
            var collection = modules[moduleName] = {};
            collection.files = {};
            collection.scope = {
                file: function(name, fn) {
                    collection.files[name] = {
                        name: name,
                        fn: fn
                    }
                },
                evaluate: function(_target, base, parent) {

                    var entryName = _target ? pathJoin(base || "/", _target) : collection.entry;
                    if (!entryName) {
                        return;
                    }
                    if (entryName[0] === "/") { entryName = entryName.slice(1, entryName.length) }
                    if (entryName === ".") { entryName = collection.entry; }
                    var entry = collection.files[ensureExtension(entryName)];
                    if (!entry) {
                        var slash = !entryName.match(/\/$/) ? "/" : "";
                        entry = collection.files[entryName + slash + "index.js"]
                    }

                    if (!entry) {
                        var msg = ["File " + entryName + " was not found upon request"];

                        msg.push("Module: '" + moduleName + "'");
                        msg.push("File: '" + parent + "'");
                        msg.push("Base: '" + (base || "./") + "'");
                        msg.push("File map:");
                        msg.push("\t" + Object.keys(collection.files).join("\n\t"));

                        throw msg.join("\n");
                    }
                    if (entry.isLoading) {
                        return entry.locals.module.exports;
                    }
                    if (entry.cache) {
                        return entry.cache;
                    }
                    var self = this;
                    var locals = entry.locals = {};
                    entry.isLoading = true;
                    locals.exports = {};
                    locals.require = function(target) {
                        var _module = getNodeModuleName(target);
                        if (_module) {
                            var _moduleName = _module[0];
                            if (customVersions[_moduleName]) {
                                _moduleName = _moduleName + "@" + customVersions[_moduleName];
                            }
                            if (_module[1]) {
                                return FuseBox.import(_module[1], _moduleName, entryName);
                            }
                            return FuseBox.evaluate(_moduleName, null, entryName);
                        } else {
                            if (target[0] === "~") {
                                return self.evaluate(target.slice(2, target.length));
                            }
                            var baseDir = getFileDirectory(entryName);
                            return self.evaluate(target, baseDir, entryName);
                        }
                    }
                    locals.module = { exports: locals.exports };
                    var __filename = "./" + entry.name;
                    var __dirname = __filename.substring(0, __filename.lastIndexOf("/") + 1);
                    var args = [locals.exports, locals.require, locals.module, __filename, __dirname];
                    entry.fn.apply(this, args);
                    var res = locals.module.exports;
                    // Call require interceptors 
                    if ($interceptors[moduleName]) {
                        for (var i = 0; i < $interceptors[moduleName].length; i++) {
                            var item = $interceptors[moduleName][i];
                            if (item.mask.test(__filename)) { item.fn.apply(undefined, args); }
                        }
                    }
                    entry.cache = res;
                    entry.isLoading = false;
                    return res;
                },
                entry: function(name) {
                    collection.entry = name;
                }
            };
            fn(collection.scope);
        }
    }
})();