# Bundle

Bundling in FuseBox starts with the basic configuration. All bundles within the same scope will share the same config but can be overridden.


steps:
    * Bundle producer
    A producer is a master configuration that retains a context, plugins and other settings
    * Config inheritance
     Each bundle inherits configuration except for homeDir and output
    * Run
     After you bundles are defined you can execute fuse.run() which will execute them all. A producer knows about the order, in a way it's an orchestrator

The following diagramm illustrates the process:

```
graph TB
    main(Producer)
    main --> commonConfig(Common Configuration)
    commonConfig --> a(Bundle A)
    commonConfig --> b(Bundle B)
    a --> override(config override)
    b --> override2(config override)
    main --> run((Execute bundles))
```

You can create infinite amount of bundles as well as infinite amount of `Producers`.

## Producer

A parent configuration called `Producer`. It's where we define global configuration for all bundles. Some of the options, however, cannot be changed like `homeDir` and  `output`.

```js
const {FuseBox, EnvPlugin, CSSPlugin, UglifyJSPlugin} = require("fuse-box");

const production = false;
const fuse = FuseBox.init({
    homeDir: "src",
    output: "dist$name.js",
    hash: production,
    cache: !production,
    plugins: [
        EnvPlugin({ NODE_ENV: production ? "production" : "development" }),
        CSSPlugin(), production && UglifyJSPlugin()
    ]
});
```

This is a pretty basic configuration that will work with typescript.
`fuse` in our case if a `BundleProducer`. You can create as many bundles as you like. `production` variable enables hash and disables cache for production builds.

note: It's important to disable cache for production builds.

## Creating a bundle

Having your producer `fuse` in place this code will be enough to create your first bundle
```js

const fuse = FuseBox.init({
    homeDir: "src",
    output: "dist/$name.js",
});
fuse.bundle("app")
    .instructions(`>app.tsx`);

fuse.run()
```

`fuse.run()` should be executed once after all bundles are defined. `app` is bundle name - it will processed through `output: "dist/$name.js"` resulting in `dist/app.js` file.

`app.tsx` should be place inside your `homeDir`. Following tree will help you better understand the structure:

files:
my-awesome-project
 node_modules
  placeholder.js
 src
  app.tsx
 fuse.js

github_example: simple-bundle

After the bundling is done, you will see similar output:

```bash
└── default (3 files,  907 Bytes)
      index.js
      Bar.js
      Foo.js

    Size: 907 Bytes in 22ms
```

You can test the bundle on server by running `node dist/app.js`

## Arithmetic instructions

FuseBox uses an arithmetic approach to bundling.

```js
fuse.bundle("app").instructions(">app.tsx");
```

* If you want a bundle to be executed on load, add `>` in front of your entry file. In case your bundle serves as an individual library, you would not want to make an automatic execution.
* Make sure to keep the extension as you can point to a typescript file.
* All *inputs* are relative to `homeDir`

With arithmetic instructions, you can explicitly define which files go to the bundle, which files skip external dependencies e.g.

```js
fuse.bundle("app").instructions(">index.ts [lib/**/*.ts]");
```

In this case, you will get everything that is required in the index, as well as everything that lies under `lib/` folder with one condition - any external libraries will be ignored.

## Arithmetic Symbols

