# Quantum

FuseBox Quantum is an extension on top of FuseBox that creates highly optimized bundles.
QuantumAPI is extremely small, around (~200bytes) and very performant.

## Features

steps:
 * Optimising require statements
   All require statements in quantum API will be converted to direct calls (unlike the Vanilla API that processes statements before execution)
 * Removing Redundancy
   Quantum will try to remove redundancy, like "use-strict" and other parts that don't affect the runtime
 * Static Tree Shaking
   Quantum features a static tree shaking algorithm. Unlike rollup, quantum tree shaking works with commonjs, however, the code should resemble es6 imports


Quantum bundles are in fact a bit smaller than the ones produced with Rollup.

## Why Quantum?

> In physics, a quantum (plural: quanta) is the minimum amount of any physical entity involved in an interaction

In FuseBox world, `Quantum` is the minimum amount of javascript code involved in an interaction.

Quantum should be used only for making production builds. It has a few limitations when it gets to the compatibility with original's FuseBox API which aren't solved just yet, but it works perfectly for most projects.


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
note: Make sure you have the LATEST uglify-js

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

As you can see, a lot is happening here.

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

It doesn't mean that the original FuseBox API is bad, it's just that Quantum serves a different purpose and targets for those who desire a minimal friction in the code and don't use FuseBox dynamic modules (however we will support the latter very soon with Quantum)

## Tree shaking

Unlike rollup and webpack, static tree shaking in FuseBox Quantum works for commonjs modules too. Commonjs tree shaking, however, has limitations.

Below is the perfect candidate for tree shaking in Quantum:

```js
var hello = function(){}
exports.hello = hello;
```

But it will not work if you start playing around with module and exports and start re-assigning values. Quantum performs the tree-shaking algorithm on modules that conform to certain standards. For example, transplied from es6 to es5.

Quantum doesn't really remove `var hello = function(){}`, it actually leaves it up for UglifyJS to decide, that's why it's important to enable it.

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

## Code splitting

Code splitting is not solved yet, but it will have a nice comeback after the module has been thoroughly tested by the users.

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


### bakeApiIntoBundle 
Instead of creating a separate file with the api, you can chose to bake it into an existing bundle. 

note: A bundle name should match your registered bundle name in the producer.

```js
QuantumPlugin({
    bakeApiIntoBundle : 'app'
})
```

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


### warnings
Default value: `true`
```js
QuantumPlugin({
    warnings : false
})
```

## Computed statement resolution

### Prerequisites

Computed require statement is an issue that cannot be solved automatically. As mentioned earlier, most of the libraries
work out of the box, however a lib that is poorly designed or has an implementation that requires dynamic modules resolution may give a headache.

FuseBox spits out warnigs:

```bash
Warnings:
Your quantum bundle might not work
  - Computed statement warning in moment/moment.js
```

Which means that FuseBox Quantum has switched to use `hashes` instead of numbers on the file identification. For example, in a successful case, your will have something like that:

```js
$fsx.f[1] = function(module, exports){}
``` 

However, if a computed require statement cannot be resolved, Quantum switches to hashes istead of number on the entire project

```js
$fsx.f["33c70bf3"] = function(module, exports){}
```

This will result in larger bundles and sometimes (if a computed statement is a complicated one) will fail at runtime. Quantum does everything what's possible to resolve it without your attention, however, you can help Quantum detect and solve related problems.

### Problem

You can see the entire solution [here](https://github.com/fuse-box/fuse-box-examples/tree/master/examples/quantum_computed_resolve)

Let's just say that you have a function

```js
export function getHTMLContents(name: string) {
    return require("./views/" + name + ".html");
}
```

Clearly it's hard to tell how to automatically resolve the following statement. Quantum build will still work, however, a simple trick will roll back the mode to the `optimised` one and start using numbers instead of hashes (to gain the performance and decrease the size of your bundle)

You will see the following output:

```bash
Warnings:
Your quantum bundle might not work
  - Computed statement warning in default/foo.js
```

Now we know the the problem in your `default` package (basically your project) in a file `foo.js`.

### Solution

Now as we indentified the problem, we can now solve it by mapping files to numbers.

Let's imagine the following:
```
{"default/views/first.html":2,"default/views/second.html":3}
```

This map contains all our problematic html files mapped to numbers. The only thing left is to modify our require statement. And in order to do that you would need to hack into QuantumAPI and register a special mapping class


```js
QuantumPlugin({
    api: (core) => {
        core.solveComputed("default/foo.js", {
            mapping: "views/*.html",
            fn: (statement, core) =>
                statement.setExpression(`"default/views/" + name + ".html"`)
        });
    }
})
```

`mapping: "views/*.html"`  tells Quantum to memorize all files id's that match the pattern above. That's how we can that nice JSON injected into the `api.js`.
But unfortunately, that's not enough. We need to solve the path relativity problem. 



Let's identify what cannot be resolved:
```js
fn: (statement, core) =>{
  console.log(statement.ast.arguments)
})
```

You will get something like that:

```js
[
  {
    "type": "BinaryExpression",
    "left": {
      "type": "BinaryExpression",
      "left": {
        "type": "Literal",
        "value": "./views/",
      },
      "operator": "+",
      "right": {
        "type": "Identifier",
        "name": "name"
      },
    },
    "operator": "+",
    "right": {
      "type": "Literal",
      "value": ".html",
    }
  }
]
```

note: You don't need to learn AST the solve the problem. The example above is for advanced users

From the ast above, we see that a variable `name` is included into the `BinaryExpression`. Needless to say, you don't need to check an AST in order to  figure out the compounds, you can just take a peek at the bundle's code. Or simply at your source code. 

Knowing which variable (and it's important to keep the same name) is including in the computed statement, we can now re-write it to our mappings.

```js
statement.setExpression(`"default/views/" + name + ".html"`)
```

And the resulting code will look like:

```js
function getHTMLContents(name) {
    return $fsx.p('default/views/' + name + '.html');
}
```

Whereas `$fsx.p` is a function that resolves defined mapping

github_example: quantum_computed_resolve

### Improvements

It should be possible to create a simple FuseBox plugin, for example `QuantumMomentJsSolution` to be shared with other people.
  
