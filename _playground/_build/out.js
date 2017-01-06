// Hey this is my banner! Copyright 2016!
(function(FuseBox){
var __process_env__ = {"foo":"bar"};
var __fsbx_css = function(__filename, contents) {
    if (FuseBox.isServer) {
        return;
    }
    var styleId = __filename.replace(/[\.\/]+/g, "-");
    if (styleId.charAt(0) === '-') styleId = styleId.substring(1);
    var exists = document.getElementById(styleId);
    if (!exists) {
        //<link href="//fonts.googleapis.com/css?family=Covered+By+Your+Grace" rel="stylesheet" type="text/css">
        var s = document.createElement(contents ? "style" : "link");
        s.id = styleId;
        s.type = "text/css";
        if (contents) {
            s.innerHTML = contents;
        } else {
            s.rel = "stylesheet";
            s.href = __filename;
        }
        document.getElementsByTagName("head")[0].appendChild(s);
    }
}
FuseBox.on("async", function(name) {
    if (FuseBox.isServer) {
        return;
    }
    if (/\.css$/.test(name)) {
        __fsbx_css(name);
        return false;
    }
});
FuseBox.pkg("default", {}, function(___scope___){
___scope___.file("index.js", function(exports, require, module, __filename, __dirname){ 
var process = require("process");
"use strict";
console.log(process.env.foo);
var A = (function () {
    function A() {
    }
    return A;
}());
var B = (function (_super) {
    __extends(B, _super);
    function B() {
        return _super.call(this) || this;
    }
    return B;
}(A));

});
});
FuseBox.pkg("process", {}, function(___scope___){
___scope___.file("index.js", function(exports, require, module, __filename, __dirname){ 

// From https://github.com/defunctzombie/node-process/blob/master/browser.js
// shim for using process in browser
if (FuseBox.isServer) {
    if (typeof __process_env__ !== "undefined") {
        Object.assign(global.process.env, __process_env__);
    }
    module.exports = global.process;
} else {
    var productionEnv = false; //require('@system-env').production;

    var process = module.exports = {};
    var queue = [];
    var draining = false;
    var currentQueue;
    var queueIndex = -1;

    function cleanUpNextTick() {
        draining = false;
        if (currentQueue.length) {
            queue = currentQueue.concat(queue);
        } else {
            queueIndex = -1;
        }
        if (queue.length) {
            drainQueue();
        }
    }

    function drainQueue() {
        if (draining) {
            return;
        }
        var timeout = setTimeout(cleanUpNextTick);
        draining = true;

        var len = queue.length;
        while (len) {
            currentQueue = queue;
            queue = [];
            while (++queueIndex < len) {
                if (currentQueue) {
                    currentQueue[queueIndex].run();
                }
            }
            queueIndex = -1;
            len = queue.length;
        }
        currentQueue = null;
        draining = false;
        clearTimeout(timeout);
    }

    process.nextTick = function(fun) {
        var args = new Array(arguments.length - 1);
        if (arguments.length > 1) {
            for (var i = 1; i < arguments.length; i++) {
                args[i - 1] = arguments[i];
            }
        }
        queue.push(new Item(fun, args));
        if (queue.length === 1 && !draining) {
            setTimeout(drainQueue, 0);
        }
    };

    // v8 likes predictible objects
    function Item(fun, array) {
        this.fun = fun;
        this.array = array;
    }
    Item.prototype.run = function() {
        this.fun.apply(null, this.array);
    };
    process.title = 'browser';
    process.browser = true;
    process.env = {
        NODE_ENV: productionEnv ? 'production' : 'development'
    };
    if (typeof __process_env__ !== "undefined") {
        Object.assign(process.env, __process_env__);
    }
    process.argv = [];
    process.version = ''; // empty string to avoid regexp issues
    process.versions = {};

    function noop() {}

    process.on = noop;
    process.addListener = noop;
    process.once = noop;
    process.off = noop;
    process.removeListener = noop;
    process.removeAllListeners = noop;
    process.emit = noop;

    process.binding = function(name) {
        throw new Error('process.binding is not supported');
    };

    process.cwd = function() { return '/' };
    process.chdir = function(dir) {
        throw new Error('process.chdir is not supported');
    };
    process.umask = function() { return 0; };

}
});
return ___scope___.entry = "index.js";
});
FuseBox.global("__extends", function(d, b) {
    for (var p in b)
        if (b.hasOwnProperty(p)) d[p] = b[p];

    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
});

FuseBox.import("default/index.js");
FuseBox.main("default/index.js");
})
(function(e){var r="undefined"!=typeof window&&window.navigator;r&&(window.global=window),e=r&&"undefined"==typeof __fbx__dnm__?e:module.exports;var t=r?window.__fsbx__=window.__fsbx__||{}:global.$fsbx=global.$fsbx||{};r||(global.require=require);var n=t.p=t.p||{},i=t.e=t.e||{},a=function(e){if(/^([@a-z].*)$/.test(e)){if("@"===e[0]){var r=e.split("/"),t=r.splice(2,r.length).join("/");return[r[0]+"/"+r[1],t||void 0]}return e.split(/\/(.+)?/)}},o=function(e){return e.substring(0,e.lastIndexOf("/"))||"./"},f=function(){for(var e=[],r=0;r<arguments.length;r++)e[r]=arguments[r];for(var t=[],n=0,i=arguments.length;n<i;n++)t=t.concat(arguments[n].split("/"));for(var a=[],n=0,i=t.length;n<i;n++){var o=t[n];o&&"."!==o&&(".."===o?a.pop():a.push(o))}return""===t[0]&&a.unshift(""),a.join("/")||(a.length?"/":".")},u=function(e){var r=e.match(/\.(\w{1,})$/);if(r){var t=r[1];return t?e:e+".js"}return e+".js"},s=function(e){if(r){var t,n=document,i=n.getElementsByTagName("head")[0];/\.css$/.test(e)?(t=n.createElement("link"),t.rel="stylesheet",t.type="text/css",t.href=e):(t=n.createElement("script"),t.type="text/javascript",t.src=e,t.async=!0),i.insertBefore(t,i.firstChild)}},l=function(e,t){var i=t.path||"./",o=t.pkg||"default",s=a(e);s&&(i="./",o=s[0],t.v&&t.v[o]&&(o=o+"@"+t.v[o]),e=s[1]),/^~/.test(e)&&(e=e.slice(2,e.length),i="./");var l=n[o];if(!l){if(r)throw'Package was not found "'+o+'"';return{serverReference:require(o)}}e||(e="./"+l.s.entry);var c,p=f(i,e),v=u(p),d=l.f[v];return!d&&/\*/.test(v)&&(c=v),d||c||(v=f(p,"/","index.js"),d=l.f[v],d||(v=p+".js",d=l.f[v]),d||(d=l.f[p+".jsx"])),{file:d,wildcard:c,pkgName:o,versions:l.v,filePath:p,validPath:v}},c=function(e,t){if(!r)return t(/\.(js|json)$/.test(e)?global.require(e):"");var n;n=new XMLHttpRequest,n.onreadystatechange=function(){if(4==n.readyState&&200==n.status){var r=n.getResponseHeader("Content-Type"),i=n.responseText;/json/.test(r)?i="module.exports = "+i:/javascript/.test(r)||(i="module.exports = "+JSON.stringify(i));var a=f("./",e);d.dynamic(a,i),t(d.import(e,{}))}},n.open("GET",e,!0),n.send()},p=function(e,r){var t=i[e];if(t)for(var n in t){var a=t[n].apply(null,r);if(a===!1)return!1}},v=function(e,t){if(void 0===t&&(t={}),/^(http(s)?:|\/\/)/.test(e))return s(e);var i=l(e,t);if(i.serverReference)return i.serverReference;var a=i.file;if(i.wildcard){var f=new RegExp(i.wildcard.replace(/\*/g,"@").replace(/[.?*+^$[\]\\(){}|-]/g,"\\$&").replace(/@/g,"[a-z0-9$_-]+")),u=n[i.pkgName];if(u){var d={};for(var g in u.f)f.test(g)&&(d[g]=v(i.pkgName+"/"+g));return d}}if(!a){var m="function"==typeof t,_=p("async",[e,t]);if(_===!1)return;return c(e,function(e){if(m)return t(e)})}var h=i.validPath,x=i.pkgName;if(a.locals&&a.locals.module)return a.locals.module.exports;var w=a.locals={},b=o(h);w.exports={},w.module={exports:w.exports},w.require=function(e,r){return v(e,{pkg:x,path:b,v:i.versions})},w.require.main={filename:r?"./":global.require.main.filename,paths:r?[]:global.require.main.paths};var y=[w.module.exports,w.require,w.module,h,b,x];return p("before-import",y),a.fn.apply(0,y),p("after-import",y),w.module.exports},d=function(){function t(){}return Object.defineProperty(t,"isBrowser",{get:function(){return void 0!==r},enumerable:!0,configurable:!0}),Object.defineProperty(t,"isServer",{get:function(){return!r},enumerable:!0,configurable:!0}),t.global=function(e,t){var n=r?window:global;return void 0===t?n[e]:void(n[e]=t)},t.import=function(e,r){return v(e,r)},t.on=function(e,r){i[e]=i[e]||[],i[e].push(r)},t.exists=function(e){var r=l(e,{});return void 0!==r.file},t.remove=function(e){var r=l(e,{}),t=n[r.pkgName];t&&t.f[r.validPath]&&delete t.f[r.validPath]},t.main=function(e){return t.import(e,{})},t.expose=function(r){for(var t in r){var n=r[t],i=v(n.pkg);e[n.alias]=i}},t.dynamic=function(r,t){this.pkg("default",{},function(n){n.file(r,function(r,n,i,a,o){var f=new Function("__fbx__dnm__","exports","require","module","__filename","__dirname","__root__",t);f(!0,r,n,i,a,o,e)})})},t.pkg=function(e,r,t){if(n[e])return t(n[e].s);var i=n[e]={},a=i.f={};i.v=r;var o=i.s={file:function(e,r){a[e]={fn:r}}};return t(o)},t}();return d.packages=n,e.FuseBox=d}(this))
//# sourceMappingURL=./sourcemaps.js.map