| Symbol | Meaning |
| ------------- | ------------- |
| ` > `   | Automatically executes a file on load  |
| ` + `   | adds a package / file  |
| ` - `   | excludes a package / file  |
| ` ! `   | removes the loader API from a bundle  |
| ` ^ `   | disables cache  |
| ` ~ `   | Extract all external dependencies. Ignores the actual project files. Used to create vendors. `~ index.ts`  |
| ` [ ] ` | matches everything inside without dependencies |
| ` **/*.ts ` | matches every file using globs, with dependencies, experiment with [globtester](http://globtester.com) |


For most cases just pointing it your entry point will be enough, as FuseBox will walk recursively the dependency tree and bundle everything related

```js
instructions(">index.ts");
```

However, there are cases that require special treatment. For example files that don't have references need to be added manually


```js
instructions(">index.ts + lib/**/**.ts");
```

## Creating vendors

Creating vendors in FuseBox is extremely easy. All you need to is to add `~` this symbol to your entry point.

```js
const vendor = fuse.bundle("vendor")
        .instructions(`~ **/**.{ts,tsx}`);
    if (!production) { vendor.hmr(); }
```
In this case every single `ts` and `tsx` modules will be processed, resulting in `vendor.js` that will contain all required dependencies. Actuall project files will be omited.

```js
if (!production) { vendor.hmr(); }
```

Is a nice trick to avoid `hmr` related code in a production build. If you are not planning on having code splitting, having following will be enough:

```js
fuse.bundle("vendor")
        .instructions(`~ index.ts`);
```

note: Don't forget to run the producer by adding fuse.run() at the very end of your script!

Usually vendors contain the `FuseBox` api (The actual universal loader in browser and on server). Make sure every other bundle has `!` symbol in the arithmetic instructions. You don't want to have dependencies bundled either (in your `app.js`)

```js

const fuse = FuseBox.init({
    homeDir: "src",
    output: "dist/$name.js"
});
fuse.bundle("vendor")
        .instructions(`~ index.ts`);

fuse.bundle("app")
        .instructions(`!> [index.ts]`);

fuse.run()
```

The code above will make sure that:

steps:
  * Vendor
    vendor.js contains all project dependencies + the FuseBox API
  * Application
    app.js Contain only project files without dependencies (e.g react) and does not have FuseBox API (as vendor.js has it all).

`[index.ts]` means that your bundle will contain everything related to `index.ts` without external dependencies like `react` or `angular`

github_example: vendor-splitting

You can now visit `http://localhost:4445` to see how it works

## Option override

You can use the chainable API which will allow you to override options (shim, e.t.c). For example:


```js

const fuse = FuseBox.init({
    homeDir: "src",
    shim: { 'react-native-web': { exports: 'require("react-native")' } },
    output: "dist/$name.js",
    plugins : [HTMLPlugin()]
});

fuse.bundle("bundle1")
    .shim: {},
    .instructions(`~ index.ts`);

fuse.bundle("bundle2")
    .plugin(CSSPlugin())
    .instructions(`~ index.ts`);

fuse.run()

>

```

In this case both `bundle1` and `bundle2` will inherit `homedir`, `shim`, `output`, and `plugins`. `bundle1` will override the `shim` option with an empty shim, and `bundle2` will add an additional plugin, so that `bundle2`'s plugins will be: `[HTMLPlugin(), CSSPlugin()]`

## Chainable API

Everything bundle returns a chain. For example

```js
fuse.bundle("app")
    .watch()
    .plugin(SassPlugin(), CSSPlugin())
    .plugin(HTMLPlugin())
    .hmr()
    .instructions(`~ index.ts`);
```

Available methods:


| Name | Meaning |
| ------------- | ------------- |
| ` watch() `   | Automatically watches and reload a bundle. Read `development` section  |
| ` globals() `   | Set [globals](/page/configuration#global-variables)  |
| ` tsConfig() `   | Sets `tsconfig.json` location for typescript  |
| ` hmr() `   | Enables HMR. Read up [development](/page/development)  |
| ` alias() `   | Sets up [aliases](/page/configuration#alias) |
| ` split() `   | Defines [code splitting](/page/code-splitting) rules.  |
| ` splitConfig() `   | Defines [code splitting](/page/code-splitting) configuration.  |
| ` cache() `   | Toggles cache  |
| ` log() `   | Toggles logging  |
| ` plugin() `   | Add a plugin or a chain of plugins  |
| ` natives() `   | Set [natives](/page/configuration#natives)  |
| ` instructions() `   | Defines [arithmetic instructions](/page/bundle#arithmetic-instructions)  |
| ` sourceMaps() `   | Toggles [sourcemaps](/page/configuration#sourcemaps)  |
| ` exec() `   | Executes a bundle individually from `fuse.run()` |
| ` completed() `   | A callback when a bundle is ready.  |



## Launching on server

You can capture an event when a single bundle is completed. You will have access to `FuseProcess` that will help you to launch your application on server.


```js

fuse.bundle("bundle2")
    .instructions(`~ index.ts`);
    .completed(proc => proc.start())

fuse.run()
```

### Executing a bundle


```js
completed(proc => proc.exec())
```

The following code will spawn a separate nodejs process once.

### Start / restart


```js
completed(proc => proc.start())
```

The following code will spawn a separate nodejs process, if a process is already running FuseBox will kill and spawn a  new one.

### Require

```js
completed(proc => proc.require(opts))
```

The following code will require a file in the same process as the fuse process instead of launching a new one.

The differences are :
* A bundle is executed in a `Promise` and its exports are available to the fuse caller : `proc.require().then(exports => void)`.
* A bundle has access to the same loaded libraries than the fuser, they share the same global object.
* A bundle is inspected if fuse is inspected: `node --debug fuse.js` debugs the bundle too.
* To free the allocated resources when a bundle is restarted, there is no clean `process.kill` option; it must therefore export a `close` function, or a default that has such a function.

An `express` bundle would look as follows:

```js
export default app.listen(process.env.PORT);
```

github_example: recursive

#### Options
* `close(bundleExport)=> Promise`: A closing function.

The exports of the main file can be retrieved with `bundleExport.FuseBox.import(bundleExport.FuseBox.mainFile)`

#### Closing function

When the module is unloaded, the first of these functions is called :
* A function `close(bundleExport)=> Promise` given as an option to `require`

After, if the bundle has a main file,

* An `export function close(): Promise` in the bundle
* A default export who has a `close()=> Promise` function.

If the close function returns a promise, this one will be awaited before requireing the new version of the bundle. If it returns anything else than a promise, the value is ignored.
The `require` function by itself returns a promise that resolves to the loaded bundle main-file `FuseBox` Object.

## Bundle in a bundle
The super powers of FuseBox allow merging bundles inside of bundles without code redundancy. The API of a second bundle will be removed, and 2 bundles will be fused together, keeping only one shared Fusebox API.

Only one thing you need to consider before that - packaging.

Your current project is called "default" This is by design. All dynamic modules will register themselves into it automatically.

If you want to require a bundle it must have a different namespace. Unless you want to keep it shared. Read up on [package naming](#package-name) for better understanding.

Bundle your first package, then make sure your master/main bundle does not have the same package name (otherwise they will [share filename scopes](#scoping-fused)) and require it like any other file.

```js
import * as myLib from "./bundles/myLib.js"
```

FuseBox sniffs its own creations and restructures the code accordingly.

## Importing Bundles
you can import using the fusebox api wrapper that is built into the bundle
```js
const bundled = require("./magic/yourOutFile.js")
const exports = bundled.FuseBox.import("./yourBundle.js");
```

or you can import the file directly using FuseBox

```js
const bundled = require("./magic/yourOutFile.js")
const bundled = FuseBox.import("./yourBundle.js")
```

## Scoping / Fused
If you have more than one bundle and require them, they will be `fused` behind the scenes. That is to say, they will be able to import from each other. This is possible because FuseBox is not just a bundler, but a full featured virtual environment! [See an example using fusing](https://github.com/fuse-box/fuse-box-scopes-example).
