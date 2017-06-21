var $fsmp$ = (function() {

    function loadRemoteScript(url) {
        return Promise.resolve().then(function() {
            if (FuseBox.isBrowser) {
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
        });
    }

    function request(url, cb) {
        if (FuseBox.isServer) {
            try {
                if (/\.(js|json)$/.test(url)) {
                    cb(null, require(url))
                } else {
                    cb(null, require("fs")
                        .readFileSync(require("path")
                            .join(__dirname, url)).toString());
                }

            } catch (e) { cb(e) }
        } else {
            var request = new XMLHttpRequest();
            request.onreadystatechange = function() {
                var err;
                if (this.readyState == 4) {
                    if (this.status !== 200) {
                        err = { code: this.status, msg: this.statusText }
                    }
                    this.status

                    cb(err, this.responseText, request.getResponseHeader("Content-Type"));
                }
            };
            request.open("GET", url, true);
            request.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
            request.send();
        }
    }

    function evaluateModule(id, code) {
        var fn = new Function('module', 'exports', code);
        var moduleExports = {};
        var moduleObject = { exports: moduleExports };
        fn(moduleObject, moduleExports);
        return moduleObject.exports;
    }

    return function(id) {

        return new Promise((resolve, reject) => {
            if (FuseBox.exists(id)) {
                return resolve(FuseBox.import(id));
            }

            var isCSS = /\.css$/.test(id);
            if (FuseBox.isServer) {
                if (isCSS) {
                    return reject("Can't load CSS on server!");
                }
            }
            // id.charCodeAt(4) = : which means http
            if (FuseBox.isBrowser) {
                if ((name.charCodeAt(4) === 58 || name.charCodeAt(5) === 58) || isCSS) {
                    return loadRemoteScript(id);
                }
            }
            var splitConfig = FuseBox.global("__fsbx__bundles__");

            if (splitConfig && splitConfig.bundles) {
                if (splitConfig.bundles[id]) {
                    return resolve(FuseBox.import("~/" + splitConfig.bundles[id].main))
                }
            }

            request(id, function(error, contents, type) {
                if (error) {
                    return reject(error);
                }
                var data;

                if (type && FuseBox.isBrowser) {
                    if (/javascript/.test(type)) {
                        data = evaluateModule(id, contents);
                    } else if (/json/.test(type)) {
                        data = JSON.parse(contents);
                    } else if (!/javascript/.test(type)) {
                        data = contents;
                    } else {
                        data = contents;
                    }
                } else {
                    data = contents;
                }

                return resolve(data);
            });
        });
    };
})();
if (FuseBox.isBrowser) {
    window.$fsmp$ = $fsmp$;
}