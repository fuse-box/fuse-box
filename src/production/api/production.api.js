(function() {
  /* @if allowSyntheticDefaultImports */
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
  /* @end */

  /* @if server */
  var $fsx = (global.$fsx = {});
  /* @end */

  /* @if useSingleBundle */
  var $fsx = {};
  /* @end */

  /* @if !useSingleBundle && isElectron */
  var $fsx = (window.$fsx = {});
  /* @end */

  /* @if browser */
  var $fsx = (window.$fsx = {});
  /* @end */

  $fsx.f = {};

  /* @if splitConfig */
  var splitConfig = $splitConfig$;
  function loadLocalScript(id, path) {
    return new Promise((resolve, reject) => {
      /* @if browser */
      var scriptId = '__entry' + id + '__';
      var script = document.getElementById(scriptId);

      if (!script) {
        script = document.createElement('script');
        script.id = scriptId;
        document.head.appendChild(script);
      }
      script.onload = function() {
        if ($fsx.f[id]) {
          return resolve($fsx.r(id));
        } else reject('Resolve error of module ' + id);
      };
      if (!script.src) script.src = splitConfig.scriptRoot + path;
      /* @end */

      /* @if server */
      require(require('path').resolve(splitConfig.scriptRoot, path));
      if ($fsx.f[id]) {
        return resolve($fsx.r(id));
      } else reject('Resolve error of module ' + id);
      /* @end */
    });
  }
  /* @end */
  $fsx.m = {};
  $fsx.r = function(id) {
    var cached = $fsx.m[id];

    // resolve if in cache
    if (cached) {
      return cached.m.exports;
    }
    var file = $fsx.f[id];
    if (!file) {
      /* @if splitConfig */
      if (splitConfig.entries[id]) return loadLocalScript(id, splitConfig.entries[id]);
      /* @end */
      return;
    }

    cached = $fsx.m[id] = {};
    cached.exports = {};
    cached.m = { exports: cached.exports };
    file.call(cached.exports, cached.m, cached.exports);
    /* @if allowSyntheticDefaultImports */
    syntheticDefaultExportPolyfill(cached.m.exports);
    /* @end */
    return cached.m.exports;
  };

  /* @if useSingleBundle */
  return $fsx;
  /* @end */
})();
