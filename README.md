# FuseBox - A Bundle that does it right

> The library is under heavy development. We are getting there. Documentation is coming soon.
> FuseBox beats any bundler/loader (webpack, jspm) by performance and convenience, and bundles any library on the Internet without additional configuration. So please, be be patient


```js
let fuseBox = new FuseBox({
    homeDir: "test/fixtures/cases/case1"
});
```

### Example1: Bundle typescript!

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


### Bundle react app!
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

### Arithmetic options


`> index.js [**/*.js]` - Bundle everything without dependencies, and execute index.js

`[**/*.js]` - Bundle everything without dependencies

`**/*.js` - Bundle everything with dependencies

`**/*.js -path` - Bundle everything with dependencies except for path



### FuseBox events

It is possible to intercept require statements. You can catch "before-import" and "after-import" events like so:

```
FuseBox.on("before-import", (exports, require, module, __filename, __dirname, pkg) => {                
});

FuseBox.on("after-import", (exports, require, module, __filename, __dirname, pkg) => {                
});
```

It is not recommended, however, if you want to play god, you can use that functionlity.

### Export from bundle

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


