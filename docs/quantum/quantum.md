# Quantum

FuseBox Quantum is an extension on top of FuseBox that creates highly optimized bundles.
QuantumAPI is extremely small, around (~200bytes) and very performant.

## Features


* Optimising require statements
All require statements in quantum API will be converted to direct calls (unlike the Vanilla API that processes statements before execution)
* Removing Redundancy
Quantum will try to remove redundancy, like "use-strict" and other parts that don't affect the runtime
* Static Tree Shaking
Quantum features a static tree shaking algorithm. Unlike rollup, quantum tree shaking works with commonjs, however, the code should resemble es6 imports
* Production environments
All development related functionality will be removed
* Hoisting (experimental)
Repetitive require statements will be hoisted


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

If you're planning to minify produced bundles make sure that you have the LATEST `uglify-js` (or `uglify-es` if your target is ES6) installed. 

Via NPM:
```bash
npm install uglify-js
```

Via yarn:
```bash
yarn install uglify-js
```

Make sure you are using [Web Index Plugin](/plugins/web-index-plugin#webindexplugin) as Quantum may produce more bundles than configured in the first place.


## How it works?

FuseBox original API structure is a very flexible one, but it contains some amount of code that won't be necessary required during runtime.

Quantum creates an abstraction on top of the original bundle.

## Quantum API

Quantum api is a lego-like. The more FuseBox features you use, the bigger it gets. If you don't use dynamic require statements, which is the 90% of the case, the API looks like this:

```js
!function(){if(!window.$fsx){var r=window.$fsx={};r.f={},r.m={},
r.r=function(o){var t=r.m[o];if(t)return t.m.exports;
var f=r.f[o];if(f)return t=r.m[o]={},t.exports={},t.m={exports:t.exports},f(t.m,t.exports),t.m.exports}}}();
```
Which is 225 bytes minified.

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

But it will not work if you start playing around with module and exports and start re-assigning values. Quantum performs the tree-shaking algorithm on modules that conform to certain standards. For example, transpiled from es6 to es5.

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

In order to achieve the best treeshaking experience, you need to understand [useJsNext](/page/configuration#usejsnext) option.

FuseBox won't read `module` and `js:next` properties from `package.json` unless configured. This is done by design, as many libraries will simply get broken when transpiled with typescript. (FuseBox uses typescript to transpile es6 modules). For example you can't use `react-router` with [useJsNext](/page/configuration#usejsnext) option,
because it uses non-standard javascript in the code base, e.g - `import React from "react"` where React doesn't export `default`

You may find [polyfillNonStandardDefaultUsage](/page/configuration#polyfillnonstandarddefaultusage) option quite useful, but be careful, this is a non-standard way of cooking javascript!

Therefore you must select the libraries with caution. FuseBox, however, will still try to treeshake `commonjs` libraries, in fact it works well in many cases, for example it does a nice job with React library, removing several files entirely from es5 build.


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


Quantum merges `process.env` with `{NODE_ENV : "production"}`. It's made on purpose to avoid mistakes, as Quantum builds are made for production. You can override `NODE_ENV` variable by using [Env Plugin](/plugins/env-plugin#usage)

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

Quantum works with [Env Plugin](/plugins/env-plugin#usage) therefore all the environmental variables will be replaced accordingly.

### definedExpressions

Similar to process.env Quantum will respect [definedExpressions](/page/quantum#definedExpressions) option.