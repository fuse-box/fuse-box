# Configuration

The concept of FuseBox is simple. Bundle anything for frontend and server without a headache. Simply put, you can copy paste a simple config down below and bundle some heavy module like `babel-core` or `babel-generator`. But let's get started and break down all available options in fusebox.

> App Root Path: We resolve a few relative paths to `appRootPath` for your convenience. Generally it's the folder containing `package.json`.

## Initialisation

Initialise a fuse-box instance like so. Each instance will handle 1 bundle.
```js
FuseBox.init({ /* you config is here */ })
```

## Home directory

That's your source folder. It can be an absolute path, Or relative to `appRootPath`.

```js
FuseBox.init({
  homeDir : "./src"
})
```

* bundling input files are relative to `homeDir`.
* this is the folder that we watch for changes when using the `devServer`.
* this is the folder we check for any `tsconfig.json` (can be changed using the `tsConfig` option).

## Out file

That's your bundle file. It can be an absolute path, Or relative to `appRootPath`.

> fuse-box takes care of creating required directory structure for you!

```js
FuseBox.init({
  homeDir : "./src",
  outFile : "./build/bundle.js"
})
```

## Cache

You can turn off caching if you like. By default caching is on. FuseBox will create a folder `.fuse-box` in your project path, and store related files. Don't forget to add it to .gitignore.

```js
FuseBox.init({
  homeDir : "./src",
  outFile : "./build/bundle.js",
  cache : true
})
```

## Custom modules folder

You probably would want to test a package some day, or just have an abstraction on top of your code. For that, you can use `modulesFolder` property. It behaves exactly the same like another npm module, just in a custom folder.

```
FuseBox.init({
    modulesFolder: "src/modules"
})
```

You local `npm` will have the highest priority. In essence, you can override fusebox's [path](https://github.com/fuse-box/fuse-box/blob/master/assets/libs/path/index.js) of [fs](https://github.com/fuse-box/fuse-box/blob/master/assets/libs/fs/index.js) module if you like. Customize you packages in your own manner!

You don't need to create `package.json` - `index.js` will work just fine. It will be [cached](#cache) like any other npm module with version `0.0.0`, so remember to toggle cache property in the config


## Package name
You default package name is `default`, You don't need to change it if you are not planning on having isolated bundles.
Any bundle added as a script tag will share `default` package, keep that in mind. If you want to release a package (say to npm), you probably would want set a different name (to avoid scope collision)

It's imperative having a __unique name__ (matching an npm package) when publishing a bundle to NPM.


```
FuseBox.init({
    package: "mySuperLib"
})
```

## Global variables

You can expose your package variables to `window` (in browser) and `exports`in node respectively.

```
FuseBox.init({
    // exposes window.mySuperLib
    globals: { default: "mySuperLib" },
})
```

Whereas key is the name of a package and value is an alias that groups exports. "default" is your current project.

You can also expose your packages exports to `window` or `exports`.

```
// assuming mySuperLib exports a "handler" and "logger" property

FuseBox.init({
    // exposes window.superHandler
    globals: { "mySuperLib": { "handler": "superHandler"} },

    // OR
    // exposes window.handler and window.logger
    globals: { "mySuperLib": "*" },
})

```

Please, note, that in order to expose your package, a bundle must have a [package name](#package-name)

## Sourcemaps

Sourcemaps in FuseBox are enabled by adding this property to a fusebox init configuration

```js
sourceMap: {
  bundleReference: "sourcemaps.js.map",
  outFile: "sourcemaps.js.map",
}
```
* `bundleReference` speaks for itself. This line will be added to the bundle. For example `//# sourceMappingURL=./sourcemaps.js.map`. If your client is not able to read them, make sure that the path is reachable.
* `outFile` is where the sourcemap is written to disk. It can be an absolute path, Or relative to `appRootPath`.

Sourcemaps currently work with [typescript](#typescript) and [BabelPlugin](#babel-plugin)

## List of plugins

`plugins` option expects an array of plugins, See [Plugin API](#plugin-api)
```
FuseBox.init({
    plugins:[
        build.TypeScriptHelpers(),
        build.JSONPlugin(),
        [build.LESSPlugin(), build.CSSPlugin()],
    ]
})
```

## Shimming

For those libraries that are bundled to work in `window` (jquery) for example, you need to provide a shimming configuration.
FuseBox will not do analysis on that file, it will simply add it to the top of the bundle.

```
FuseBox.init({
   shim: {
        jquery: {
            source: "node_modules/jquery/dist/jquery.js",
            exports: "$"
        }
   }
});
```

You can remove `source` option if you load a library using the script tag (for example from a CDN). After it has been shimmed,
you can use FuseBox API, or import/require statement to obtain it.

```
import * as foo from "jquery"
console.log(foo)
```

The key `jquery` in our case is used to define package name: for example, you can replace `jquery` with `foo` and use `import "foo"` to get a jquery instance.

If you are coming from `Webpack` this also could be used to behave like the Aliasing Feature in `Webpack`, so the equivalent of the below in `Webpack`
```
alias: { 'react-native': 'react-native-web' }
```
would be
```
shim : {
   "react-native-web" : { exports : "require('react-native')"}
}
```
Now you can reference it like  `window.ReactNative`, and require function is at your convenience.

## Server Bundle


In case you are running your bundle in `electron` for example,
you might want to make fuse think that it is running on server.

```
FuseBox.init({
    serverBundle : true
})
```
> Use it ONLY for electron environment. This is a very special case that allows FuseBox to be run in browser but behave as if it's running on server.

Don't run that bundle in a traditional browser.
