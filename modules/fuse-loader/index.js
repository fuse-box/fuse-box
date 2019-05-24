var $isServiceWorker = typeof ServiceWorkerGlobalScope !== 'undefined';
var $isWebWorker = typeof WorkerGlobalScope !== 'undefined';
var $isBrowser =
  (typeof window !== 'undefined' && typeof window.navigator !== 'undefined') || $isWebWorker || $isServiceWorker;
var g = $isBrowser ? ($isWebWorker || $isServiceWorker ? {} : window) : global;
// Patching global variable
if ($isBrowser) {
  g['global'] = $isWebWorker || $isServiceWorker ? {} : window;
}
// Set root
// __fbx__dnm__ is a variable that is used in dynamic imports
// In order for dynamic imports to work, we need to switch window to module.exports
var __root__ = !$isBrowser || typeof __fbx__dnm__ !== 'undefined' ? module.exports : window;
/**
 * A runtime storage for FuseBox
 */
var $fsbx = $isBrowser
  ? $isWebWorker || $isServiceWorker
    ? {}
    : (window['__fsbx__'] = window['__fsbx__'] || {})
  : (g['$fsbx'] = g['$fsbx'] || {}); // in case of nodejs
if (!$isBrowser) {
  g['require'] = require;
}
/**
 * All packages are here
 *  Used to reference to the outside world
 */
var $packages = ($fsbx.p = $fsbx.p || {});
// A list of custom events
// For example "after-import"
var $events = ($fsbx.e = $fsbx.e || {});
/**
 * $getNodeModuleName
 * Considers a partial request
 * for Example
 * require("lodash/dist/hello")
 */
function $getNodeModuleName(name) {
  var n = name.charCodeAt(0);
  var s = name.charCodeAt(1);
  // basically a hack for windows to stop recognising
  // c:\ as a valid node module
  if (!$isBrowser && s === 58) {
    return;
  }
  // https://www.cambiaresearch.com/articles/15/javascript-char-codes-key-codes
  // basically lowcase alphabet starts with 97 ends with 122, and symbol @ is 64
  // which 2x faster than /^([@a-z].*)$/
  if ((n >= 97 && n <= 122) || n === 64) {
    if (n === 64) {
      // if it's "@" symbol
      var s_1 = name.split('/');
      var target = s_1.splice(2, s_1.length).join('/');
      return [s_1[0] + '/' + s_1[1], target || undefined];
    }
    // this approach is 3x - 4x faster than
    // name.split(/\/(.+)?/);
    var index = name.indexOf('/');
    if (index === -1) {
      return [name];
    }
    var first = name.substring(0, index);
    var second = name.substring(index + 1);
    return [first, second];
  }
}
/** Gets file directory */
function $getDir(filePath) {
  return filePath.substring(0, filePath.lastIndexOf('/')) || './';
}
/**
 * Joins paths
 * Works like nodejs path.join
 */
function $pathJoin() {
  var args = [];
  for (var _i = 0; _i < arguments.length; _i++) {
    args[_i] = arguments[_i];
  }
  var parts = [];
  for (var i = 0, l = arguments.length; i < l; i++) {
    parts = parts.concat(arguments[i].split('/'));
  }
  var newParts = [];
  for (var i = 0, l = parts.length; i < l; i++) {
    var part = parts[i];
    if (!part || part === '.') continue;
    if (part === '..') {
      newParts.pop();
    } else {
      newParts.push(part);
    }
  }
  if (parts[0] === '') newParts.unshift('');
  return newParts.join('/') || (newParts.length ? '/' : '.');
}
/**
 * Adds javascript extension if no extension was spotted
 */
function $ensureExtension(name) {
  var matched = name.match(/\.(\w{1,})$/);
  if (matched) {
    // @NOTE: matched [1] is the `ext` we are looking for
    //
    // Adding extension if none was found
    // Might ignore the case of weird convention like this:
    // modules/core.object.define (core-js)
    // Will be handled differently afterwards
    if (!matched[1]) {
      return name + '.js';
    }
    return name;
  }
  return name + '.js';
}
/**
 * Loads a url
 *  inserts a script tag or a css link based on url extension
 */
