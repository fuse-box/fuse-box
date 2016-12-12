[![Build Status](https://travis-ci.org/fuse-box/fuse-box.svg?branch=master)](https://travis-ci.org/fuse-box/fuse-box)
  
# FuseBox
> The library is under heavy development. We are getting there.

# Introduction

FusBox is a bundler/module loader that combines the power of webpack and JSPM. It is blazing fast (it takes 50-100ms to re-bundle) which makes it extremely convinient to develop. You get one file out with sourcemaps. 

Say no to painful "get started", say no to huge configs. Fuse it all!

[angular2-example](https://github.com/fuse-box/angular2-example) 50ms to build!

[react-example](https://github.com/fuse-box/react-example) 50ms to build

## Why fusebox?

### Bundle anything without an extra effort
You have an npm library in mind? You can bundle it without any extra configuration. babel-core with all plugins? No problem, fusebox takes care of everything you need.

All node modules (at least the most cricial ones) will be bundled for browser (Buffer, path e.t.c) So you don't need to stress about whether you bundle will work in browser. IT WILL.

### It is blazing fast

Fusebox is super fast. 50ms for a regular project, 100ms for a big project to re-bundle. It applies agressive but responsible module caching, which makes it fly.

Check this benchmark:

1200 files to require once

|         |            |
| ------------- |:-------------:| 
| FuseBox      | 0.326s |
| Webpack      | 1.376s |


1000 files to require / 10 times

|         |            |
| ------------- |:-------------:| 
| FuseBox      | 2.796s |
| Webpack      | 13.837s |



1000
Webpack
FuseBox

### Built-in typescript support.

FuseBox is written in typescript, so i could not just proceed without a seemless typescript intergration. In fact you don't need to configure anything! Just point it to a typescript file, and FuseBox will do the rest.

```js
fuseBox.bundle(">index.ts");
```

### Arithmetic instructions

With arithmetic instructions you can explicitely define which files go to the bundle, which files skip external dependencies.

For example.
```js
fuseBox.bundle(">index.ts [lib/**/*.ts]");
```

In this case you will get everything that is required in index, as well as everything that lies under lib/ folder with one condition - any external libraries will be ignored. 

`> index.js [**/*.js]` - Bundle everything without dependencies, and execute index.js

`[**/*.js]` - Bundle everything without dependencies

`**/*.js` - Bundle everything with dependencies

`**/*.js -path` - Bundle everything with dependencies except for path


### Extensive plugins

Have an idea in mind? Just develop a plugin, it's extremely easy to make one. Besides, we have a few plugins, that will help you get started.

## How FuseBox works?!

The idea of FuseBox was born, when started struggling with webpack. It is slow, and it did not deliver required functionlity. On other hand jspm did what i wanted, but still it was not something i would go for. So i decided to combine both and create my own version that has power of both bundlers combined. 

### Static analisys (acorn)
Behind the scenes, fusebox uses acorn to make static analisys on your code, extracting require statements and es6 imports. So, as long as it is a valid javascript es5 or es6, you will get your code bundled with no plugins required. 

### Aggressive npm caching
FuseBox uses agressive caching for your modules. It knows when a file is modified. It knows exactly which version of npm lib you are using, as well as explicit requires like `require('lodash/each')`

### Nodejs ecosystem and lifecycle in the browser
FuseBox appends a very tiny API footer that makes magic happen. The library does not modify your source code, it creates 100% compatible [commonjs wrapper](https://nodejs.org/api/modules.html#modules_the_module_wrapper)

```js
(function (exports, require, module, __filename, __dirname) {
// Your module code actually lives in here
});
```

It behaves exactly the same in browser and on server, including circular dependencies resolution. Surely, it works in node as well.


# Common Config

```js
let fuseBox = new FuseBox({
    homeDir: "src/",
    sourceMap: {
         bundleReference: "./sourcemaps.js.map",
         outFile: "sourcemaps.js.map",
    },
    globals: { default: "myLib"},
    outFile: "./out.js"
});
fuseBox.bundle(">index.ts");
```

## Export from bundle

You can easily export any library from your bundle to window/module.exports accordingly.
Simply add this property:

```js
globals: { default: "myLib", "wires-reactive": "Reactive" }
```

Whereas key is the name of a package, and value is an alias that groups exports.
"default" is your current project. Please, note, that in order to expose your default package, a bundle must have an entry point.

Full example:

```js
let fuseBox = new FuseBox({
    homeDir: "test/fixtures/cases/case1",
    globals: { default: "myLib"},
    outFile: "./out.js"
});
fuseBox.bundle(">index.js");
```


# Loader API

FuseBox bundle works in both environment. Essentially, it does not matter where you run. FuseBox will persist itself in browser window, or nodejs globals.

Every bundle contains a 3k footer with FuseBox API, It is less than 3KB minified (1,4KB gzipped).  


## Import
Import is 100% compatible with commonjs specification. You can require folders, skip file extensions (fusebox will guess it).
```js
FuseBox.import("./foo/bar");
```
Requre external packages will work  as well

```js
FuseBox.import("fs");
```

Please, not, that some libraries like "fs" are faked on browser. Meaning that it won't spit an error, but won't work as expected on server for known reasons.
Nodejs environment, however, will get authentic "fs" module. (Concerns http, net, tty e.t.c )

## Exists

You check wether a module (file) exists in scope.
```js
FuseBox.exists("./index")
```

## Event binding

It is possible to intercept require statements. Use "on" method.

```
FuseBox.on("before-import", (exports, require, module, __filename, __dirname, pkg) => {                
});

FuseBox.on("after-import", (exports, require, module, __filename, __dirname, pkg) => {                
});
```
2 events are available at the moment "before-import" and "after-import", Provides commonjs environment (+ package name) in the callback. "require" function is "homie" and respects file location.


## Dynamic

Like SystemJS FuseBox provides a hacky way of create a dynamic module from string. After it has been initialized it shared 100% the same environment and behaves accordingly.

```
FuseBox.dynamic("stuff/boo.js", "module.exports = {hello : 'dynamic'}; require('./foo')")
```
A bundle can reference "stuff/boo.js" once a dynamic module was initialized.

```js
let fuseBox = new FuseBox({
    homeDir: "test/fixtures/cases/case1"
});
```







## FuseBox events

It is possible to intercept require statements. You can catch "before-import" and "after-import" events like so:

```
FuseBox.on("before-import", (exports, require, module, __filename, __dirname, pkg) => {                
});

FuseBox.on("after-import", (exports, require, module, __filename, __dirname, pkg) => {                
});
```

It is not recommended, however, if you want to play god, you can use that functionlity.



# Built-in plugins

Fusebox contains premade plugins, that should help you to get started. 

## CSS Plugin

It's very to start working css files You have 2 options, you either bundle the contents, or serve files. A decision can be made at build time.

For example:
```
plugins: [
    fsbx.CSSPlugin({
        minify: true
    })
]
```

In this case, all css files will be bundled.

But if you define "serve" option with a callback, all files will be filtered through it. A callback is expected to return a string with a server path. If you return "undefined" or *NOT* a string, file will be bundled as if no option was specified.

All css files will be served by server.
```
plugins: [
    fsbx.CSSPlugin({
        minify: true,
        serve: path => `./${path}`
    })
]
```

All files will be served except for "styles.css" (contents will be included into the bundle)
```
plugins: [
    fsbx.CSSPlugin({
        minify: true,
        serve: path => path === "styles.css` ? 0 : ./${path}`
    })
]
```

## Typescript helpers

A very handy plugin, adds required typescript functions to the bundle. Please, note, that it adds only the ones that are actually used. So you won't be seeing unnecessary code.

Please, check this [list](https://github.com/fuse-box/fuse-box/tree/master/assets/libs/fuse-typescript-helpers)

Available helpers:

Name | Description
------------ | -------------
__assign | Generic typescript helper
__awaiter | Generic typescript helper
__decorator | Generic typescript helper + additional fusebox meta data patched
__extends | Generic typescript helper
__generator | Generic typescript helper
__param | Generic typescript helper

If you spot an error, or a missing helper, please, submit an issue, or a pull request. I you feel inpatient enough, you can always create your own plugin, based on this class [code](https://github.com/fuse-box/fuse-box/blob/master/src/plugins/TypeScriptHelpers.ts)

### Using the plugin

Simple add TypeScriptHelpers to your plugin list. No further configuration required. FuseBox will take care of everything else. To avoid unnecessary AST (which is heavy) this plugin does a simple RegExp, and tests for declarations. It is absolutely safe, and your code is not modified in any way. 

```
const fsbx = require("fuse-box");
let fuseBox = new fsbx.FuseBox({
    homeDir: "test/fixtures/cases/ts",
    outFile: "./out.js",
    plugins: [fsbx.TypeScriptHelpers()]
});

```
### Extended metadata properties 

You can have access to the entire environment of a file, using reflect-metadata. Make sure you have it installed first

```
npm install reflect-metadata
```

Than, include it in your entry point

```
import "reflect-metadata";
```

Now, you can access "commonjs" variables via fusebox metadata property

```
export function testDecorator() {
    return function (target, key: string, descriptor: PropertyDescriptor) {
        Reflect.getMetadata("fusebox:__filename", target, key);
        Reflect.getMetadata("fusebox:__dirname", target, key);
        Reflect.getMetadata("fusebox:require", target, key); // Local "require" function
        Reflect.getMetadata("fusebox:module", target, key);
        Reflect.getMetadata("fusebox:exports", target, key);
    }
}
```
