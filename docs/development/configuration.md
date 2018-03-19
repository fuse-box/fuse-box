# Configuration

The concept of FuseBox is simple. Bundle anything for frontend and server without a headache. Simply put, you can copy paste a simple config down below and bundle some heavy module like `babel-core` or `babel-generator`. But let's get started and break down all available options in fusebox.

## Initialisation

Initialise a fuse-box instance like so.
```js
FuseBox.init({ /* you config is here */ })
```

## Home directory

That's your _source_ folder. FuseBox locks your project to it. FuseBox will resolve it relatively your `fuse.js` file location

```js
FuseBox.init({
  homeDir: "src/",
})
```

files:
node_modules
 placeholder.js
stuff
 src
  index.ts
 fuse.js



In the example above your `homeDir` will be pointing to `stuff/src` next to `fuse.js` file.

note: it's not recommended using absolute paths. It reduces readability


## Output

Output is a string which is used by FuseBox to determine where and how to place your bundles in the file system.

```js
FuseBox.init({
  homeDir: "src",
  output: "build/$name.js",
})
```

There are few macros available.

| Name  | Description |
| ------------- | ------------- |
| $name  | The name of your bundle  |
| $hash  | Applying hash when available  |

`$hash` is used when the hash option is set, otherwise it will be removed. FuseBox will create folders automatically, so you don't need to worry if a folder is present. FuseBox will also tolerate an absence of `$name` macro, converting it internally into a template

For example this:

```js
 output: "build/out.js"
```

Will be converted accordingly to:

```js
 output: "build/$name.js"
```

However it is strongly recommended to use `$name` in your output template, as `out.js` will be ignored

## stdin

Listens to stdin.

Combinations like `CMD+D` will gracefully shut down any process.

## Cache

You can turn off caching if you like. By default caching is on. FuseBox will create a folder `.fusebox` in your project path, and store related files. Don't forget to add it to .gitignore.

note: If things go wrong or things are not updating, delete the `.fusebox` folder to force clear the cache.

```js
const fuse = FuseBox.init({
  homeDir: "src",
  output: "build/$name.js",
  cache: true
})
```

Alternatively, you can disable cache by using chainable API

```js
fuse.bundle("app")
    .cache(false)
    .instructions("> index.ts")
```

## Debug

Additional debugging can be enabled, but keep in mind they can reduce performance.
```js
const fuse = FuseBox.init({
  homeDir: "src",
  output: "build/$name.js",
  debug: true
})
```

## Log

Log output can be customized using the `log` option:
```js
const fuse = FuseBox.init({
  log: {
      showBundledFiles: false, // Don't list all the bundled files every time we bundle
      clearTerminalOnBundle: true, // Clear the terminal window every time we bundle
  }
})
```

These options are useful for seeing only the things you are interested in when developing incrementally using `.watch`.

You can also disable logging completely:
```js
const fuse = FuseBox.init({
  log: {
      enabled: false
  }
})
```

## Custom modules folder

You probably would want to test a package some day, or just have an abstraction on top of your code. For that, you can use `modulesFolder` property. It behaves exactly the same like another npm module, just in a custom folder.

```js
FuseBox.init({
    modulesFolder: "modules",
})
```


You local `npm` will have the highest priority. In essence, you can override fusebox's [path](https://github.com/fuse-box/fuse-box/blob/master/modules/path/index.js) of [fs](https://github.com/fuse-box/fuse-box/blob/master/modules/fs/index.js) module if you like. Customize you packages in your own manner!

files:
modules
 foo
  index.js
src
 index.ts

You don't need to create `package.json` - `index.js` will work just fine. It will be [cached](#cache) like any other npm module with version `0.0.0`, so remember to toggle cache property in the config


## tsConfig

A path to typescript configuration `tsconfig` can be overridden like so:

```js
FuseBox.init({
    tsConfig : "src/myconfig.json"
})
```


Or using the chain API

```js
fuse
    .bundle("app")
    .tsConfig("src/myconfig.json")
```

You can also override any values by providing an array with a single object


```js
FuseBox.init({
    tsConfig : [{ target : `es5` }]
})
```


## TypeScript Custom Transformers

TypeScript custom transformers can be specified like so:

```js
const infernoTransformer = require("ts-transform-inferno").default;

FuseBox.init({
    transformers: {
        before: [infernoTransformer()]
    }
});
```

note: TypeScript 2.4+ is required for custom transformers.

## Package Name
Your default package name is `default`. You don't need to change it if you are not planning on having isolated bundles.
Any bundle added as a script tag will share the `default` package, keep that in mind. If you want to release a package (say to NPM), you probably would want set a different name (to avoid scope collision)

It's imperative to have a __unique name__ (matching an npm package) when publishing a bundle to NPM.


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
note: If you don't want to have your package execute on load, make sure your instruction does not have `>` in it.