function $loadURL(url) {
  if ($isBrowser) {
    var d = document;
    var head = d.getElementsByTagName('head')[0];
    var target;
    if (/\.css$/.test(url)) {
      target = d.createElement('link');
      target.rel = 'stylesheet';
      target.type = 'text/css';
      target.href = url;
    } else {
      target = d.createElement('script');
      target.type = 'text/javascript';
      target.src = url;
      target.async = true;
    }
    head.insertBefore(target, head.firstChild);
  }
}
/**
 * Loop through an objects own keys and call a function with the key and value
 */
function $loopObjKey(obj, func) {
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      func(key, obj[key]);
    }
  }
}
function $serverRequire(path) {
  return { server: require(path) };
}
function $getRef(name, o) {
  var basePath = o.path || './';
  var pkgName = o.pkg || 'default';
  var nodeModule = $getNodeModuleName(name);
  if (nodeModule) {
    // reset base path
    basePath = './';
    pkgName = nodeModule[0];
    // if custom version is detected
    // We need to modify package path
    // To look like pkg@1.0.0
    if (o.v && o.v[pkgName]) {
      pkgName = pkgName + '@' + o.v[pkgName];
    }
    name = nodeModule[1];
  }
  // Tilde test
  // Charcode is 2x faster
  //if (/^~/.test(name)) {
  if (name) {
    if (name.charCodeAt(0) === 126) {
      name = name.slice(2, name.length);
      basePath = './';
    } else {
      // check for absolute paths for nodejs
      // either first one is / (47 for *nix) or second one : (58 for windows)
      if (!$isBrowser && (name.charCodeAt(0) === 47 || name.charCodeAt(1) === 58)) {
        return $serverRequire(name);
      }
    }
  }
  var pkg = $packages[pkgName];
  if (!pkg) {
    if ($isBrowser && FuseBox.target !== 'electron') {
      throw 'Package not found ' + pkgName;
    } else {
      // Return "real" node module
      return $serverRequire(pkgName + (name ? '/' + name : ''));
    }
  }
  name = name ? name : './' + pkg.s.entry;
  // get rid of options
  // if (name.indexOf("?") > -1) {
  //     let paramsSplit = name.split(/\?(.+)/);
  //     name = paramsSplit[0];
  // }
  var filePath = $pathJoin(basePath, name);
  // Try first adding .js if missing
  var validPath = $ensureExtension(filePath);
  var file = pkg.f[validPath];
  var wildcard;
  // Probing for wildcard
  if (!file && validPath.indexOf('*') > -1) {
    wildcard = validPath;
  }
  if (!file && !wildcard) {
    // try index.js
    validPath = $pathJoin(filePath, '/', 'index.js');
    file = pkg.f[validPath];
    if (!file && filePath === '.') {
      validPath = (pkg.s && pkg.s.entry) || 'index.js';
      file = pkg.f[validPath];
    }
    // last resort try adding .js extension
    // Some libraries have a weired convention of naming file lile "foo.bar""
    if (!file) {
      validPath = filePath + '.js';
      file = pkg.f[validPath];
    }
    // if file is not found STILL
    // then we can try JSX
    if (!file) {
      // try for JSX one last time
      file = pkg.f[filePath + '.jsx'];
    }
    if (!file) {
      validPath = filePath + '/index.jsx';
      file = pkg.f[validPath];
    }
    if (!file) {
      // try for JSX one last time
      file = pkg.f[filePath + '.mjs'];
    }
  }
  return {
    file: file,
    wildcard: wildcard,
    pkgName: pkgName,
    versions: pkg.v,
    filePath: filePath,
    validPath: validPath,
  };
}
/**
 * $async
 * Async request
 * Makes it possible to request files asynchronously
 */
function $async(file, cb, o) {
  if (o === void 0) {
    o = {};
  }
  if ($isBrowser) {
    if (o && o.ajaxed === file) {
      return console.error(file, 'does not provide a module');
    }
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
      if (xmlhttp.readyState == 4) {
        if (xmlhttp.status == 200) {
          var contentType = xmlhttp.getResponseHeader('Content-Type');
          var content = xmlhttp.responseText;
          if (/json/.test(contentType)) {
            content = 'module.exports = ' + content;
          } else {
            if (!/javascript/.test(contentType)) {
              content = 'module.exports = ' + JSON.stringify(content);
            }
          }
          var normalized = $pathJoin('./', file);
          FuseBox.dynamic(normalized, content);
          cb(FuseBox['import'](file, { ajaxed: file }));
        } else {
          console.error(file, 'not found on request');
          cb(undefined);
        }
      }
    };
    xmlhttp.open('GET', file, true);
    xmlhttp.send();
  } else {
    if (/\.(js|json)$/.test(file)) return cb(g['require'](file));
    return cb('');
  }
}
/**
 * Trigger events
 * If a registered callback returns "false"
 * We break the loop
 */
