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
 * Production environments
   All development related functionlity will be removed
 * Hoisting (experimental) 
   Repetetive require statements will be hoisted


Quantum bundles are in fact a bit smaller than the ones produced with Rollup.

## Why Quantum?

> In physics, a quantum (plural: quanta) is the minimum amount of any physical entity involved in an interaction

In FuseBox world, `Quantum` is the minimum amount of javascript code involved in an interaction.

Quantum should be used only for making production builds. It has a few limitations when it gets to the compatibility with original's FuseBox API which aren't solved just yet, but it works perfectly for most projects.


## Installation
Quantum does extreme amount of operations, but it's very simple to configure:

Add a plugin like so:

```js
const { FuseBox, QuantumPlugin, WebIndexPlugin } = require("fuse-box");
FuseBox.init({
    plugins : [
        WebIndexPlugin(),
        isProduction && QuantumPlugin()
    ]
});
```

UglifyJs is used optionally and activated with `{uglify : true}` option, don't forget it install it

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

note: Remove UglifyJSPlugin from the plugin list, it will conflict with Quantum

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

## Dead code elimination
Quantum eliminates dead code on some if conditions. Optimising it even before uglify-js kicks in.

### Process
Quantum eliminates dead code on some if conditions. For example;

```js
console.log(1)
if ( process.env.NODE_ENV === "production" ){
    console.log("production")
} else {
    console.log("development")
}
console.log(2)
```

Will result in:

```js
console.log(1)
console.log("production")
console.log(2)
```

Good thing about it, that you don't need uglify-js for this operation. However, you should not de-reference process.env.$key, as it won't be understood by quantum


Quantum merges `process.env` with `{NODE_ENV : "production"}`. It's made on purpose to avoid mistakes, as Quantum builds are made for production. You can override `NODE_ENV` variable by using [EnvPlugin](/plugins/env-plugin#usage) 

```js
EnvPlugin({ NODE_ENV: "stage" })
```

And in your code
```js
if (process.env.NODE_ENV === "stage") {
    console.log("staging env");
}
```

For example:
```js
const key = process.env.NODE_ENV
if ( key === "production" ){
    console.log("production")
} else {
    console.log("development")
}
```

Will result in 
```js
var key = "production";
if ( key === "production" ){
    console.log("production")
} else {
    console.log("development")
}
```

Which is less efficient than just declaring it in the if statement.