Here is an example how make a package:
```js
const fuse = FuseBox.init({
    homeDir: `src-package`,
    outFile: `build/$name.js`,
    package: {
        name: "super-name",
        entry: "index.ts",
    },
});
fuse.bundle("app").instructions("index.ts")
```


## Global Variables

You can expose your package variables to `window` (in browsers) or `exports` (in Node).

```js
FuseBox.init({
    // exposes window.mySuperLib
    globals: { default: "mySuperLib" },
})
```

<!--Whereas key is the name of a package and value is an alias that groups exports. "default" is your current project.-->
Each key in the `globals` hash is the name of a package, and its value is an alias that groups exports. "default" is your current project.

You can also expose your package's exports to `window` or `exports`.

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

You can use the chainable API if you like:

```js
fuse.bundle("app").globals(/* configuration */)
```

note: In order to expose your package, a bundle must have a [package name](#package-name)

To see it in action, clone [this](https://github.com/fuse-box/fuse-box-globals-example) repository

```bash
git clone https://github.com/fuse-box/fuse-box-globals-example
npm install
node fuse
```

## Hash

Hashing is enabled by adding a `hash` property and setting it to `true`.

Make sure you checked the [output](#output) section.

```js
FuseBox.init({
    hash : true
})
```

There are 2 ways to get to the generated file names





### Hashes and WebIndexPlugin

Use [Web Index Plugin](/plugins/web-index-plugin#webindexplugin) which will take care of everything. Generated files names will be in your script tags
```js
WebIndexPlugin({
    title: "My awesome website",
})
```

### Hashes and bundles

You can retrieve bundle names from a [producer](/page/bundle#producer) like so:

```js
fuse.run().then(producer => {
    producer.bundles.forEach((bundle, name) => {
       bundle.output.lastPrimaryOutput.filename
    });
})
```
lastPrimaryOutput contains the following information

| Property  | Description |
| ------------- | ------------- |
| `path`  | Full path to the file  |
| `hash`  | Generated hash  |
| `filename`  | Filename  |




## useJsNext
If this option is `true` FuseBox will take "json:next" or "module" properties from `package.json` if available

```js
FuseBox.init({
    useJsNext : true
})
```

Alternatively you can pass a array of strings telling FuseBox which modules should try for js:next

```js
FuseBox.init({
    useJsNext : ["antd"]
})
```

## useTypescriptCompiler

You can transpile normal javascript with typescript compiler. All you need to do is toggle this flag
```js
FuseBox.init({
    useTypescriptCompiler : true
})
```

And install typescript

```
npm install typescript --save-dev
```
## allowSyntheticDefaultImports

Based on TypeScript standard `allowSyntheticDefaultImports`.

Can be set via `FuseBox.init` or in `tsconfig.json` directly.

Using tsconfig:

```json
{
  "compilerOptions" : {
    "allowSyntheticDefaultImports" : true
  }
}
```

Using FuseBox.init

```js
FuseBox.init({
    allowSyntheticDefaultImports : true
})
```



That will allow doing the following

```js
import React from "react";
```

## polyfillNonStandardDefaultUsage
 
Deprecated in favour of [allowSyntheticDefaultImports](#allowSyntheticDefaultImports)

The problem with `polyfillNonStandardDefaultUsage` is that it adds an additional line of code in each file, polluting the build. `allowSyntheticDefaultImports` will be baked into the API and will work out of the box.

Development API (without Quantum) will always have it enabled, Quantum, however, will require the option toggled.

`polyfillNonStandardDefaultUsage` will display a warning, setting `allowSyntheticDefaultImports`. No breaking changes will occur.


## writeBundles

If you wish to write bundles yourself, set
```js
FuseBox.init({
    writeBundles : false
})
```
Then in your `fuse.js` add the following code:
```js
fuse.run().then(producer => {
    producer.bundles.forEach(bundle => {
        console.log(bundle.context.output.lastPrimaryOutput);
    });
})
```

`lastPrimaryOutput` will contain all the information you might require

## Sourcemaps

Project in FuseBox are enabled by setting the `sourceMaps` property and setting it to `true`:

```js
FuseBox.init({
    sourceMaps: true
})
```

If you want to customize the location of inlined source maps provide the following option

```js
FuseBox.init({
    inlineCSSPath : "client/css-resources/maps"
})
```


You can also provide an object to the `sourceMaps` property and then choose between project _and_ vendor sourcemaps:

```js
FuseBox.init({
    sourceMaps: { project: true, vendor: true }
})
```

`sourceMaps` can also be configured via the chainable API:

```js
fuse.bundle("app").sourceMaps(true)
```

Sourcemaps currently work with typescript, BabelPlugin and SourceMapPlainJsPlugin

### Hosting source files

By default FuseBox inlines sources, that can be changed

```js
FuseBox.init({
    sourceMaps: { inline: false }
})
```

If you want to serve your sourcemaps from the `homeDir`, you can use `sourceRoot`property to define the route mapped to your development server. The default value is `src/`

```js
FuseBox.init({
    sourceMaps: { inline: false, sourceRoot : "/sources" }
})
```

note: Don't put a slash at the end with sourceRoot

## Target

You can define target, along with ecmascript version.

```js
FuseBox.init({
    target : "browser"
})
```

### Target Browser
Target browser enables `browser` field in `package.json`. Once set, FuseBox will try to read that field and override paths accordingly.

### Target server
Will ignore FuseBox' polyfills as native modules are available without them.

### Target electron

Electron specific environment

### Language Level

FuseBox uses typescript for modules that are not transpiled.
For example you can require a file from `super-lib/dist/es7` and it will be recognised as a module that requires transpilation. `imports` will be converted to a format that FuseBox understands, in our case `require`. But it might transpile and polyfill unwanted features, like `async` for server target.

Use `@` symbol to define language level

```js
FuseBox.init({
    target : "server@esnext"
})
```

Possible levels

* es5
* es2015 (alias: es6)
* es2016 (alias: es7)
* es2017
* esnext

Aliases `es6` & `es7` are provided to align with the configuration options of TypeScript, but we recommend using the es-year form instead.

The default language level is `es2016`


### Example
```bash
git clone https://github.com/fuse-box/fuse-box-electron-seed.git
npm install
npm start
```

It's planned to introduce `browser` and `server` target that would affect the build. At this very moment, your builds are universal, that means that you can execute them on browser and on server accordingly.

## Simplified RegExp

FuseBox understands wildcards which are converted to RegExp

For example:

```js
plugins : [
    ["styles/*.css", CSSPlugin({group: "bundle.css"})] // will group files under "styles" folder
    ["components/*.css", CSSPlugin()] // will inline all styles that match components path
]
```

| Name  | Description |
| ------------- | ------------- |
| `.css`  | Matches all files ending with .css  |
| `components/*.css`  | Matches all css files in components folder  |
| `components/**.css`  | Matches all css files in components and under  |


## Auto import

If you are into black magic, this API is for you.

```js
FuseBox.init({
    autoImport: {
        Inferno: "inferno",
    },
})
```
Here, the key `Inferno` (uppercase) is a variable name, and `inferno` (lowercase) is the argument to a `require` statement.

Your code is being analysed for variable declarations. If you use the `Inferno` variable in your code in any way without declaring it,
FuseBox will inject the require statement `var Inferno = require("inferno")`.

Example:
```js
Inferno.doMagic()
```

Will result in:

```js
var Inferno = require("inferno");
Inferno.doMagic()
```

However, `var Inferno = {};` will do nothing.

## Natives

FuseBox automatically imports the following packages:
- `stream`
- `process`
- `Buffer`
- `http`

In some cases, however, you may want to omit them. You can do so by setting `false` on
each package's corresponding key within a `natives` hash:

```js
FuseBox.init({
   natives: {
      process: false
   }
})
```

## Alias

If you are coming from WebPack this feature might be helpful.

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

Alternatively you can use the chainable API

```js
fuse.bundle("app")
    .alias("foo", "~/foo/f")
    .alias("bar", "~/bar/b")
```


In your code, you would use it in a way similar to this:
```js
import utils from "babel-utils";
import faraway from "faraway";

console.log(utils, faraway);
```

## Extension Overrides

You can optionally override how file extensions are resolved. This is useful if you want to create platform specific bundles:

```js
FuseBox.init({
    overrideExtensions: ['.desktop.js', '.desktop.json'],
})
```

Alternatively you can use the chainable API

```js
fuse.bundle("app")
    .overrideExtensions('.desktop.js', '.desktop.json');
```

The above configuration would first look for JavaScript and JSON files with a `.desktop.js` or `.desktop.json` extension.
If they cannot be found then the default `.js` and `.json` files will be loaded.

## Filter File
You can filter files and tell FuseBox what you want to be excluded:

```
filterFile : file => {
    return file.getUniquePath().indexOf("default/js/dontwantthisfile") === -1
}
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
import * as foo from "jquery";
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

note: Shims will not be analyzed, which means they should be transpiled before importing, or imported into an environment that does not need them to be transpiled. Shimming works similar to [requirejs](http://requirejs.org/) and [jspm](http://jspm.io/).

For an example, see [shimming in the fuse config](https://github.com/fuse-box/shimming-and-css-example/blob/master/fuse.js#L7) and [how it can be accessed in your code](https://github.com/fuse-box/shimming-and-css-example/blob/master/src/index.ts#L4)

note: Shimming does not work on the server. so if you use shared configuration for both your server and client bundle, remove the shimming option from the global one, and add shim() to your client bundle configuration only. For example:

```js
const fuse = FuseBox.init({
    homeDir: "src",
    output: "dist/$name.js",
});
fuse.bundle("client/app")
    .shim({
        jquery: {
            source: "node_modules/jquery/dist/jquery.js",
            exports: "$"
        }
    })
    .instructions(`>app.tsx`);
 ```
