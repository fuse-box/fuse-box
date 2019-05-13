---
id: environments
title: Environments
---

It's imperative to understand the difference between production environment and
development. The API is completely different, however mostly compatible and
covered with tests.

When you first launch your production build, you will notice that there is an
`api.js` file next to your bundles.

Production API is lego-like. A mimimal setup is ~200bytes API. The more features
you use, the larger it gets, but it doesn't exceed reasonable limits.

It could be baked into any bundle by calling `bakeApiIntoBundle` in the Quantum
plugin options.

Let's check out the difference:

Development API

```js
(function(FuseBox) {
  FuseBox.$fuse$ = FuseBox;
  FuseBox.pkg("default", {}, function(___scope___) {
    ___scope___.file("index.js", function(
      exports,
      require,
      module,
      __filename,
      __dirname,
    ) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      var foo_1 = require("./foo");
      console.log(new foo_1.Foo());
    });
    ___scope___.file("foo.js", function(
      exports,
      require,
      module,
      __filename,
      __dirname,
    ) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      function Foo() {}
      exports.Foo = Foo;
    });
  });
  FuseBox.import("default/index.js");
  FuseBox.main("default/index.js");
});
```

Production API is much more optimised.

```js
(function($fsx) {
  // default/index.js
  $fsx.f[0] = function() {
    var foo_1 = $fsx.r(1);
    console.log(new foo_1.Foo());
  };
  // default/foo.js
  $fsx.f[1] = function(module, exports) {
    function Foo() {}
    exports.Foo = Foo;
  };
  $fsx.r(0);
})($fsx);
```

## About code splitting

Code splitting in FuseBox is a rather complicated feature, where the actual
splitting happens only in production mode, whilst development bundle will retain
all your code intact. That is done on purpose, to speed up the development.

```js
await import("./somefile");
```

Running `node fuse dist` will make a hashed bundle with underlying dependenies.
