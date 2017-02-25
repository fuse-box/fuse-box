# Built-in plugins

Fusebox contains several built-in plugins to handle common use cases.

## CSS Plugin
CSSPlugin is used to handle .css syntax.  As such, it should always be at the end of any CSS processing chain (see [#list-of-plugins](Plugin configuration) for examples of plugin chains), as it handles everything that is relating to bundling, reloading and grouping css styles.


### Inline CSS

```js
plugins : [
  CSSPlugin()
]
```
That configuration converts all `.css` files into a format that allows including them directly into javascript.  For example:

```js
import './main.css'
```

### Write css to the filesystem

You can write css files to the file system as well.

```js
plugins : [
    CSSPlugin({
        outFile: (file) => `${tmp}/${file}`
    })
]
```

FuseBox will automatically inject your files into the HEAD when imported

```js
import './main.css'
```

creates

```html
<link rel="stylesheet" type="text/css" href="main.css">
```

### Head injection

CSSPlugin automatically appends css styles or stylesheets into the HEAD by default as in the above example. You can override this behavior by setting `{inject : false}`

```js
plugins : [
    CSSPlugin({
        outFile: (file) => `${tmp}/${file}`,
        inject : false
    })
]
```
Now you can manually append your css files!

If you want to keep the magic but configure the injection yourself, you can provide a callback to the `inject` 
parameter to customise your css file resolver in the browser

```js
plugins : [
    CSSPlugin({
        outFile: (file) => `${tmp}/${file}`,
        inject: (file) => `custom/${file}`
    })
]
```
Will result in:

```html
<link rel="stylesheet" type="text/css" href="custom/main.css">
```
 

### Grouping files

You can group many css files into a single file. 

```js
plugins : [
    CSSPlugin({
        group : "bundle.css"
    })
]
```

the `group` option should not contain any relative or absolute paths. This is a virtual file in the dependency tree. You can use 
all parameters described above to customise the behaviour. For example

```js
plugins : [
    CSSPlugin({
        group: "app.css",
        outFile: `${tmp}/app.css`
    })
]
```

> NOTE! outFile must be a string (not a callback) when used with the `group` option.

Check out the tests [here](https://github.com/fuse-box/fuse-box/blob/master/test/css_plugin.js) 

## CSSResourcePlugin

Imagine a situation where you import a css file from an npm library.
Let's try  make [jstree](https://github.com/vakata/jstree) library work

```
import "jstree/dist/jstree.js";
import "jstree/dist/themes/default/style.css";
```

`style.css` has relative resources (images, fonts), which obviously need to be copied. CSSResourcePlugin comes real handy.
It re-writes URL and copies files to a destination specified by user,


### Copy files

```
plugins : [
   [/node_modules.*\.css$/,
      build.CSSResourcePlugin({
          dist : "build/resources",
          resolve : (f) => `/resources/${f}`
      }), build.CSSPlugin()]
]
```

`resolve` in our case is the actual path on browser. `f` is a modified file name (you don't need to change it)


### Inline
You can inline images as well

```
plugins : [
   [/node_modules.*\.css$/,
      build.CSSResourcePlugin({
            inline : true
      }), build.CSSPlugin()]
]
```


> HINT: disable cache while playing with the options, as npm modules along with css files are heavily cached

## Less Plugin
Install less first.
```bash
npm install less --save-dev
```
Less plugin should be chained along the with the CSSPlugin

```js
plugins:[
  [fsbx.LESSPlugin(), fsbx.CSSPlugin()]
],
```

> We still need to figure out what to do with sourcemaps. Be patient!



## PostCSS
Install libraries first

```bash
npm install precss postcss --save-dev
```

PostCSS should be chained along the with the CSSPlugin

```js
const precss = require("precss");
const POST_CSS_PLUGINS = [precss()];


plugins:[
  [fsbx.PostCSS(POST_CSS_PLUGINS), fsbx.CSSPlugin()],
],
```

> We still need to figure out what to do with sourcemaps. Be patient!


## StylusPlugin
```js
plugins:[
  [fsbx.StylusPlugin(), fsbx.CSSPlugin()]
],
```

## Raw Plugin
Make files export text data

```js
plugins:[
 [/\.raw$/, RawPlugin({extensions: ['.raw']})]
],
```


## SassPlugin
```bash
npm install node-sass
```

Usage:
```js
plugins:[
  [fsbx.SassPlugin({ /* options */ })]
],
```

## HTML Plugin
```js
plugins: [
  fsbx.HTMLPlugin({ useDefault: false })
]
```

Toggle `useDefault` to make HTML files export strings as `default` property.
For example with `useDefault: true` you will be able to import HTML files like so :

```js
import tpl from "~/views/file.html"
```

## ImageBase64Plugin
Works greatly if you want to have images bundled

```bash
npm install base64-img --save-dev
```
```
plugins: [
    fsbx.ImageBase64Plugin()
]
```

Example for react
```jsx
const image = require("./icons/image.png")
<img src={image} />
```


## Babel plugin
You can use babel plugin to transpile your code.
Make sure you have `babel-core` installed

```bash
npm install babel-core babel-preset-es2015 babel-plugin-transform-react-jsx
```
For example. to transpile JSX, you can use this configuration.
```js
 plugins: [
    fsbx.BabelPlugin({
        test: /\.jsx$/, // test is optional
        config: {
            sourceMaps: true,
            presets: ["es2015"],
            plugins: [
                ["transform-react-jsx"]
            ]
        }
    })
]
```

`limit2project` set to true, to use this plugin across an entire project (including other modules like npm)

Note, that if you want to have sourcemaps in place, set `sourceMaps` to true. Read sourcemaps section for better understanding how sourcemaps are defined.


## JSON plugin
Of course, it can't be all shiny without a JSON plugin, can it? (Allows `.json` files to be required/imported as JavaScript objects)

```js
plugins: [
    fsbx.JSONPlugin()
]
```

## SVG Plugin
React lovers, [here it is](https://github.com/fuse-box/react-example/blob/master/gulpfile.js#L17). Plain and simple.

```js
plugins: [
    fsbx.SVGPlugin()
]
```

## BannerPlugin
Add anything at the top of your bundle.
```js
plugins: [
    // Add a banner to bundle output
    fsbx.BannerPlugin('// Hey this is my banner! Copyright 2016!')
]
```

## UglifyJSPlugin
Compresses your code by [UglifyJS2](https://github.com/mishoo/UglifyJS2)
```js
plugins: [
    // [options] - UglifyJS2 options
    fsbx.UglifyJSPlugin(options)
]
```

Passing in no options will cause the `outFile` to be minified with default options.

## SourceMapPlainJsPlugin
`npm i source-map`
```js
sourceMap: {
  bundleReference: "sourcemaps.js.map",
  outFile: "sourcemaps.js.map",
},
plugins: [
    fsbx.SourceMapPlainJsPlugin();
]
```

## EnvPlugin
Writes environment variables to both client and server at build time.

```js
plugins : [
   fsbx.EnvPlugin({ NODE_ENV: "production" })
]
```

Access it like you used to:

```
console.log( process.env.NODE_ENV )
```

The order of plugins is important: environment variables created with this plugin will only be available to plugins further down the chain.

```
plugins : [
   fsbx.BabelPlugin({ /* settings /*}), // <-- won't have NODE_ENV set
   fsbx.EnvPlugin({ NODE_ENV: "production" }),
   fsbx.BabelPlugin({ /* settings /*}), // <-- will have NODE_ENV set
]
```

## CoffeePlugin

Handle [CoffeeScript](http://coffeescript.org) compilation of .coffee files

```js
plugins : [
   fsbx.CoffeePlugin({
       // Options passed to the coffeescript compiler
   })
]
```

## Typescript helpers

A very handy plugin, adds required typescript functions to the bundle. Please note that it adds only the ones that are actually used. So you won't be seeing an unnecessary code.

Please, check this [list](https://github.com/fuse-box/fuse-box/tree/master/assets/libs/fuse-typescript-helpers)

Available helpers:

Name | Description
------------ | -------------
__assign | Generic typescript helper
__awaiter | Generic typescript helper
__decorator | Generic typescript helper + additional fusebox meta data patched
__extends | Generic typescript helper
__generator | Generic typescript helper
__param | Generic typescript helper

If you spot an error or a missing helper, please, submit an issue, or a pull request. If you feel impatient enough, you can always create your own plugin, based on this class [code](https://github.com/fuse-box/fuse-box/blob/master/src/plugins/TypeScriptHelpers.ts)

### Using the plugin

Simply add TypeScriptHelpers to your plugin list. No further configuration required. FuseBox will take care of everything else. To avoid unnecessary AST (which is heavy) this plugin does a simple RegExp, and tests for declarations. It is absolutely safe, and your code is not modified in any way.

```js
const fsbx = require("fuse-box");
let fuseBox = fsbx.FuseBox.init({
    homeDir: "test/fixtures/cases/ts",
    outFile: "./out.js",
    plugins: [fsbx.TypeScriptHelpers()]
});

```
### Extended metadata properties

You can have access to the entire environment of a file, using reflect-metadata. Make sure you have it installed first

```bash
npm install reflect-metadata
```

Then, include it in your entry point

```js
import "reflect-metadata";
```

Now, you can access "commonjs" variables via fusebox metadata property

```js
export function testDecorator() {
    return function (target, key: string, descriptor: PropertyDescriptor) {
        Reflect.getMetadata("fusebox:__filename", target, key);
        Reflect.getMetadata("fusebox:__dirname", target, key);
        Reflect.getMetadata("fusebox:require", target, key); // Local "require" function
        Reflect.getMetadata("fusebox:module", target, key);
        Reflect.getMetadata("fusebox:exports", target, key);
    }
}
```
