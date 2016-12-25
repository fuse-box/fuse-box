# Configuration

The concept of FuseBox is simple. Bundle anything for frontend and server without a headache. Simply put, you can copy paste a simple config down below and bundle some heavy module like `babel-core` or `babel-generator`. But let's get started and break down all available options in fusebox.

## Initialisation

Initialize a fuse-box instance like so. Each instance will handle 1 bundle.
```js
FuseBox.init({ /* you config is here */ })
```

## Home directory

That's your source folder, you don't need to provide an absolute path, it will check it automatically and concat with your project folder.

```js
FuseBox.init({ 
  homeDir : "./src"
})
```

## Out file

That's your bundle file. It is relative to your project directory, but you can give it an absolute path as well

```js
FuseBox.init({ 
  homeDir : "./src",
  outFile : "./build/bundle.js"
})
```

## Cache

You can turn off caching if you like. By default caching is on. FuseBox will create a folder `.fuse-box` in your project path, and store related files. Don't forget to add it to .gitgnore.

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
    globals: { default: "mySuperLib" },
})
```

Whereas key is the name of a package and value is an alias that groups exports. "default" is your current project. Please, note, that in order to expose your default package, a bundle must have an [entry point](#entry-point)

## Sourcemaps

Sourcemaps in FuseBox are enabled by adding this property to a fusebox init configuration

```js
sourceMap: {
  bundleReference: "sourcemaps.js.map",
  outFile: "sourcemaps.js.map",
}
```
`bundleReference` speaks for itself. This line will be added to the bundle. For example `//# sourceMappingURL=./sourcemaps.js.map`. If your client is not able to read them, make sure that the path is reachable. 

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