Quantum works with [EnvPlugin](/plugins/env-plugin#usage) therefore all the environmental variables will be replaced accordingly.


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
Possible values `server`, `browser`, `universal`,  `electron`, `npm`

```js
QuantumPlugin({
    target : 'browser'
})
```

These options define the API, for example, if you choose `browser` the API will have no checks for browser and target it directly.

note: With an `npm` target, `bakeApiIntoBundle` should be used and `containedAPI` should be `true`. Also, no vendor should be produced while the bundle is specified with the `[ ]` arithmetics to avoid bundling dependencies.

### bakeApiIntoBundle 
Instead of creating a separate file with the api, you can chose to bake it into an existing bundle. 

note: A bundle name should match your registered bundle name in the producer.

```js
QuantumPlugin({
    bakeApiIntoBundle : 'app'
})
```


### polyfills

Some polyfills can be injected automatically into the API. It comes quite handy if you target your builds for IE11 which doesn't support Promises

```js
QuantumPlugin({
    polyfills : ["Promise"]
})
```


| Polyfill name  | Description
| ------------- | ------------- 
| Promise  | [Promise](https://github.com/fuse-box/fuse-box/blob/master/modules/fuse-box-responsive-api/promise-polyfill.js) polyfill (for IE)



### containedAPI
Default value: `false`

Quantum bundles are similar to original FuseBox API where the scope is shared, meaning if you import (load) 2 bundles they will share the same virtual file system.
But there is the other side to it. Quantum bundles unlike non-Quantum have to be bundled within one project. All files have numbers instead of strings (to speed up module loading) therefore if you publish a Quantum bundle to npm, it may collide with the current project bundled, once installed. To solve this, Quantum has an option called `containedAPI` which doesn't share NOR store it's virtual system on window but does it locally instead.

```js
QuantumPlugin({
    bakeApiIntoBundle : 'app',
    containedAPI : true
})
```

In order to use it, you need ensure that you have only 1 bundle in the output and the API is baked into it. It will not work with split bundles or vendor bundles.

Produced bundles will look similar to this example below:

```js
(function() {
    var $fsx = {};
    $fsx.f = {}
    $fsx.m = {};
    $fsx.r = function(id) {
        // contents omited
    };
    // default/index.js
    $fsx.f[0] = function(module, exports) {
        function hello() {}
        exports.hello = hello;
    }
})();
```

Whereas $fsx is a local variable


### manifest
Default value: `false`
```js
QuantumPlugin({
    manifest : true
})
```

Generates `manifest.json` (file name can be customised by setting a string instead of a true value)
which contains the information on the generated bundles. An example below:

```js
{
  "app": {
    "fileName": "1fd5d933-app.js",
    "hash": "1fd5d933",
    "absPath": "$userpath/src/splitting/code-splitting/dist/1fd5d933-app.js",
    "webIndexed": true,
    "relativePath": "1fd5d933-app.js"
  },
  "home": {
    "fileName": "72a031dc-home.js",
    "hash": "72a031dc",
    "absPath": "$userpath//src/splitting/code-splitting/dist/72a031dc-home.js",
    "webIndexed": false,
    "relativePath": "72a031dc-home.js"
  }
}
```
`webIndexed` is false when a bundle should not be loaded as a script tag (split bundle)

### removeExportsInterop
Default value: `true`

```js
QuantumPlugin({
    removeExportsInterop : true
})
```

Removes `Object.defineProperty(exports, '__esModule', { value: true });` or `exports.__esModule = true` from the bundle.
It is required however for babel transpiled projects, You have to set it to `false` when dealing with certain builds of react.

When babel introduced ES2015 Modules => CommonJS, the spec wasn't completed. However, everyone was using it. The spec came along and stipulated that you cannot request a default import (ie. import Foo from 'x') from a module that doesn't have one. 

Instead, you must import * as Foo from 'x'.

FuseBox alings with the specifications and doesn't allow this kind of heresy in the code and removes it without any mercy. 
However many react users are still using it.

### processPolyfill
Default value: `false`

Removes all references to process. The most common use of process if `process.env` which is replaced nicely with Quantum. Therefore, if a user bundles it by mistake all the refences and the module will be removed even without tree shaking.

### replaceTypeOf
Default value: `true`

Replaces `typeof module`, `typeof exports`, `typeof window`, `typeof define`, `typeof require` keywords to corresponding values at build time

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
Default value: `false`
```js
QuantumPlugin({
    treeshake : true
})
```

Enables the tree shaking

Accepts additional option `shouldRemove` to prevent some files from being removed (as FuseBox considers them useless user might think differently)


```js
QuantumPlugin({
    treeshake: {
        shouldRemove: file => {
            if (file.fuseBoxPath === "foo.js") {
                return false;
            }
        }
    }
});
```

In the example above, the file`foo.js` will not be removed, as it was restricted by user.


note: Make sure you application has en entry point, otherwise some files can be removed due to uknown to Quantum use case.

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

The statement will return `undefined` in this case. You can continue ignoring the message if it doesn't break your build. But if does, read up!


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

### Easy solution
If you don't really want to dive into someone's code, you could try resolving it using a simple api tweak

```js
QuantumPlugin({
    api: (core) => {
        core.solveComputed("encoding/lib/iconv-loader.js");
    }
})
```
Whereas `"encoding/lib/iconv-loader.js"` is a path printed out in the warning.

If you really need to fix it and make it work with Quantum, keep on reading


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
  
