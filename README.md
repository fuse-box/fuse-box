[![Build Status](https://travis-ci.org/fuse-box/fuse-box.svg?branch=master)](https://travis-ci.org/fuse-box/fuse-box)
[![Fusebox-bundler](https://badges.gitter.im/owner/repo.png)](https://gitter.im/fusebox-bundler/Lobby)

# FuseBox

> The library is under heavy development. We are getting there. The API is stable. Documentation is in progress.
> Join now! FuseBox is open for testing! Submit an issue, or poke me here `window.atob("c2t5cGU6bmNoYW5nZWQ=")`

## A heroic bundler, that just does it right

FuseBox is a bundler/module loader that combines the power of webpack, JSPM and SystemJS. It is blazing fast (it takes 50-100ms to re-bundle) which makes it extremely convenient to develop. It requires zero configuration to bundle such monsters like `babel-core`, it will compile and bundle your typescript project within a fraction of a second when offering a comprehensive loader API.

* Say no to painful "get started"!
* Say no to huge configs!
* Say no to heavy boilerplates!
* Say no to waiting for your code to rebundle!

[angular2-example](https://github.com/fuse-box/angular2-example) 50ms to re-bundle!

[react-example](https://github.com/fuse-box/react-example) 50ms to re-bundle!

## Why fusebox?

### Bundle anything without an extra effort
You have an npm library in mind? You can bundle it without any extra configuration. babel-core with all plugins? No problem, fusebox will take care of everything you need.

All node modules (at least the most critical ones) will be bundled for browser (Buffer, path e.t.c) So you don't need to stress about whether you bundle will work in the browser. IT WILL.

There is nothing that cannot be fused. Create a 3 liner config and bundle some heavy project! Do conventional import statements, use shared bundles, hack API, create crazy plugins!

### It is blazing fast

Fusebox is super fast. 50ms for a regular project, 100ms for a big project to re-bundle. It applies aggressive but responsible module caching, which makes it fly.

Check this [benchmark](https://github.com/fuse-box/benchmark):

1200 files to bundle

|         |            |
| ------------- |:-------------:| 
| FuseBox      | 0.234s |
| Webpack      | 1.376s |


1000 files to bundle / 10 times

|         |            |
| ------------- |:-------------:| 
| FuseBox      | 2.257s |
| Webpack      | 13.591s |


### Built-in typescript support.

FuseBox is written in typescript, so I could not just proceed without a seamless typescript intergration. In fact, you don't need to configure anything! Just point it to a typescript file, and FuseBox will do the rest.

```js
fuseBox.bundle(">index.ts");
```

### Comprehensive Loader API

Whatever you tempted mind would want - you can get it all here. Apply hacks, intercept require statements, use an amazing dynamic module loading, and many many other neat features!
 
### Extensive plugins

Have an idea in mind? Just develop a plugin, it's extremely easy to make one. Besides, we have [a few plugins](#built-in-plugins), that will help you get started. Want to develop one? Read-up [here](#plugin-api)


## How FuseBox works?!

The idea of FuseBox was born, when started struggling with webpack. It is slow, and it did not deliver required functionality. On another hand, jspm did what I wanted, but still it was not something I would go for. So I decided to combine both and create my own version that has a power of both bundlers combined. 

### Static analysis (acorn)
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


# Let's Fuse

## Simplicity is the key

The concept of FuseBox is simple. Bundle anything for frontend and server without a headache. No configuration required! However if you like to get your hands dirty, and create your own custom stuff - off you go - FuseBox is very flexible.

You can point your files to a typescript file or to a javascript file. It will understand `es6` import statements as well. You need, however, use [BabelPlugin](#babel-plugin) to transpile it.


## Typescript

Typescript does not require any external plugin or configuration. Just make sure you have typescript compiler installed

```bash
npm install typescript --save-dev
```

Now let's define a simple configuration

```js
FuseBox.init({
    homeDir: "src/",
    sourceMap: {
         bundleReference: "./sourcemaps.js.map",
         outFile: "sourcemaps.js.map",
    },
    outFile: "./out.js"
}).bundle(">index.ts");
```

FuseBox automatically switches to a typescript mode and compiles your files. Place `tsconfig.json` in your `homeDir`. It will be loaded automatically. For your own convenience add [Typescript helpers](#typescript-helpers) plugin.

## Export from bundle

You can easily export any library from your bundle to window/module.exports accordingly.
Simply add this property:

```js
globals: { default: "myLib", "wires-reactive": "Reactive" }
```

Whereas key is the name of a package and value is an alias that groups exports.
"default" is your current project. Please, note, that in order to expose your default package, a bundle must have an entry point.

Full example:

```js
FuseBox.init({
    homeDir: "src/",
    globals: { default: "myLib"},
    outFile: "./out.js"
}).bundle(">index.js");
```

## Arithmetic

With arithmetic instructions you can explicitly define which files go to the bundle, which files skip external dependencies.

For example.
```js
fuseBox.bundle(">index.ts [lib/**/*.ts]");
```

In this case, you will get everything that is required in the index, as well as everything that lies under lib/ folder with one condition - any external libraries will be ignored. 

`> index.js [**/*.js]` - Bundle everything without dependencies, and execute index.js

`[**/*.js]` - Bundle everything without dependencies

`**/*.js` - Bundle everything with dependencies

`**/*.js -path` - Bundle everything with dependencies except for module path

# A bundle in a bundle in a bundle

Yes! You can do that!

Super powers of FuseBox allow to do that without code redundancy. An API of a second bundle will be removed, and 2 bundles will be fused together, keeping only one shared Fusebox API.

Only one thing you need to consider before that - packaging.

You current project is called "default" This is by design. All dynamic modules will register themselves into it automatically. 
If you want to require a bundle it must have a different namespace. Unless you want to keep is shared. Add `package` property to the initializer:

```js
FuseBox.init({
    homeDir: "src/",
    package : "myLib",
    outFile: "./bundles/myLib.js"
}).bundle(">index.js");
```

Bundle your first package, then make sure you master bundle does not have the same name (otherwise they will share filename scopes) and require it like any other file

```
import * as myLib from "./bundles/myLib.js"
```

FuseBox sniffs its own creations and restructures the code accordingly.

## Local npm packages

You probably would want to test a package some day, or just have an abstraction on top of you code. For that, you can use `modulesFolder` property. It behaives exactly the same like another npm module, just in a custom folder. 

```
FuseBox.init({
    modulesFolder: "src/modules"
})
```

You local `npm` will have the highest priority. In essenence, you can override fusebox's [path](https://github.com/fuse-box/fuse-box/blob/master/assets/libs/path/index.js) of [fs](https://github.com/fuse-box/fuse-box/blob/master/assets/libs/fs/index.js) module if you like. Customize you packages in your own manner!

# Loader API

## How the loader works?

Well, it's pure magic - nodejs wrapper for browser. FuseBox wrapper provides 100% compatible nodejs ecosystem,  having `virtual files` and `virtual packages`. Everything is regisered and shared by the API. It means, that you can have two script tags that will fuse and merge each other.

Plugins inject dependant packages/javascript code, that becomes a part of FuseBox loader. In principal, a plugin might work at build time and runtime, which unfolds some crazy optimisation possibilities. 

FuseBox bundle works in both environments. Essentially, it does not matter where you run it. FuseBox will persist itself in browser window, or nodejs globals.

Every bundle contains a 3.7k footer with FuseBox API (1,6KB gzipped).  


## Import
Import is 100% compatible with commonjs specification. You can require folders, skip file extensions (fusebox will guess it).
```js
FuseBox.import("./foo/bar");
```
Requre external packages will work  as well

```js
FuseBox.import("fs");
```

Please, not, that some libraries like "fs" are faked in browser. Meaning that it won't spit an error, but won't work as expected on server for known reasons.
Nodejs environment, however, will get authentic "fs" module. (Concerns http, net, tty e.t.c )

## Lazy import

FuseBox offers lazy module loading via ajax. The way it works is that FuseBox check for a module available in bundle, if it's not found it tries to make HTTP request. It respects runtime plugin hooks and other fusebox bundles as well.
```
FuseBox.import("./myfile.js", (moduleExports) => {
});
```

Respectively, one can require a css file that was not bundled. Having the [CSSPlugin](#css-plugin) installed will result in appending filepath to the body head.

## Exists

You can check wether a module (file) exists in scope.
```js
FuseBox.exists("./index")
```

## Dynamic

Like SystemJS FuseBox provides a hacky way of creating a dynamic module from a string. After it has been initialized it shared 100% the same environment and behaves accordingly.

```
FuseBox.dynamic("stuff/boo.js", "module.exports = {hello : 'dynamic'}; require('./foo')")
```
A bundle can reference "stuff/boo.js" once a dynamic module was initialized.

## FuseBox events

It is possible to intercept require statements. You can catch "before-import" and "after-import" events like so:

```
FuseBox.on("before-import", (exports, require, module, __filename, __dirname, pkg) => {                
});

FuseBox.on("after-import", (exports, require, module, __filename, __dirname, pkg) => {                
});
```

It is not recommended, however, if you want to play god, you can use that functionality.

## Point to the root
You can use `~` symbol to point to your project's path in order to solve `../../../../../utils` mess.

```js
// es5
require("~/lib/utils")
// es6
import * as utils from "~/lib/utils";
```

# Built-in plugins

Fusebox contains premade plugins, that should help you to get started. 

## CSS Plugin

It's very to start working css files You have 2 options, you either bundle the contents or serve files. A decision can be made at build time.

For example:
```
plugins: [
    fsbx.CSSPlugin({
        minify: true
    })
]
```

In this case, all css files will be bundled.

But if you define "serve" option with a callback, all files will be filtered through it. A callback is expected to return a string with a browser path. If you return "undefined" or *NOT* a string, that file will be bundled as if no option was specified.

All css files will be served by server.
```
plugins: [
    fsbx.CSSPlugin({
        minify: true,
        serve: path => `./${path}`
    })
]
```

All files will be served except for "styles.css" (contents will be included in the bundle)
```
plugins: [
    fsbx.CSSPlugin({
        minify: true,
        serve: path => path === "styles.css` ? 0 : ./${path}`
    })
]
```

On top of that a css file will added to DOM upon request if not found in the bundle.

## HTML Plugin

```
plugins: [
  fsbx.HTMLPlugin({ useDefault: false })
]
```

Toggle `useDefault` to make html files export strings as `default` property.
For example with `useDefault: true` you will be able to import HTML files like so :

```
import tpl from "~/views/file.html"
```

## Babel plugin

You can use babel plugin to transpile your code. 
Make sure you have `babel-core` installed

```bash
npm install babel-core babel-preset-es2015 babel-plugin-transform-react-jsx
```
For example. to transpile JSX, you can use this configuration. 
```
 plugins: [
    fsbx.BabelPlugin({
        test: /\.jsx$/,
        config: {
            sourceMaps: true,
            presets: ["es2015"],
            plugins: [
                ["transform-react-jsx"]
            ]
        }
    })
]
```
Note, that if you want to have sourcemaps in place, set `sourceMaps` to true. Read sourcemaps section for better understanding how sourcemaps are defined.

## Typescript helpers

A very handy plugin, adds required typescript functions to the bundle. Please, note, that it adds only the ones that are actually used. So you won't be seeing an unnecessary code.

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

If you spot an error or a missing helper, please, submit an issue, or a pull request. If you feel impatient enough, you can always create your own plugin, based on this class [code](https://github.com/fuse-box/fuse-box/blob/master/src/plugins/TypeScriptHelpers.ts)

### Using the plugin

Simple add TypeScriptHelpers to your plugin list. No further configuration required. FuseBox will take care of everything else. To avoid unnecessary AST (which is heavy) this plugin does a simple RegExp, and tests for declarations. It is absolutely safe, and your code is not modified in any way. 

```
const fsbx = require("fuse-box");
let fuseBox = fsbx.FuseBox.init({
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

# Sourcemaps

Sourcemaps in FuseBox are enabled by adding this property to a fusebox init configuration

```js
sourceMap: {
  bundleReference: "sourcemaps.js.map",
  outFile: "sourcemaps.js.map",
}
```
`bundleReference` speaks for itself. This line will be added to the bundle. For example `//# sourceMappingURL=./sourcemaps.js.map`. If your client is not able to read them, make sure that the path is reachable. 

Sourcemaps currently work with [typescript](#typescript) and [BabelPlugin](#babel-plugin)

# Plugin API

Let's take a look a plugin's interface first

```typescript
interface Plugin {
    test?: RegExp;
    dependencies?: string[];
    init: { (context: WorkFlowContext) };
    transform: { (file: File) };
    bundleStart?(context: WorkFlowContext);
    bundleEnd?(context: WorkFlowContext);
}
```

### test [RegExp]

Defining `test` will filter files into your plugin. For example `\.js$ `



