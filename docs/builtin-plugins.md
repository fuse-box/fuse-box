# Built-in plugins

Fusebox contains premade plugins, that should help you to get started.

## CSS Plugin

The CSS plugin is elegant and powerful.  It can be used to combine all CSS files into a single bundle, or to mark files as external to
the bundle, to be served separately by the web server.  By default, all CSS files are bundled.

For example:
```js
plugins: [
    fsbx.CSSPlugin({})
]
```

### Chaining CSS plugins to transform SCSS, Sass, and others

Fusebox's plugin system allows simple transformation of more complex CSS systems through plugin chaining.  For example, to transform
Sass into CSS:

```js
plugins: [
    [
        fsbx.SassPlugin({ outputStyle: 'compressed' }),
        fsbx.CSSPlugin({ write: true })
    ]
]
```

* This simple code will change any scss file to a css file - `./main.scss` becomes `build/main.css` (your [outFile](#out-file) folder + project path)
* it also creates `main.css.map` if sourcemaps have been specified
* it automatically appends the new CSS files to the head of the web page and serves them

A more extensive example can be found [here](https://github.com/fuse-box/angular2-example)

### Options

The CSS plugin accepts a few options to customize the output bundle, and to handle edge cases.

#### minify

If specified as true, all CSS files will have extraneous whitespace removed to help reduce file size.  This option is false by default.

```js
plugins: [
  fsbx.CSSPlugin({
    minify: true
  })
]
```

#### bundle

This option is used to combine all css files into one file.  Within the bundle, the files can still be referenced with their original
names, but the loader will request the single file that was made from bundling the css files together

```js
plugins: [
    fsbx.CSSPlugin({
        bundle: 'bundle.css'
    })
]
```

#### write

> WARNING: this option is deprecated and will be removed. Use bundle instead.

If specified as true, then the CSS files will be processed and transferred to the build folder for bundling.  This option is false by
default, and should be set to true when chaining with any CSS processing plugins above it.

```js
plugins: [
    [
        fsbx.SassPlugin({ outputStyle: 'compressed' }),
        fsbx.CSSPlugin({ write: true })
    ]
]
```

The option should be set to false for any CSS files that will be served (and not bundled) to decrease build time.

```js
plugins: [
    fsbx.CSSPlugin({
        minify: true,
        serve: path => `./${path}`
    })
]
```

#### serve

> WARNING: this option is deprecated and will be removed. Use bundle instead.

This option should be used to delegate serving a CSS file external to the bundle to either the DevServer or your chosen web server.
Unlike other options passed to the CSSPlugin, `serve` must be a function.  The function accepts the path to CSS files, and should return
the URL that the CSS file can be accessed at, or false if the file should be bundled.  This flexibility allows serving some files
separately, and bundling others.

The `serve` option must be a function that accepts the path to the current CSS file and returns either the server path, or a falsey value
if the file should be bundled.  Here are examples of both use cases:

All css files will be served by server.
```js
plugins: [
    fsbx.CSSPlugin({
        minify: true,
        serve: path => `./${path}`
    })
]
```

All files will be served except for "styles.css," which will be included in the bundle along with other bundled javascript.
```js
plugins: [
    fsbx.CSSPlugin({
        minify: true,
        serve: path => path === "styles.css` ? 0 : ./${path}`
    })
]
```

Any CSS file that is required by javascript code which has not been bundled will be loaded directly into the DOM by requesting it from
the server.

> Note - CSS plugins are in flux, more customization is coming

## CSSResourcePlugin

Imagine a situation where you import a css file from an npm library.
Let's try  make [jstree](https://github.com/vakata/jstree) library work

```js
import "jstree/dist/jstree.js";
import "jstree/dist/themes/default/style.css";
```

`style.css` has relative resources (images, fonts), which obviously need to be copied. CSSResourcePlugin comes real handy.
It re-writes URL and copies files to a destination specified by user,


### Copy files

```js
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

```js
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

> Note: Source maps are not yet completely implemented


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

> Note: Source maps are not yet completely implemented

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
```js
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

```js
console.log( process.env.NODE_ENV )
```

The order of plugins is important: environment variables created with this plugin will only be available to plugins further down the chain.

```js
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