function $trigger(name, args) {
  var e = $events[name];
  if (e) {
    for (var i in e) {
      var res = e[i].apply(null, args);
      if (res === false) {
        return false;
      }
    }
  }
}
// NOTE: Should match syntheticDefaultExportPolyfill in fuse-box-responsive-api/index.js
function syntheticDefaultExportPolyfill(input) {
  if (input == null || ['function', 'object', 'array'].indexOf(typeof input) === -1) {
    return;
  }

  // use hasOwnProperty to avoid triggering usage warnings from libraries like mobx
  var hasDefaultProperty = Object.prototype.hasOwnProperty.call(input, 'default');
  var hasModuleProperty = Object.prototype.hasOwnProperty.call(input, '__esModule');

  // to get around frozen input
  if (Object.isFrozen(input)) {
    if (!hasDefaultProperty) {
      input['default'] = input;
    }

    if (!hasModuleProperty) {
      input['__esModule'] = true;
    }
    return;
  }

  // free to define properties
  if (!hasDefaultProperty) {
    Object.defineProperty(input, 'default', { value: input, writable: true, enumerable: false });
  }

  if (!hasModuleProperty) {
    Object.defineProperty(input, '__esModule', { value: true });
  }
}
/**
 * Imports File
 * With opt provided it's possible to set:
 *   1) Base directory
 *   2) Target package name
 */
function $import(name, o) {
  if (o === void 0) {
    o = {};
  }
  // Test for external URLS
  // Basically : symbol can occure only at 4 and 5 position
  // Cuz ":" is a not a valid symbol in filesystem
  // Charcode test is 3-4 times faster than regexp
  // 58 charCode is ":""
  // console.log( ":".charCodeAt(0) )
  // if (/^(http(s)?:|\/\/)/.test(name)) {
  //     return $loadURL(name);
  // }
  if (name.charCodeAt(4) === 58 || name.charCodeAt(5) === 58) {
    return $loadURL(name);
  }
  var ref = $getRef(name, o);
  if (ref.server) {
    return ref.server;
  }
  var file = ref.file;
  // Wild card reference
  if (ref.wildcard) {
    // Prepare wildcard regexp
    var safeRegEx = new RegExp(
      ref.wildcard
        .replace(/\*/g, '@')
        .replace(/[.?*+^$[\]\\(){}|-]/g, '\\$&')
        .replace(/@@/g, '.*')
        .replace(/@/g, '[a-z0-9$_-]+'),
      'i',
    );
    var pkg_1 = $packages[ref.pkgName];
    if (pkg_1) {
      var batch = {};
      for (var n in pkg_1.f) {
        if (safeRegEx.test(n)) {
          batch[n] = $import(ref.pkgName + '/' + n);
        }
      }
      return batch;
    }
  }
  if (!file) {
    var asyncMode_1 = typeof o === 'function';
    var processStopped = $trigger('async', [name, o]);
    if (processStopped === false) {
      return;
    }
    return $async(
      name,
      function(result) {
        return asyncMode_1 ? o(result) : null;
      },
      o,
    );
    // throw `File not found ${ref.validPath}`;
  }
  // pkgName
  var pkg = ref.pkgName;
  if (file.locals && file.locals.module) return file.locals.module.exports;
  var locals = (file.locals = {});
  // @NOTE: is fuseBoxDirname
  var path = $getDir(ref.validPath);
  locals.exports = {};
  locals.module = { exports: locals.exports };
  locals.require = function(name, optionalCallback) {
    var result = $import(name, {
      pkg: pkg,
      path: path,
      v: ref.versions,
    });
    if (FuseBox['sdep']) {
      syntheticDefaultExportPolyfill(result);
    }
    return result;
  };
  if ($isBrowser || !g['require'].main) {
    locals.require.main = { filename: './', paths: [] };
  } else {
    locals.require.main = g['require'].main;
  }
  var args = [locals.module.exports, locals.require, locals.module, ref.validPath, path, pkg];
  $trigger('before-import', args);
  file.fn.apply(args[0], args);
  // fn(locals.module.exports, locals.require, locals.module, validPath, fuseBoxDirname, pkgName)
  $trigger('after-import', args);
  return locals.module.exports;
}
/**
 * The FuseBox client side loader API
 */
