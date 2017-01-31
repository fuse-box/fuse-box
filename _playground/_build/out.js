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
    } else {
        if (contents) {
            exists.innerHTML = contents;
        }
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

"use strict";
require("./foo");
console.log(require("fbjs/lib/invariant.js"));
const a = 1;
console.log('pukka, sukka');

});
___scope___.file("foo.js", function(exports, require, module, __filename, __dirname){ 

"use strict";
const aaa = require("fbjs/lib/ExecutionEnvironment");
const perf = require("fbjs/lib/performanceNow");
class MyFoo {
    constructor() {
    }
}
exports.MyFoo = MyFoo;

});
});
FuseBox.pkg("fusebox-hot-reload", {}, function(___scope___){
___scope___.file("index.js", function(exports, require, module, __filename, __dirname){ 

const Client = require("fusebox-websocket").SocketClient;

module.exports = {
    connect: (port) => {

        if (FuseBox.isServer) {
            return;
        }
        port = port || window.location.port;
        let client = new Client({
            port: port
        });
        client.connect();
        console.log("connecting...");
        client.on("source-changed", (data) => {
            console.log(`Updating "${data.path}" ...`);
            if (data.type === "js") {
                FuseBox.flush();
                FuseBox.dynamic(data.path, data.content);
                if (FuseBox.mainFile) {
                    FuseBox.import(FuseBox.mainFile)
                }
            }
            if (data.type === "css" && __fsbx_css) {
                __fsbx_css(data.path, data.content)
            }
        })
        client.on("error", (erro) => {
            console.log(error);
        });
    }
}
});
return ___scope___.entry = "index.js";
});
FuseBox.pkg("fusebox-websocket", {}, function(___scope___){
___scope___.file("index.js", function(exports, require, module, __filename, __dirname){ 

const events = require("events");

class SocketClient {
    constructor(opts) {
        opts = opts || {};
        const port = opts.port || window.location.port;
        const protocol = location.protocol === "https:" ? "wss://" : "ws://";
        const domain = location.hostname || "localhost";
        this.url = opts.host || `${protocol}${domain}:${port}`;
        this.authSent = false;
        this.emitter = new events.EventEmitter();
    }
    reconnect(fn) {
        setTimeout(() => {
            this.emitter.emit("reconnect", { message: "Trying to reconnect" });
            this.connect(fn);
        }, 5000);
    }
    on(event, fn) {
        this.emitter.on(event, fn);
    }
    connect(fn) {
        console.log("connect", this.url);
        setTimeout(() => {
            this.client = new WebSocket(this.url);
            this.bindEvents(fn);
        }, 0);
    }
    close() {
        this.client.close();
    }
    send(eventName, data) {
        if (this.client.readyState === 1) {
            this.client.send(JSON.stringify({ event: eventName, data: data || {} }));
        }
    }
    error(data) {
        this.emitter.emit("error", data);
    }
    bindEvents(fn) {

        this.client.onopen = (event) => {
            if (fn) {
                fn(this);
            }
        };
        this.client.onerror = (event) => {
            this.error({ reason: event.reason, message: "Socket error" });
        };
        this.client.onclose = (event) => {
            this.emitter.emit("close", { message: "Socket closed" });
            if (event.code !== 1011) {
                this.reconnect(fn);
            }
        };
        this.client.onmessage = (event) => {
            let data = event.data;
            if (data) {
                let item = JSON.parse(data);
                this.emitter.emit(item.type, item.data);
                this.emitter.emit("*", item);
            }
        };
    }
}
exports.SocketClient = SocketClient;
});
return ___scope___.entry = "index.js";
});
FuseBox.pkg("events", {}, function(___scope___){
___scope___.file("index.js", function(exports, require, module, __filename, __dirname){ 

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.
if (FuseBox.isServer) {
    module.exports = global.require('events');
} else {
    function EventEmitter() {
        this._events = this._events || {};
        this._maxListeners = this._maxListeners || undefined;
    }
    module.exports = EventEmitter;

    // Backwards-compat with node 0.10.x
    EventEmitter.EventEmitter = EventEmitter;

    EventEmitter.prototype._events = undefined;
    EventEmitter.prototype._maxListeners = undefined;

    // By default EventEmitters will print a warning if more than 10 listeners are
    // added to it. This is a useful default which helps finding memory leaks.
    EventEmitter.defaultMaxListeners = 10;

    // Obviously not all Emitters should be limited to 10. This function allows
    // that to be increased. Set to zero for unlimited.
    EventEmitter.prototype.setMaxListeners = function(n) {
        if (!isNumber(n) || n < 0 || isNaN(n))
            throw TypeError('n must be a positive number');
        this._maxListeners = n;
        return this;
    };

    EventEmitter.prototype.emit = function(type) {
        var er, handler, len, args, i, listeners;

        if (!this._events)
            this._events = {};

        // If there is no 'error' event listener then throw.
        if (type === 'error') {
            if (!this._events.error ||
                (isObject(this._events.error) && !this._events.error.length)) {
                er = arguments[1];
                if (er instanceof Error) {
                    throw er; // Unhandled 'error' event
                }
                throw TypeError('Uncaught, unspecified "error" event.');
            }
        }

        handler = this._events[type];

        if (isUndefined(handler))
            return false;

        if (isFunction(handler)) {
            switch (arguments.length) {
                // fast cases
                case 1:
                    handler.call(this);
                    break;
                case 2:
                    handler.call(this, arguments[1]);
                    break;
                case 3:
                    handler.call(this, arguments[1], arguments[2]);
                    break;
                    // slower
                default:
                    args = Array.prototype.slice.call(arguments, 1);
                    handler.apply(this, args);
            }
        } else if (isObject(handler)) {
            args = Array.prototype.slice.call(arguments, 1);
            listeners = handler.slice();
            len = listeners.length;
            for (i = 0; i < len; i++)
                listeners[i].apply(this, args);
        }

        return true;
    };

    EventEmitter.prototype.addListener = function(type, listener) {
        var m;

        if (!isFunction(listener))
            throw TypeError('listener must be a function');

        if (!this._events)
            this._events = {};

        // To avoid recursion in the case that type === "newListener"! Before
        // adding it to the listeners, first emit "newListener".
        if (this._events.newListener)
            this.emit('newListener', type,
                isFunction(listener.listener) ?
                listener.listener : listener);

        if (!this._events[type])
        // Optimize the case of one listener. Don't need the extra array object.
            this._events[type] = listener;
        else if (isObject(this._events[type]))
        // If we've already got an array, just append.
            this._events[type].push(listener);
        else
        // Adding the second element, need to change to array.
            this._events[type] = [this._events[type], listener];

        // Check for listener leak
        if (isObject(this._events[type]) && !this._events[type].warned) {
            if (!isUndefined(this._maxListeners)) {
                m = this._maxListeners;
            } else {
                m = EventEmitter.defaultMaxListeners;
            }

            if (m && m > 0 && this._events[type].length > m) {
                this._events[type].warned = true;
                console.error('(node) warning: possible EventEmitter memory ' +
                    'leak detected. %d listeners added. ' +
                    'Use emitter.setMaxListeners() to increase limit.',
                    this._events[type].length);
                if (typeof console.trace === 'function') {
                    // not supported in IE 10
                    console.trace();
                }
            }
        }

        return this;
    };

    EventEmitter.prototype.on = EventEmitter.prototype.addListener;

    EventEmitter.prototype.once = function(type, listener) {
        if (!isFunction(listener))
            throw TypeError('listener must be a function');

        var fired = false;

        function g() {
            this.removeListener(type, g);

            if (!fired) {
                fired = true;
                listener.apply(this, arguments);
            }
        }

        g.listener = listener;
        this.on(type, g);

        return this;
    };

    // emits a 'removeListener' event iff the listener was removed
    EventEmitter.prototype.removeListener = function(type, listener) {
        var list, position, length, i;

        if (!isFunction(listener))
            throw TypeError('listener must be a function');

        if (!this._events || !this._events[type])
            return this;

        list = this._events[type];
        length = list.length;
        position = -1;

        if (list === listener ||
            (isFunction(list.listener) && list.listener === listener)) {
            delete this._events[type];
            if (this._events.removeListener)
                this.emit('removeListener', type, listener);

        } else if (isObject(list)) {
            for (i = length; i-- > 0;) {
                if (list[i] === listener ||
                    (list[i].listener && list[i].listener === listener)) {
                    position = i;
                    break;
                }
            }

            if (position < 0)
                return this;

            if (list.length === 1) {
                list.length = 0;
                delete this._events[type];
            } else {
                list.splice(position, 1);
            }

            if (this._events.removeListener)
                this.emit('removeListener', type, listener);
        }

        return this;
    };

    EventEmitter.prototype.removeAllListeners = function(type) {
        var key, listeners;

        if (!this._events)
            return this;

        // not listening for removeListener, no need to emit
        if (!this._events.removeListener) {
            if (arguments.length === 0)
                this._events = {};
            else if (this._events[type])
                delete this._events[type];
            return this;
        }

        // emit removeListener for all listeners on all events
        if (arguments.length === 0) {
            for (key in this._events) {
                if (key === 'removeListener') continue;
                this.removeAllListeners(key);
            }
            this.removeAllListeners('removeListener');
            this._events = {};
            return this;
        }

        listeners = this._events[type];

        if (isFunction(listeners)) {
            this.removeListener(type, listeners);
        } else if (listeners) {
            // LIFO order
            while (listeners.length)
                this.removeListener(type, listeners[listeners.length - 1]);
        }
        delete this._events[type];

        return this;
    };

    EventEmitter.prototype.listeners = function(type) {
        var ret;
        if (!this._events || !this._events[type])
            ret = [];
        else if (isFunction(this._events[type]))
            ret = [this._events[type]];
        else
            ret = this._events[type].slice();
        return ret;
    };

    EventEmitter.prototype.listenerCount = function(type) {
        if (this._events) {
            var evlistener = this._events[type];

            if (isFunction(evlistener))
                return 1;
            else if (evlistener)
                return evlistener.length;
        }
        return 0;
    };

    EventEmitter.listenerCount = function(emitter, type) {
        return emitter.listenerCount(type);
    };

    function isFunction(arg) {
        return typeof arg === 'function';
    }

    function isNumber(arg) {
        return typeof arg === 'number';
    }

    function isObject(arg) {
        return typeof arg === 'object' && arg !== null;
    }

    function isUndefined(arg) {
        return arg === void 0;
    }
}
});
return ___scope___.entry = "index.js";
});
FuseBox.pkg("fbjs", {}, function(___scope___){
___scope___.file("lib/ExecutionEnvironment.js", function(exports, require, module, __filename, __dirname){ 

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 */

'use strict';

var canUseDOM = !!(typeof window !== 'undefined' && window.document && window.document.createElement);

/**
 * Simple, lightweight module assisting with the detection and context of
 * Worker. Helps avoid circular dependencies and allows code to reason about
 * whether or not they are in a Worker, even if they never include the main
 * `ReactWorker` dependency.
 */
var ExecutionEnvironment = {

  canUseDOM: canUseDOM,

  canUseWorkers: typeof Worker !== 'undefined',

  canUseEventListeners: canUseDOM && !!(window.addEventListener || window.attachEvent),

  canUseViewport: canUseDOM && !!window.screen,

  isInWorker: !canUseDOM // For now, this is true - might change in the future.

};

module.exports = ExecutionEnvironment;
});
___scope___.file("lib/performanceNow.js", function(exports, require, module, __filename, __dirname){ 

'use strict';

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @typechecks
 */

var performance = require('./performance');

var performanceNow;

/**
 * Detect if we can use `window.performance.now()` and gracefully fallback to
 * `Date.now()` if it doesn't exist. We need to support Firefox < 15 for now
 * because of Facebook's testing infrastructure.
 */
if (performance.now) {
  performanceNow = function performanceNow() {
    return performance.now();
  };
} else {
  performanceNow = function performanceNow() {
    return Date.now();
  };
}

module.exports = performanceNow;
});
___scope___.file("lib/performance.js", function(exports, require, module, __filename, __dirname){ 

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @typechecks
 */

'use strict';

var ExecutionEnvironment = require('./ExecutionEnvironment');

var performance;

if (ExecutionEnvironment.canUseDOM) {
  performance = window.performance || window.msPerformance || window.webkitPerformance;
}

module.exports = performance || {};
});
___scope___.file("lib/invariant.js", function(exports, require, module, __filename, __dirname){ 
var process = require("process");
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 */

'use strict';

/**
 * Use invariant() to assert state which your program assumes to be true.
 *
 * Provide sprintf-style format (only %s is supported) and arguments
 * to provide information about what broke and what you were
 * expecting.
 *
 * The invariant message will be stripped in production, but the invariant
 * will remain to ensure logic does not differ in production.
 */

var validateFormat = function validateFormat(format) {};

if (process.env.NODE_ENV !== 'production') {
  validateFormat = function validateFormat(format) {
    if (format === undefined) {
      throw new Error('invariant requires an error message argument');
    }
  };
}

function invariant(condition, format, a, b, c, d, e, f) {
  validateFormat(format);

  if (!condition) {
    var error;
    if (format === undefined) {
      error = new Error('Minified exception occurred; use the non-minified dev environment ' + 'for the full error message and additional helpful warnings.');
    } else {
      var args = [a, b, c, d, e, f];
      var argIndex = 0;
      error = new Error(format.replace(/%s/g, function () {
        return args[argIndex++];
      }));
      error.name = 'Invariant Violation';
    }

    error.framesToPop = 1; // we don't care about invariant's own frame
    throw error;
  }
}

module.exports = invariant;
});
return ___scope___.entry = "index.js";
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
FuseBox.import("fusebox-hot-reload").connect(7778)

FuseBox.import("default/index.js");
FuseBox.main("default/index.js");
})
(function(e){var r="undefined"!=typeof window&&window.navigator;r&&(window.global=window),e=r&&"undefined"==typeof __fbx__dnm__?e:module.exports;var n=r?window.__fsbx__=window.__fsbx__||{}:global.$fsbx=global.$fsbx||{};r||(global.require=require);var t=n.p=n.p||{},i=n.e=n.e||{},a=function(e){var r=e.charCodeAt(0);if(r>=97&&r<=122||64===r){if(64===r){var n=e.split("/"),t=n.splice(2,n.length).join("/");return[n[0]+"/"+n[1],t||void 0]}var i=e.indexOf("/");if(i===-1)return[e];var a=e.substring(0,i),o=e.substring(i+1);return[a,o]}},o=function(e){return e.substring(0,e.lastIndexOf("/"))||"./"},f=function(){for(var e=[],r=0;r<arguments.length;r++)e[r]=arguments[r];for(var n=[],t=0,i=arguments.length;t<i;t++)n=n.concat(arguments[t].split("/"));for(var a=[],t=0,i=n.length;t<i;t++){var o=n[t];o&&"."!==o&&(".."===o?a.pop():a.push(o))}return""===n[0]&&a.unshift(""),a.join("/")||(a.length?"/":".")},s=function(e){var r=e.match(/\.(\w{1,})$/);if(r){var n=r[1];return n?e:e+".js"}return e+".js"},u=function(e){if(r){var n,t=document,i=t.getElementsByTagName("head")[0];/\.css$/.test(e)?(n=t.createElement("link"),n.rel="stylesheet",n.type="text/css",n.href=e):(n=t.createElement("script"),n.type="text/javascript",n.src=e,n.async=!0),i.insertBefore(n,i.firstChild)}},l=function(e,n){var i=n.path||"./",o=n.pkg||"default",u=a(e);u&&(i="./",o=u[0],n.v&&n.v[o]&&(o=o+"@"+n.v[o]),e=u[1]),e&&126===e.charCodeAt(0)&&(e=e.slice(2,e.length),i="./");var l=t[o];if(!l){if(r)throw'Package was not found "'+o+'"';return{serverReference:require(o)}}e||(e="./"+l.s.entry);var v,c=f(i,e),d=s(c),p=l.f[d];return!p&&d.indexOf("*")>-1&&(v=d),p||v||(d=f(c,"/","index.js"),p=l.f[d],p||(d=c+".js",p=l.f[d]),p||(p=l.f[c+".jsx"])),{file:p,wildcard:v,pkgName:o,versions:l.v,filePath:c,validPath:d}},v=function(e,n){if(!r)return n(/\.(js|json)$/.test(e)?global.require(e):"");var t;t=new XMLHttpRequest,t.onreadystatechange=function(){if(4==t.readyState)if(200==t.status){var r=t.getResponseHeader("Content-Type"),i=t.responseText;/json/.test(r)?i="module.exports = "+i:/javascript/.test(r)||(i="module.exports = "+JSON.stringify(i));var a=f("./",e);p.dynamic(a,i),n(p.import(e,{}))}else console.error(e+" was not found upon request"),n(void 0)},t.open("GET",e,!0),t.send()},c=function(e,r){var n=i[e];if(n)for(var t in n){var a=n[t].apply(null,r);if(a===!1)return!1}},d=function(e,n){if(void 0===n&&(n={}),58===e.charCodeAt(4)||58===e.charCodeAt(5))return u(e);var i=l(e,n);if(i.serverReference)return i.serverReference;var a=i.file;if(i.wildcard){var f=new RegExp(i.wildcard.replace(/\*/g,"@").replace(/[.?*+^$[\]\\(){}|-]/g,"\\$&").replace(/@/g,"[a-z0-9$_-]+")),s=t[i.pkgName];if(s){var p={};for(var m in s.f)f.test(m)&&(p[m]=d(i.pkgName+"/"+m));return p}}if(!a){var g="function"==typeof n,h=c("async",[e,n]);if(h===!1)return;return v(e,function(e){if(g)return n(e)})}var x=i.validPath,_=i.pkgName;if(a.locals&&a.locals.module)return a.locals.module.exports;var w=a.locals={},b=o(x);w.exports={},w.module={exports:w.exports},w.require=function(e,r){return d(e,{pkg:_,path:b,v:i.versions})},w.require.main={filename:r?"./":global.require.main.filename,paths:r?[]:global.require.main.paths};var y=[w.module.exports,w.require,w.module,x,b,_];c("before-import",y);var k=a.fn;return k(w.module.exports,w.require,w.module,x,b,_),c("after-import",y),w.module.exports},p=function(){function n(){}return n.global=function(e,n){var t=r?window:global;return void 0===n?t[e]:void(t[e]=n)},n.import=function(e,r){return d(e,r)},n.on=function(e,r){i[e]=i[e]||[],i[e].push(r)},n.exists=function(e){var r=l(e,{});return void 0!==r.file},n.remove=function(e){var r=l(e,{}),n=t[r.pkgName];n&&n.f[r.validPath]&&delete n.f[r.validPath]},n.main=function(e){return this.mainFile=e,n.import(e,{})},n.expose=function(r){for(var n in r){var t=r[n],i=d(t.pkg);e[t.alias]=i}},n.dynamic=function(r,n,t){var i=t&&t.pkg||"default";this.pkg(i,{},function(t){t.file(r,function(r,t,i,a,o){var f=new Function("__fbx__dnm__","exports","require","module","__filename","__dirname","__root__",n);f(!0,r,t,i,a,o,e)})})},n.flush=function(e){var r=t.default;if(e)return void(r.f[e]&&delete r.f[e].locals);for(var n in r.f){var i=r.f[n];delete i.locals}},n.pkg=function(e,r,n){if(t[e])return n(t[e].s);var i=t[e]={},a=i.f={};i.v=r;var o=i.s={file:function(e,r){a[e]={fn:r}}};return n(o)},n}();return p.packages=t,p.isBrowser=void 0!==r,p.isServer=!r,e.FuseBox=p}(this))