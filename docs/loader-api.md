# Loader API


## How it works

Well, it's pure magic - nodejs wrapper for browser. FuseBox wrapper provides 100% compatible nodejs ecosystem,  having `virtual files` and `virtual packages`. Everything is registered and shared by the API. It means, that you can have two script tags that will fuse and merge each other.

Plugins inject dependent packages/javascript code, that becomes a part of FuseBox loader. In principal, a plugin might work at build time and runtime, which unfolds some crazy optimisation possibilities. 

FuseBox bundle works in both environments. Essentially, it does not matter where you run it. FuseBox will persist itself in browser window, or nodejs globals.

Every bundle contains a 3.7k footer with FuseBox API (1,6KB gzipped).  


## Import
Import is 100% compatible with commonjs specification. You can require folders, skip file extensions (fusebox will guess it).
```js
FuseBox.import("./foo/bar");
```
Require external packages will work  as well

```js
FuseBox.import("fs");
```

Please note that some libraries like "fs" are faked in the browser. Meaning that it won't spit out an error, but won't work as expected on the server for known reasons.
Nodejs environment, however, will get authentic "fs" module. (Concerns http, net, tty e.t.c )

## Wildcard import
With wildcard imports `*` you can require all files that match a particular pattern. A wildcard with no default extension will fallback to `.js`.
For example

```js
FuseBox.import("./batch/*")
```

Will result in:

```js
{ "batch/a.js" : {}, "batch/b.js" : {} }
```

Whereas `a.js` and  `b.js` are files in folder `batch`

You can require all JSON files for example:

```js
FuseBox.import("./batch/*.json")
```

Or match a particular pattern

```js
FuseBox.import("./batch/*-component")
```

Note that you can use all of the above with `require` statement too.

```
require("~/stuff/boo").hello
```
or

```
require("~/stuff/boo.js").hello
```

## Remove
You can completely remove a module from memory. 

```
FuseBox.remove("./foo")
```



## FuseBox events

It is possible to intercept require statements. You can catch "before-import" and "after-import" events like so:

```
FuseBox.on("before-import", (exports, require, module, __filename, __dirname, pkg) => {                
});

FuseBox.on("after-import", (exports, require, module, __filename, __dirname, pkg) => {                
});
```

However, it is not recommended. But if you want to play god, you can use that functionality.

## Point to the root
You can use `~` symbol to point to your project's path in order to solve `../../../../../utils` mess.

```js
// es5
require("~/lib/utils")
// es6
import * as utils from "~/lib/utils";
```
