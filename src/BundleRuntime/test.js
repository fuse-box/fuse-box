var __fuse = (function() {
  var core = {};
  var modules = (core.modules = core.modules || {});
  core.bundle = function(collection, fn) {
    for (var num in collection) {
      modules[num] = collection[num];
    }
    fn ? fn() : void 0;
  };
  core.r = function(id) {
    var cached = modules[id];
    if (cached) return cached.m.exports;
    var module = modules[id];
    if (!module) {
      // code splitting here
      return;
    }
    cached = modules[id] = {};
    cached.exports = {};
    cached.m = { exports: cached.exports };
    module(cached.exports, cached.m);
    return cached.m.exports;
  };
  return core;
})();
__fuse.bundle(
  {
    1: function(exports, module) {},
    2: function(exports, module) {},
  },
  function() {
    console.log('ready');
  },
);
