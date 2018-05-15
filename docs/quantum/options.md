
# Quantum Configuration


Some operations are implicit

| Statement | Description |
| ------------- | ------------- |
| ` typeof module`   | Replaced with "object" in case of a server target, "undefined" for browser   |
| ` typeof exports`   | Replaced with "object" in case of a server target, "undefined" for browser   |
| ` typeof window`   | Replaced with "object" in case of a browser target, "undefined" for server   |
| ` typeof define`   | Replaced with "undefined" (Sorry AMD)  |



## Target
Default value: `browser`
Possible values `server`, `browser`, `universal`,  `electron`, `npm`

```js
QuantumPlugin({
    target : 'browser'
})
```

These options define the API, for example, if you choose `browser` the API will have no checks for browser and target it directly.

note: With an `npm` target, `bakeApiIntoBundle` should be used and `containedAPI` should be `true`. Also, no vendor should be produced while the bundle is specified with the `[ ]` arithmetics to avoid bundling dependencies.

## bakeApiIntoBundle
Instead of creating a separate file with the api, you can chose to bake it into an existing bundle(s).

note: A bundle name should match your registered bundle name in the producer.

possible values:
- string: name of single bundle to bake api into
- string[]: names of multiple bundles to bake api into
- true: bake api into every bundle

```js
QuantumPlugin({
    bakeApiIntoBundle : 'app' // | ['app', 'second'] | true
})
```

## definedExpressions

If you are planning to set up process.env, you should use [EnvPlugin](/page/env-plugin) instead
```js
QuantumPlugin({
    definedExpressions: {
        'foo.bar' : 'foo'
    }
})
```

In this case, Quantum will be aware of `foo.bar` member expression, which will result in dead code elimination (like process.env)

For example:


```js
if ( foo.bar === "foo" ) {
  console.log("i am foo")
} else {
  console.log("i am not foo")
}
```

The result will look like:
```js
console.log("I am foo")
```

## polyfills

Some polyfills can be injected automatically into the API. It comes quite handy if you target your builds for IE11 which doesn't support Promises

```js
QuantumPlugin({
    polyfills : ["Promise"]
})
```


| Polyfill name  | Description
| ------------- | -------------
| Promise  | [Promise](https://github.com/fuse-box/fuse-box/blob/master/modules/fuse-box-responsive-api/promise-polyfill.js) polyfill (for IE)

## css

Quantum can extract your inlined css, group, optimize, minify and store everything to the file system

```js
QuantumPlugin({css: true})
```

Quantum uses [clean-sss](https://github.com/jakubpawlowicz/clean-css) module to optimize CSS. You can provide options by passing an object

```js
QuantumPlugin({css: { clean : true }})
// or
QuantumPlugin({css: { clean : { compatibility : {}} }})
```

If you want to customise the file location, provide the following options

```js
QuantumPlugin({
    css: {
        path : "client/css-resources/styles.min.css"
    }
})
// or
QuantumPlugin({css: { clean : { compatibility : {}} }})
```


## containedAPI
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



## noConflictApi

If you are using an isolated build along with other projected build with Quantum, you would want to set that option. Instead of the regular `$fsx` variable your build (and all split bundles) will look like 
this:



```
// default/index.js
_0336.f[0] = function(){
var tslib_1 = _be203346.r(4);
```

Unliked containedAPI the variable `_0336` will be exposed to window and have shared resources stored in that particular scope.



## manifest
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

## removeExportsInterop
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

FuseBox aligns with the specifications and doesn't allow this kind of heresy in the code and removes it without any mercy.
However many react users are still using it.

## extendServerImport
If you are using dynamic import statements to load remote javascript files on server you would need to enable this option.

This will allow you to do the following

```js
import("https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.19.1/moment.js").then(moment => {

})
```

note: Install `request` library beforehand

## processPolyfill
Default value: `false`

Removes all references to process. The most common use of process if `process.env` which is replaced nicely with Quantum. Therefore, if a user bundles it by mistake all the references and the module will be removed even without tree shaking.

## replaceTypeOf
Default value: `true`

Replaces `typeof module`, `typeof exports`, `typeof window`, `typeof define`, `typeof require` keywords to corresponding values at build time

## removeUseStrict
Default value: `true`

```js
QuantumPlugin({
    removeUseStrict : true
})
```

Removes `"use strict"` from the code



## replaceProcessEnv
Default value: `true`

```js
QuantumPlugin({
    replaceProcessEnv : true
})
```

Replaces `process.env.NODE_ENV` with a string identifier `"production"`


## ensureES5
Default value: `true`
```js
QuantumPlugin({
    ensureES5 : true
})
```


Ensures that all code that is in es5


## treeshake
Default value: `false`
```js
QuantumPlugin({
    treeshake : true
})
```




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


note: Make sure you application has an entry point, otherwise some files can be removed due to unknown to Quantum use case.

## warnings
Default value: `true`
```js
QuantumPlugin({
    warnings : false
})
```

## uglify
Default value: `false`

A boolean flag or an object literal with uglify's options.

Quantum supports both [uglify-js](https://github.com/mishoo/UglifyJS2) 
and [uglify-es](https://github.com/mishoo/UglifyJS2/tree/harmony). 
Which one to use is determined by `es6` option. 

Enable `uglify-js`:
```js
QuantumPlugin({
    uglify : true
})
```

Enable `uglify-js` and pass some options to it:
```js
QuantumPlugin({
    uglify : { toplevel: false }
})
```

Enable `uglify-es`:
```js
QuantumPlugin({
    uglify : { es6: true }
})
```

Alternatively, Quantum could pick up uglify's options from [UglifyJSPlugin](/plugins/misc/UglifyJSPlugin) or 
[UglifyESPlugin](/plugins/misc/UglifyESPlugin), so if you already have one of them set up then minification 
in Quantum should work right away. 

## Computed statement resolution

### Prerequisites

Computed require statement is an issue that cannot be solved automatically. As mentioned earlier, most of the libraries
work out of the box, however a lib that is poorly designed or has an implementation that requires dynamic modules resolution may give a headache.

FuseBox spits out warnings:

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

Now we know the problem in your `default` package (basically your project) in a file `foo.js`.

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

Now as we identified the problem, we can now solve it by mapping files to numbers.

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
