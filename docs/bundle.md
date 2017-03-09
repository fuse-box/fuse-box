# Bundle

## Arithmetic instructions
FuseBox uses an arithmetic approach to bundling. We don't support anything else, as this approach is the most simple and flexible.

```js
let fuse = FuseBox.init({
    homeDir: "src/",
    globals: { default: "myLib"},
    outFile: "./out.js"
});

fuse.bundle(">index.js");
```

* If you want a bundle to be executed on load, add `>` in front of your entry file. In case your bundle serves as an individual library, you would not want to make an automatic execution.
* Make sure to keep the extension as you can point to a typescript file.
* All *inputs* are relative to `homeDir`

With arithmetic instructions, you can explicitly define which files go to the bundle, which files skip external dependencies e.g.

```js
fuse.bundle(">index.ts [lib/**/*.ts]");
```

In this case, you will get everything that is required in the index, as well as everything that lies under `lib/` folder with one condition - any external libraries will be ignored.

### Arithmetic Symbols

* ` + ` adds a package / file
* ` - ` excludes a package / file
* ` ! ` removes the loader API from a bundle
* ` ^ ` disables cache
* ` > ` executes a file, it should be an entry point, not a glob
* ` [ ] ` matches everything inside without dependencies
* ` **/*.ts ` matches every file using globs, with dependencies, experiment with [globtester](www.globtester.com)

### Examples for better understanding
`> index.js [**/*.js]` - Bundle everything without dependencies, and execute `index.js`.

`[lib/*.js] +path +fs` - Bundle all files in lib folder, ignore node modules except for `path` and `fs`

`[**/*.js]` - Bundle everything without dependencies

`**/*.js` - Bundle everything with dependencies

`**/*.js -path` - Bundle everything with dependencies except for module `path`

## Making many bundles at once
You can specify many `{ outFile: bundleStr }`. Your config (excluding `outFile`) will be copied for every single process.

For example:

```js
fuse.bundle({
    "_build/test_vendor.js": "+path",
    "_build/app.js": ">[index.ts]"
});
```

## Fluent
Arithmetic instructions can be expressed using a more verbose, fluent api:
[see tests for more examples here](https://github.com/fuse-box/fuse-box/blob/master/src/tests/ArithmeticsAsFluent.test.ts)

### Single Fluent Bundle
```js
const instructions = fsbx.Fluent
  .init()
  .startBundle('./dist/noflo.js')
  .excludeDeps() // also can be used as .ignoreDeps
  .execute("src/lib/NoFlo.coffee")
  .add("src/lib/*.coffee")
  .exclude('fs') // also can be used as .ignore
  .include('process')
  .noApi()
  .noCache()
  .finishBundle()
  .finish()

// becomes:
// ^ ! >[src/lib/NoFlo.coffee] -fs +process
const bundle = fuse.bundle(instructions)
```

### Multi Fluent Bundle
```js
const instructions = fsbx.Fluent
  .init()

  .startBundle('./dist/noflo.js')
  .excludeDeps()
  .execute("src/lib/NoFlo.coffee")
  .finishBundle()

  .startBundle('./dist/bundle.js')
  .excludeDeps()
  .add("spec/**/*.coffee")
  .finishBundle()

  .startBundle('./dist/specs.js')
  .includeDeps()
  .add("spec/**/*.coffee")
  .exclude('path')
  .finishBundle()

  .finish()

// becomes:
// {
//   './dist/noflo.js': '>[src/lib/NoFlo.coffee]',
//   './dist/bundle.js': '+[spec/**/*.coffee]',
//   './dist/specs.js': '+spec/**/*.coffee -path'
// }
const bundles = fuse.bundle(instructions)
```


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
```
const fsbx = require("fuse-box")
const FuseBox = fsbx.FuseBox

const bundled = require("./magic/yourOutFile.js")
const bundled = FuseBox.import("./yourBundle.js")
```

## Scoping / Fused
If you have more than one bundle and require them, they will be `fused` behind the scenes. That is to say, they will be able to import from each other. This is possible because FuseBox is not just a bundler, but a full featured virtual environment! [See an example using fusing](https://github.com/fuse-box/fuse-box-scopes-example).
