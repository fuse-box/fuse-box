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
        if (FuseBox.isSever) {
            cb(null, require(url));
        } else {
            var request = new XMLHttpRequest();
            request.onreadystatechange = function() {
                if (this.readyState == 4) {
                    cb(this.status == 200 ? 0 : 1, this.responseText, request.getResponseHeader("Content-Type"));
                }
            };
            request.open("GET", url, true);
            request.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
            request.send();
        }
    }

    return function(id) {
        if (/^http/.test(id)) {
            return Promise.resolve(loadRemoteScript(id));
        }
        request(id, function(error, contents, type) {
            console.log(contents, type);
        });

        return new Promise((resolve, reject) => {
            console.log(id);
        });
    };
})();