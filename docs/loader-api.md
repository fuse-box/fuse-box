# Loader API


## How it works

Well, it's pure magic - nodejs wrapper for browser. FuseBox wrapper provides 100% compatible nodejs ecosystem,  having `virtual files` and `virtual packages`. Everything is registered and shared by the API. It means, that you can have two script tags that will fuse and merge each other.

Plugins inject dependent packages/javascript code, that becomes a part of FuseBox loader. In principal, a plugin might work at build time and runtime, which unfolds some crazy optimisation possibilities. 

FuseBox bundle works in both environments. Essentially, it does not matter where you run it. FuseBox will persist itself in browser window, or nodejs globals.

Every bundle contains a 3.7k footer with FuseBox API (1.6KB gzipped).  

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


### Point to the root
You can use `~` symbol to point to your project's [homeDir](http://fuse-box.org/#home-directory) in order to fix relative path messes such as `../../../../../utils`.

```js
// es5
require("~/lib/utils")
// es6
import * as utils from "~/lib/utils";
```


## Lazy Load

Lazy load works out of the box.

Imagine that bundle does not have `myModule.js`, and it's a `CommonJs` module. In order to lazy load it, put your target file next to it available via HTTP, and load it like so:

```js
FuseBox.import("./myModule.js", (module) => {
})
```

If a module is not found within FuseBox' context, it tries to load it via HTTP request. Once obtained, the API caches the exports, allowing to request that module synchronously later on.

```js
import "./myModule".
```

You can load other bundles as well. For example [here](#bundle-in-a-bundle) 

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

```js
require("~/stuff/boo").hello
```

or

```js
require("~/stuff/boo.js").hello
```

## Remove
You can completely remove a module from memory. 

```js
FuseBox.remove("./foo")
```

## FuseBox events

It is possible to intercept require statements. You can catch "before-import" and "after-import" events like so:

```js
FuseBox.on("before-import", (exports, require, module, __filename, __dirname, pkg) => {                
});

FuseBox.on("after-import", (exports, require, module, __filename, __dirname, pkg) => {                
});
```

However, it is not recommended. But if you want to play god, you can use that functionality.

## Dynamic modules

Another feature that allows you to register `commonjs` modules at runtime in browser and on server accordingly

```js
FuseBox.dynamic("foo/bar.js", "module.exports = {foo : 'bar'}")
```

Note how `foo/bar.js` is set. It's called "FuseBox path", which should not start with slashes or periods. FuseBox will register a file in the `default`project. Hence, it is possible to override your local files, but impossible to do the same with external packages. 

It's imperative to bear in mind __file's path__ as well. Having `foo/bar.js` as a dynamic module, means that its `require` context will be pointed to the folder `foo`
To make it clear, let's register two files

```js
FuseBox.dynamic("foo/bar.js", "module.exports = {foo : 'bar'}")
FuseBox.dynamic("foo/wow.js", "require('./bar')")
```

See how `wow.js` is referring to the `foo/bar.js`. A dynamic module is a fully functional FuseBox file, that plays nicely with the rest of the bundle and vice versa. Your bundle won't have any problems using a wildcard import on the dynamic modules too.

```js
require("~/foo/*") // will give 2 files
```

It's impossible to transpile dynamic modules at the moment. You can easily do it yourself, since the API accepts a string, 



## Loader Plugins
Loader plugins can intercept hmr updates to override the default behavior. Here is the current plugin interface: 

```js
interface LoaderPlugin {
    /** 
     * If true is returned by the plugin
     *  it means that module change has been handled
     *  by plugin and no special work is needed by FuseBox
     **/
    hmrUpdate?(evt: SourceChangedEvent): boolean;
}

/** Where */
type SourceChangedEvent = {
    type: 'js' | 'css',
    content: string,
    path: string
}
```

You register a plugin using `FuseBox.addPlugin(YourPlugin)`. 

* As an example here is a way to register a plugin that just reloads the window for *js* files instead of the default behavior:

```js
FuseBox.addPlugin({
  hmrUpdate: ({ type, path, content }) => {
    if (type === "js") {
      window.location.reload();
      return true;
    }
  }
});
```

* As another example, here is a plugin that disables all default HMR behavior and simply logs a message to the console:

```js
FuseBox.addPlugin({
  hmrUpdate: (evt) => {
    console.log('HMR Update', evt, 'Please reload the window');
    return true;
  }
});
```

* Another way to register plugins, is when instantiating (with new, or .init)
```js
FuseBox.init({
  homeDir: "src",
  outFile: "build/out.js",
  plugins: [
    hmrUpdate: (evt) => {
      console.log('HMR Update', evt, 'Please reload the window');
      return true;
    },
  ],
}};
```

### Loader Plugin Examples
- [vue plugin](https://github.com/fuse-box/fuse-box/blob/master/src/plugins/VuePlugin.ts#L7)
