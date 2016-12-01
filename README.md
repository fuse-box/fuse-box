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
    globals: ["default"],
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