var FuseBox = /** @class */ (function() {
  function FuseBox() {}
  FuseBox.global = function(key, obj) {
    if (obj === undefined) return g[key];
    g[key] = obj;
  };
  /**
   * Imports a module
   */
  FuseBox['import'] = function(name, o) {
    return $import(name, o);
  };
  /**
   * @param  {string} n name
   * @param  {any}    fn   [description]
   * @return void
   */
  FuseBox.on = function(n, fn) {
    $events[n] = $events[n] || [];
    $events[n].push(fn);
  };
  /**
   * Check if a file exists in path
   */
  FuseBox.exists = function(path) {
    try {
      var ref = $getRef(path, {});
      return ref.file !== undefined;
    } catch (err) {
      return false;
    }
  };
  /**
   * Removes a module
   */
  FuseBox.remove = function(path) {
    var ref = $getRef(path, {});
    var pkg = $packages[ref.pkgName];
    if (pkg && pkg.f[ref.validPath]) {
      delete pkg.f[ref.validPath];
    }
  };
  FuseBox.main = function(name) {
    this.mainFile = name;
    return FuseBox['import'](name, {});
  };
  FuseBox.expose = function(obj) {
    var _loop_1 = function(k) {
      var alias = obj[k].alias;
      var xp = $import(obj[k].pkg);
      if (alias === '*') {
        $loopObjKey(xp, function(exportKey, value) {
          return (__root__[exportKey] = value);
        });
      } else if (typeof alias === 'object') {
        $loopObjKey(alias, function(exportKey, value) {
          return (__root__[value] = xp[exportKey]);
        });
      } else {
        __root__[alias] = xp;
      }
    };
    for (var k in obj) {
      _loop_1(k);
    }
  };
  FuseBox.consume = function(contents) {
    new Function(contents)(true);
  };
  /**
   * Registers a dynamic path
   *
   * @param str a function that is invoked with
   *  - `true, exports,require,module,__filename,__dirname,__root__`
   */
  FuseBox.dynamic = function(path, str, opts) {
    this.pkg((opts && opts.pkg) || 'default', {}, function(___scope___) {
      ___scope___.file(path, function(exports, require, module, __filename, __dirname) {
        var res = new Function(
          '__fbx__dnm__',
          'exports',
          'require',
          'module',
          '__filename',
          '__dirname',
          '__root__',
          str,
        );
        res(true, exports, require, module, __filename, __dirname, __root__);
      });
    });
  };
  /**
   * Flushes the cache for the default package
   * @param shouldFlush you get to chose if a particular file should be flushed from cache
   */
  FuseBox.flush = function(shouldFlush) {
    var def = $packages['default'];
    for (var fileName in def.f) {
      if (!shouldFlush || shouldFlush(fileName)) {
        delete def.f[fileName].locals;
      }
    }
  };
  /**
   *
   * Register a package
   */
  FuseBox.pkg = function(name, v, fn) {
    // Let's not register a package scope twice
    if ($packages[name]) return fn($packages[name].s);
    // create new package
    var pkg = ($packages[name] = {});
    // file
    pkg.f = {};
    // storing v
    pkg.v = v;
    // scope
    pkg.s = {
      // Scope file
      file: function(name, fn) {
        return (pkg.f[name] = { fn: fn });
      },
    };
    return fn(pkg.s);
  };
  /** Adds a Loader plugin */
  FuseBox.addPlugin = function(plugin) {
    this.plugins.push(plugin);
  };
  FuseBox.packages = $packages;
  FuseBox.isBrowser = $isBrowser;
  FuseBox.isServer = !$isBrowser;
  /**
   * Loader plugins
   */
  FuseBox.plugins = [];
  return FuseBox;
})();
if ($isBrowser) {
  window['FuseBox'] = FuseBox;
} else {
  g['FuseBox'] = FuseBox;
}
