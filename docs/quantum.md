# Quantum

FuseBox Quantum is an extension on top of FuseBox that creates highly optimised bundles.
QuantumAPI is extremely small (~200bytes) and very performant.

## Features

steps:
 * Optimising require statements
   All require statements in quantum API will be converted to direct calls (unlike the Vanilla API that processes statements before execution)
 * Removing Redundancy  
   Quantum will try to remove redundancy, like "use-strict" and other parts that don't affect the runtime
 * Static Tree Shaking
   Quantum features a static tree shaking algorythm. Unlike rollup, quantum tree shaking works with commonjs, however the code should resemble es6 imports
  

Quantum bundles are in fact a bit smaller than the ones produced with Rollup.

## Why Quantum?

> In physics, a quantum (plural: quanta) is the minimum amount of any physical entity involved in an interaction

if FuseBox, `Quantum` is the minimum amount of javascript code involded in an interaction.

Quantum should be used only for making production builds. It has a few limitations when it gets to compatibility with original's FuseBox api which aren't solved just yet, but it works perfectly for most projects.


## Installation
Quantum does extreme amount of operations, but it's very simple to configure:

Add a plugin like so:

```js
const { QuantumPlugin, WebIndexPlugin,UglifyJSPlugin } = require("fuse-box");
FuseBox.init({
    WebIndexPlugin(),
    isProduction && QuantumPlugin()
});
```

UglifyJs is enabled by default, don't forget it install it

Via NPM:
```bash
npm install uglify-js
```

Via yarn:
```bash
yarn install uglify-js
```

Make sure you are using [WebIndexPlugin](/plugins/webindexplugin#webindexplugin) as Quantum may produce more bundles than configured in the first place.

## How it works?

FuseBox original API structure is a very flexible one, but it contains some amount of code that won't be necessary required during runtime. 

Quantum creates an abstraction on top of the original bundle. 

Original FuseBox bundle + 5kb API

```js
(function(FuseBox) {
    FuseBox.$fuse$ = FuseBox;
    FuseBox.pkg("default", {}, function(___scope___) {
        ___scope___.file("index.js", function(exports, require, module, __filename, __dirname) {
            "use strict";
            Object.defineProperty(exports, "__esModule", { value: true });
            var foo_1 = require("./foo");
            console.log(new foo_1.Foo());

        });
        ___scope___.file("foo.js", function(exports, require, module, __filename, __dirname) {
            "use strict";
            Object.defineProperty(exports, "__esModule", { value: true });
            function Foo() {}
            exports.Foo = Foo;
        });
    });
    FuseBox.import("default/index.js");
    FuseBox.main("default/index.js");
})
```

As you can see lots of happening here.

Let's look at the same code built with Quantum:

```js
(function($fsx) {
    // default/index.js
    $fsx.f[0] = function() {
        var foo_1 = $fsx.r(1);
        console.log(new foo_1.Foo());
    }
    // default/foo.js
    $fsx.f[1] = function(module, exports) {
        function Foo() {}
        exports.Foo = Foo;
    }
    $fsx.r(0)
})($fsx)
```

Many things were removed, like `"use strict"` and `Object.defineProperty(exports, "__esModule", { value: true })`. However, it's all configurable.

github_example: quantum_simple

## Quantum API

Quantum api is a lego-like. The more FuseBox features you use, the bigger it gets. If you don't use dynamic require statements, which is the 90% of the case, the API looks like this:

```js
!function(){if(!window.$fsx){var r=window.$fsx={};r.f={},r.m={},
r.r=function(o){var t=r.m[o];if(t)return t.m.exports;
var f=r.f[o];if(f)return t=r.m[o]={},t.exports={},t.m={exports:t.exports},f(t.m,t.exports),t.m.exports}}}();
```
Which is 225kb minified.

Let's minify the example above, and see how it looks:

```js
!function(o){o.f[0]=function(){var n=o.r(1);console.log(new n.Foo)},o.f[1]=function(o,n){function f(){}n.Foo=f},o.r(0)}($fsx);
```

Impressive, right?

It doesn't mean that the original FuseBox API is bad, it's just Quantum serves a different purpose and targets for those who desire a minimal friction in the code and don't use FuseBox dynamic modules (however we will support the latter very soon with Quantum)

## Tree shaking

Unlike rollup and webpack, static tree shaking in FuseBox Quantum works for commonjs modules too. Commonjs tree shaking, however, has limitations.

Below is the perfect candidate for tree shaking in Quantum:

```js
var hello = function(){}
exports.hello = hello;
```

But it will not work if you start playing around with module and exports and start re-assigning values. Quantum performs the tree-shaking algorythm on modules that conform to certain standards. For example, transplied from es6 to es5.

Quantum doesn't not really remove `var hello = function(){}` and leaves it up for UglifyJS to decide, that's why it's important to enable it.

So in our case the resulting code will look as follows:

```js
var hello = function(){}
```

which makes `hello` an unused variable, hence will be stripped out from the code by UglifyJS

The following code, however, will get the entire statement removed:

 
```js
exports.hello = function(){
    alert(1)
}
```

github_example: quantum_tree_shaking

## Configuration


Some operations are implicit

| Statement | Description |
| ------------- | ------------- |
| ` typeof module`   | Replaced with "object" in case of a server target, "undefined" for browser   |
| ` typeof exports`   | Replaced with "object" in case of a server target, "undefined" for browser   |
| ` typeof window`   | Replaced with "object" in case of a browser target, "undefined" for server   |
| ` typeof define`   | Replaced with "undefined" (Sorry AMD)  |


Here is a list of what you can configure:


### Target
Default value: `browser`
Possible values `server`, `browser`

```js
QuantumPlugin({
    target : 'browser'
})
```


These options define the API, for example, if you choose `browser` the API will have no checks for browser and target it directly.


### removeExportsInterop
Default value: `true`

```js
QuantumPlugin({
    removeExportsInterop : true
})
```

Removes `Object.defineProperty(exports, '__esModule', { value: true });` or `exports.__esModule = true` from the bundle.
It is required however for babel transpiled projects, You have to set it to `false` when dealing with certain builds of react.


### removeUseStrict
Default value: `true`

```js
QuantumPlugin({
    removeUseStrict : true
})
```

Removes `"use strict"` from the code



### replaceProcessEnv
Default value: `true`

```js
QuantumPlugin({
    replaceProcessEnv : true
})
```

Replaces `process.env.NODE_ENV` with a string identifier `"production"`


### ensureES5
Default value: `true`
```js
QuantumPlugin({
    ensureES5 : true
})
```


Ensures that all code that is in es5


### treeshake
Default value: `true`
```js
QuantumPlugin({
    ensureES5 : true
})
```

Enables the tree shaking





