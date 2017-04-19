# Built-in plugins
Fusebox contains premade plugins that should help you to get started.

**note:** some of the plugins need to install external dependencies for them to function correctly. kindly take this into account.





## Raw Plugin
Make files export text data

```js
plugins:[
 RawPlugin([".txt", "inline-styles/*.css"])
],
```

Automatically enables extensions in the context. Make sure you have a valid mask with extension at the end of it.
For example `RawPlugin(["asdf"])` will throw an error. `RawPlugin(["hello.txt"])` will enable `txt`.


## SassPlugin






## Markdown Plugin






## Babel plugin
The babel plugin is used to transpile code to different dialects of javascript.
The npm `babel-core` package must be installed to use the babel plugin.

For example, to transpile JSX, you can use this configuration:

```bash
yarn add babel-core babel-preset-es2015 babel-plugin-transform-react-jsx --dev
npm install babel-core babel-preset-es2015 babel-plugin-transform-react-jsx --save-dev
```
```js
 plugins: [
    fsbx.BabelPlugin({
        test: /\.jsx$/, // test is optional
        config: {
            sourceMaps: true,
            presets: ["es2015"],
            plugins: [
                ["transform-react-jsx"],
            ],
        },
    })
]
```

`limit2project` is default true, to use this plugin across an entire project (including other modules like npm)

Note, that if you want to have sourceMaps in place, set `sourceMaps` to true. [Read sourceMaps section](#sourcemaps) for better understanding how sourceMaps are defined.


Passing in no options will cause the `outFile` to be minified with default options.

## SourceMapPlainJsPlugin
`npm i source-map`
```js
sourceMap: {
  bundleReference: "sourcemaps.js.map",
  outFile: "sourcemaps.js.map",
},
plugins: [
    fsbx.SourceMapPlainJsPlugin(),
],
```

