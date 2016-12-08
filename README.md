[![Build Status](https://travis-ci.org/fuse-box/fuse-box.svg?branch=master)](https://travis-ci.org/fuse-box/fuse-box)
  
# FuseBox - A Bundle that does it right

> The library is under heavy development. We are getting there. Documentation is coming soon.
> FuseBox beats any bundler/loader (webpack, jspm) by performance and convenience, and bundles any library on the Internet without additional configuration. So please, be be patient

## Bundler

You can bundle any library without extra condiguration. (babel-core, cheerio, etc) 
So a confuguration is minimalist. All node modules (at least the most cricial ones) will be bundled for browser (Buffer, path e.t.c) So you don't need to stress about whether you bundle will work in browser. IT WILL.

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

# Examples

## Example1: Bundle typescript!

```js
let fuseBox = new FuseBox({
    homeDir: "test/fixtures/cases/ts",
    sourceMap: {
        bundleReference: "./sourcemaps.js.map",
        outFile: "sourcemaps.js.map",
    },

    cache: true,
    globals: {defaut : "myLib"},
    outFile: "./out.js",
});

fuseBox.bundle(">index.ts");
```


## Bundle react app!
```js
let fuseBox = new FuseBox({
    cache: false,
    homeDir: "test/fixtures/cases/react-demo",
    sourceMap: {
        bundleReference: "./sourcemaps.js.map",
        outFile: "sourcemaps.js.map",
    },
    outFile: "./out.js",
    plugins: [build.SVGPlugin, new build.CSSPlugin(), new build.BabelPlugin({
        test: /\.jsx$/,
        config: {
            sourceMaps: true,
            presets: ["es2015"],
            plugins: [
                ["transform-react-jsx"]
            ],
        }
    })]
});

fuseBox.bundle(">index.jsx +react-dom");
```

## Arithmetic options


`> index.js [**/*.js]` - Bundle everything without dependencies, and execute index.js

`[**/*.js]` - Bundle everything without dependencies

`**/*.js` - Bundle everything with dependencies

`**/*.js -path` - Bundle everything with dependencies except for path



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
    plugins: [fsbx.TypeScriptHelpers]
});

```
### Additional meta data in the decorator

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
