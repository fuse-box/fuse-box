(function() {
  var f = (window.__fuse = window.__fuse || {});
  var modules = (f.modules = f.modules || {});
  f.dt = function(x) {
    return x !== undefined && x.default !== undefined ? x.default : x;
  };
  f.bundle = function(collection, fn) {
    for (var num in collection) {
      modules[num] = collection[num];
    }
    fn ? fn() : void 0;
  };
  f.c = {};
  var splitConfig = {
    b: {
      '4': { p: './somebundle.js' },
    },
    root: './',
  };
  function loadBrowserScript(id, conf) {
    return new Promise(function(resolve, reject) {
      var scriptId = '__entry' + id + '__';
      var script = document.getElementById(scriptId);
      if (!script) {
        script = document.createElement('script');
        script.id = scriptId;
        document.head.appendChild(script);
      }
      script.onload = function() {
        conf.l = 1;
        if (modules[id]) return resolve(f.r(id));
        else reject('Resolve error of module ' + id + ' at path ' + path);
      };

      if (!script.src) script.src = conf.p;
    });
  }
  function loadServerScript(id, path) {
    return new Promise(function(resolve, reject) {
      require(require('path').resolve(splitConfig.root, path));
      if (modulel[id]) {
        return resolve(f.r(id));
      } else reject('Resolve error of module ' + id + ' at path ' + path);
    });
  }
  f.r = function(id) {
    var cached = f.c[id];
    if (cached) return cached.m.exports;
    var module = modules[id];
    if (!module) {
      var split = splitConfig.b[id];
      if (split) return loadBrowserScript(id, split);
    }
    cached = f.c[id] = {};
    cached.exports = {};
    cached.m = { exports: cached.exports };
    module(f.r, cached.exports, cached.m);
    return cached.m.exports;
  };
})();
