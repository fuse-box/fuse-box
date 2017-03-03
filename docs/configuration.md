# Configuration

The concept of FuseBox is simple. Bundle anything for frontend and server without a headache. Simply put, you can copy paste a simple config down below and bundle some heavy module like `babel-core` or `babel-generator`. But let's get started and break down all available options in fusebox.

## App Root Path
> We resolve a few relative paths to `appRootPath` for your convenience. Generally it's the folder containing `package.json`.

## Initialisation

Initialise a fuse-box instance like so. Each instance will handle 1 bundle.
```js
FuseBox.init({ /* you config is here */ })
```

## Home directory

That's your _source_ folder. It can be an absolute path, Or relative to [appRootPath](#app-root-path).

```js
FuseBox.init({
  homeDir: "./src",
})
```

* bundling input files are relative to `homeDir`.
* this is the folder that we watch for changes when using the `devServer`.
* this is the folder we check for any `tsconfig.json` (can be changed using the `tsConfig` option).
* see [imports](http://fuse-box.org/#import) for even more available features.


## Out file

That's your _bundle_ file. It can be an absolute path, Or relative to [appRootPath](#app-root-path).

> fuse-box takes care of creating required directory structure for you!

```js
FuseBox.init({
  homeDir: "./src",
  outFile: "./build/bundle.js",
})
```


## Cache

You can turn off caching if you like. By default caching is on. FuseBox will create a folder `.fuse-box` in your project path, and store related files. Don't forget to add it to .gitignore.

> If things go wrong or things are not updating, delete the `.fusebox` folder to force clear the cache.

```js
FuseBox.init({
  homeDir: "./src",
  outFile: "./build/bundle.js",
  cache: true,
})
```

## Debug and Log
Additional logging and debugging can be enabled, but keep in mind they can reduce performance.
```js
FuseBox.init({
  homeDir: "./src",
  outFile: "./build/bundle.js",
  log: true,
  debug: true,
})
```


## Custom modules folder

You probably would want to test a package some day, or just have an abstraction on top of your code. For that, you can use `modulesFolder` property. It behaves exactly the same like another npm module, just in a custom folder.

```js
FuseBox.init({
    modulesFolder: "src/modules",
})
```

You local `npm` will have the highest priority. In essence, you can override fusebox's [path](https://github.com/fuse-box/fuse-box/blob/master/assets/libs/path/index.js) of [fs](https://github.com/fuse-box/fuse-box/blob/master/assets/libs/fs/index.js) module if you like. Customize you packages in your own manner!

You don't need to create `package.json` - `index.js` will work just fine. It will be [cached](#cache) like any other npm module with version `0.0.0`, so remember to toggle cache property in the config


## Package name
You default package name is `default`, You don't need to change it if you are not planning on having isolated bundles.
Any bundle added as a script tag will share `default` package, keep that in mind. If you want to release a package (say to npm), you probably would want set a different name (to avoid scope collision)

It's imperative having a __unique name__ (matching an npm package) when publishing a bundle to NPM.


```js
FuseBox.init({
    package: "mySuperLib",
})
```
If you want to have an entry point (main) file, define it like so:

```js
FuseBox.init({
    package:{
        name: "mySuperLib",
        main: "index.ts",
    },
})
```
If you don't want to you have your package execute on load, make sure your instruction does not have `>` in it.

Here is an example how make a package:
```js
FuseBox.init({
    package: {
        name: "super-name",
        entry: "index.ts",
    },
    homeDir: `/src-package`,
    outFile: `build/packages/super-name.js`,
}).bundle("index.ts")
```


## Global variables

You can expose your package variables to `window` (in browser) and `exports`in node respectively.

```js
FuseBox.init({
    // exposes window.mySuperLib
    globals: { default: "mySuperLib" },
})
```

Whereas key is the name of a package and value is an alias that groups exports. "default" is your current project.

You can also expose your packages exports to `window` or `exports`.

```js
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
[see the SourceMapPlainJsPlugin][#SourceMapPlainJsPlugin]


## List of plugins

`plugins` option expects an array of plugins, See [Plugin API](#plugin-api)
```js
FuseBox.init({
    plugins:[
        fsbx.TypeScriptHelpers(),
        fsbx.JSONPlugin(),
        [fsbx.LESSPlugin(), fsbx.CSSPlugin()],
    ],
})
```

## Plugin chaining

A plugin can be chained. For example, if you want to make SassPlugin work:

```js
FuseBox.init({
    plugins:[
        [fsbx.LESSPlugin(), fsbx.CSSPlugin()],
    ]
})
```

How it works:

FuseBox tests each file running it through the plugin list. If it sees an array, it test for the first Plugin on the list test (which is `.scss` in our case. First element on the list could be a Regular Expression or a [simplified](#simplified-regExp) version of it:

```js

[".scss",fsbx.LESSPlugin(), fsbx.CSSPlugin()] // simple and clean
[/\.scss$/,fsbx.LESSPlugin(), fsbx.CSSPlugin()] // more verbose

```

## Simplified RegExp

FuseBox understands wildcards which are converted to RegExp

For example:

```js
plugins : [
    ["styles/*.css", CSSPlugin({group: "bundle.css"})] // will group files under "styles" folder
    ["components/*.css", CSSPlugin(] // will inline all styles that match components path
]
```

| Simplified RegExp | Compiled RegExp |
| ------------- | ------------- |
| `.css`        | /\.css$/  |
| `*.css$|*.js$`  | /\w{1,}\.css$|\w{1,}\.js$/  |
| `components/*.css`  | /\w{1,}\.css$|\w{1,}\.js$/  |
| `components/*.(css|scss)` | /components\/\w{1,}\.(css|scss)$/



## Auto import

If you are into black magic, this API is for you.

```js
FuseBox.init({
    autoImport: {
        Inferno: "inferno",
    },
})
```
Whereas the key `Inferno` (uppercase) is a variable name, and `inferno` (lowercase) is a require statement.

You code is being analysed for variable declarations. If you use the `Inferno` variale in your code in any way but declaring it,
FuseBox will inject the require statement `var Inferno = require("inferno")`

Example:
```js
Inferno.doMagic()
```

Will result in:

```js
var Inferno = require("inferno");
Inferno.doMagic()
```

However `var Inferno = {};` will do nothing.


## Alias
If you are coming from WebPack this feature might be helpful.

> Alias is an experimental feature; the API might change in the feature.
> using Alias breaks sourcemaps of a file where it's being used as it is required to re-generated the source code (this will be fixed soon)

```js
FuseBox.init({
    alias: {
        "faraway": "~/somewhere/far/away/",
    },
})
```

* The tilde is required to resolve your `homeDir`
* Aliases will not work with absolute paths (it goes against the concept of FuseBox)

You can also alias npm packages:

```js
FuseBox.init({
    alias: {
        "babel-utils": "babel/dist/something/here/utils",
    },
})
```

In your code, you would use it in a way similar to this:
```js
import utils from "babel-utils"
import faraway from "faraway"

console.log(utils, faraway);
```

Behind the scenes, (assuming the previous code block is `homeDir/src/index.js`) this code is actually transformed into:
```js
import utils from "../node_modules/babel/dist/something/here/utils"
import faraway from "../somewhere/far/away/"

console.log(utils, faraway);
```

## Shimming

For those libraries that are bundled to work in `window` (jquery) for example, you need to provide a shimming configuration.
FuseBox will not do analysis on that file, it will simply add it to the top of the bundle.

```js
FuseBox.init({
   shim: {
        jquery: {
            source: "node_modules/jquery/dist/jquery.js",
            exports: "$",
        },
   }
});
```

You can remove `source` option if you load a library using the script tag (for example from a CDN). After it has been shimmed,
you can use FuseBox API, or import/require statement to obtain it.

```js
import * as foo from "jquery"
console.log(foo);
```

The key `jquery` in our case is used to define package name: for example, you can replace `jquery` with `foo` and use `import "foo"` to get a jquery instance.

Example shim config:
```js
shim: {
   "react-native-web": { exports: "require('react-native')"},
}
```
Now you can reference it like  `window.ReactNative`, and require function is at your convenience.

Important to note, shims will not be analyzed, which means they should be transpiled before importing, or imported into an environment that does not need them to be transpiled. Shimming works similar to [requirejs](http://requirejs.org/) and [jspm](http://jspm.io/).

For an example, see [shimming in the fuse config](https://github.com/fuse-box/shimming-and-css-example/blob/master/fuse.js#L7) and [how it can be accessed in your code](https://github.com/fuse-box/shimming-and-css-example/blob/master/src/index.ts#L4)


## Server Bundle


In case you are running your bundle in `electron` for example,
you might want to make fuse think that it is running on server.

```js
FuseBox.init({
    serverBundle: true,
})
```
> Use it ONLY for electron environment. This is a very special case that allows FuseBox to be run in browser but behave as if it's running on server.

Don't run that bundle in a traditional browser.




## Full Config
An example using the available config options might look similar to:
```js
// remember, unless you transpile your fuse.js, es6 will not work in your fuse.js
// so using `require` is the easiest. 
// destructuring with `require` is supported with the current node version.
//
// importing can also be done with the syntax:
// import {FuseBox, BabelPlugin} from "fuse-box"
import fsbx from "fuse-box"
const FuseBox = fsbx.FuseBox

const config = {
  homeDir: "./src",
  outFile: "./build/bundle.js",
  log: true,
  debug: true,
  plugins:[
    fsbx.BabelPlugin({
      // test is optional
      // this would make it only parse `.jsx` files
      // it defaults to `js` and `jsx`
      test: /\.jsx$/,

      // if no config is passed in,
      // it will use the .babelrc closest to homeDir
      config: {
        "sourceMaps": true,
        "presets": ["latest"],
        "plugins": [
          "transform-react-jsx",
          "transform-object-rest-spread",
          "transform-decorators-legacy",
          "transform-class-properties",
          "add-module-exports",
        ],
      },

      // this is default `true`
      // setting this to false
      // means babel will parse _all imported node modules_
      limit2project: true,
    }),

    fsbx.TypeScriptHelpers(),
    fsbx.JSONPlugin(),
    fsbx.HTMLPlugin({ useDefault: false })

    // these css plugins are chained
    [
      fsbx.LESSPlugin(),
      fsbx.CSSPlugin({
        // file is the file.info.absPath
        // more info on that in the `Plugin API` section
        outFile: (file) => `./tmp/${file}`
      })
    ],

    fsbx.SourceMapPlainJsPlugin(),
  ],

  shim: {
    "react-native-web": {
      exports: `require("react-native")`,
    },
  },

  alias: {
    // node modules
    "babel-utils": "babel/dist/something/here/utils",

    // homeDir
    "faraway": "~/somewhere/far/away/",
  },

  // this works in a similar way to how things such as `process.env`
  // are automatically added for the browser
  autoImport: {
    // used any time we do `Inferno.anything` in the source code
    Inferno: "inferno",
  },

  // is for the package `canadaEh`
  // will export everything that your entry point
  // think of it as `entry point exports`
  // and it also adds the exports to `global` or `window`
  globals: { "canadaEh": "*" },

  // package can just be a string naming your package
  package: {
    // name must be unique
    name: "canadaEh",
    // main is optional, it is used as an optional entry point
    main: "index.ts",
  },

  sourceMap: {
    bundleReference: "sourcemaps.js.map",
    outFile: "sourcemaps.js.map",
  },
}

if (process.env.NODE_ENV === 'production') {
  // [options] - UglifyJS2 options
  const prodPlugins = [
    fsbx.UglifyJSPlugin(options),
    fsbx.EnvPlugin({ NODE_ENV: "production" }),
  ]
  config.plugins = config.plugins.concat(prodPlugins)
}

// this is the same as
// const fuse = new FuseBox(config)
const fuse = FuseBox.init(config)

// --- bundling

let frontEndDev = true
let vendors = [
  'commander',
  'tosource',
  'flipbox',
  'path',
  'fs',
]
const vendorInst = "[async-registry.js]" + vendors.map(vendor => ' +' + vendor).join('')
const appInst = ">[index.ts]" + vendors.map(vendor => ' -' + vendor).join('')

const multipleBundles = {
    "./build/vendorBundle.js": vendorInst,
    "./build/appBundle.js": appInst,
}

const singleBundle = `
    > [index.ts]
    + [**/*.html]
    + [**/*.js]
    + [**/*.ts]
    + [**/*.css]
`

if (frontEndDev) fuse.devServer(singleBundle)
else fuse.bundle(multipleBundles)

```
