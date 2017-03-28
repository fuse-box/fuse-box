# Built-in plugins
Fusebox contains premade plugins that should help you to get started.

**note:** some of the plugins need to install external dependencies for them to function correctly. kindly take this into account.

## CSS Plugin
CSSPlugin is used to handle .css syntax.  As such, it should always be at the end of any CSS processing chain (see [#list-of-plugins](Plugin configuration) for examples of plugin chains), as it handles everything that is relating to bundling, reloading and grouping css styles.


[see the mastering css with fusebox example](https://github.com/fuse-box/mastering-css)


### Inline CSS

```js
plugins: [
  CSSPlugin(),
```
That configuration converts all `.css` files into a format that allows including them directly into javascript.  For example:

```js
import './main.css'
```

### Write css to the filesystem

The outFile option is used to write css files to the bundle directory

```js
let tmp = './tmp'
plugins: [
    CSSPlugin({
        outFile: (file) => `${tmp}/${file}`,
    }),
]
```

FuseBox will automatically inject your files into the HEAD using link tags when imported

```js
import 'directory/main.css'
```

creates

```html
<link rel="stylesheet" type="text/css" href="main.css">
```

### Head injection

CSSPlugin automatically appends css styles or stylesheets into the HEAD by default as in the above example. You can override this behavior by setting `{inject: false}`

```js
plugins: [
    CSSPlugin({
        outFile: (file) => `${tmp}/${file}`,
        inject: false,
    }),
]
```

If you want to keep the magic but configure the injection yourself, you can provide a callback to the `inject`
parameter to customise your css file resolver in the browser

```js
plugins: [
    CSSPlugin({
        outFile: (file) => `${tmp}/${file}`,
        inject: (file) => `custom/${file}`,
    }),
]
```
Will result in:

```html
<link rel="stylesheet" type="text/css" href="custom/main.css">
```


### Grouping files
You can group many css files into a single file.  Imports of any individual file will be converted into imports of the grouped file.


```js
plugins: [
    CSSPlugin({group: "bundle.css"}),
]
```

the `group` option should not contain any relative or absolute paths. This is a virtual file in the dependency tree. You can use
all parameters described above to customise the behaviour. For example

```js
plugins: [
    CSSPlugin({
        group: "bundle.css"
    })
]
```

```js
plugins : [
    CSSPlugin({
        group: "app.css",
        outFile: `${tmp}/app.css`
    })
]
```

> NOTE! outFile must be a string (not a callback) when used with the `group` option.

Check out the tests [here](https://github.com/fuse-box/fuse-box/blob/master/src/tests/CSSPlugin.test.ts)

## CSSResourcePlugin

This program is designed to make it easy to import a css library from an npm package.
Let's try to make the [jstree](https://github.com/vakata/jstree) library work

```js
import "jstree/dist/jstree.js";
import "jstree/dist/themes/default/style.css";
```

`style.css` has relative resources (images, fonts), which need to be copied in order to use it. CSSResourcePlugin solves this problem.
It re-writes the URL and copies files to a destination specified by user,

## CSSModules

CSSModules plugin is available in `> 1.4.1`

Install

```bash
yarn add postcss-modules --dev
npm install postcss-modules --save-dev
```

Import the plugin from `fuse-box`

```js
const {  CSSModules, CSSPlugin } = require("fuse-box");
```

Add it to your chain


### Development mode (inlining) + HMR

```js
fuse.bundle("app")
    .plugin(CSSModules(), CSSPlugin())
    .instructions("> index.ts");
```

### Production mode (grouping - no HMR)

```js
fuse.bundle("app")
    .plugin(CSSModules(), CSSPlugin({
        group: "bundle.css",
        outFile: `dist/bundle.css`
    }))
    .instructions("> index.ts");
```




### Copy files

```js
plugins: [
   [/node_modules.*\.css$/,
      fsbx.CSSResourcePlugin({
          dist: "build/resources",
          resolve: (f) => `/resources/${f}`
      }), fsbx.CSSPlugin()]
]
```

`resolve` in our case is the actual path on browser. `f` is a modified file name (you don't need to change it)


### Inline
You can inline images as well, converting them to base64 data images inside the CSS

```js
plugins: [
   [/node_modules.*\.css$/,
    fsbx.CSSResourcePlugin({
      inline: true,
    }), fsbx.CSSPlugin()],
]
```


> HINT: disable cache while playing with the options, as npm modules along with css files are heavily cached

## Less Plugin
Install [less](http://lesscss.org/) first.
```bash
yarn add less --dev
npm install less --save-dev
```

The less plugin generates CSS, and must be chained prior to the CSSPlugin to be used:

```js
plugins:[
  [fsbx.LESSPlugin(), fsbx.CSSPlugin()],
],
```

> Sourcemaps are not yet properly handled.  Development is ongoing on this feature


## PostCSS
Install [postcss](https://github.com/postcss/postcss) and any postcss plugins first

```bash
yarn add precss postcss --dev
npm install precss postcss --save-dev
```

PostCSS generates CSS, and must be chained prior to the CSSPlugin to be used:

```js
const precss = require("precss");
const POST_CSS_PLUGINS = [precss()];

plugins:[
  [fsbx.PostCSS(POST_CSS_PLUGINS), fsbx.CSSPlugin()],
],
```

> Sourcemaps are not yet properly handled.  Development is ongoing on this feature


## StylusPlugin

stylus generates CSS, and must be chained prior to the CSSPlugin to be used:

```js
plugins:[
  [fsbx.StylusPlugin(), fsbx.CSSPlugin()]
],
```

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

[Sass](http://sass-lang.com/) generates CSS, and must be chained prior to the CSSPlugin to be used:

```bash
yarn add node-less --dev
npm install node-sass --save-dev
```

Usage:
```js
plugins:[
  [SassPlugin({ /* options */ }), CSSPlugin()],
],
```

By default, you have 3 macros available:

That same as [home directory](#home-directory)
```css
@import '$homeDir/test2.scss';
```

Your application root.

```css
@import '$appRoot/src/test.scss';
```

`Tilde` that points to node_modules
```css
@import '~bootstrap/dist/bootstrap.css';
```

You can override any of these by providing a key:

```js
plugins: [
    [ SassPlugin({ macros: { "$homeDir": "custom/dir/" }}), CSSPlugin() ]
]
```


## HTML Plugin
```js
plugins: [
  fsbx.HTMLPlugin({ useDefault: false }),
]
```

Toggle `useDefault` to make HTML files export strings as `default` property.
For example with `useDefault: true` you will be able to import HTML files like so:

```js
import tpl from "~/views/file.html"
```

With `useDefault: true`, is as if the html file contains this:
```jsx
export default `
  <!DOCTYPE html>
  <title>eh</title>
`
```


## Markdown Plugin

Markdown Plugin generates HTML from Markdown files.

```js
plugins: [
  fsbx.MarkdownPlugin({
    useDefault: false,
    /* marked options */
  }),
]
```

It depends on [marked](https://github.com/chjj/marked) library, so it must be installed first :

```bash
yarn add marked --dev
npm install marked --save-dev
```

Toggle `useDefault` to make Markdown files export strings as `default` property.
For example with `useDefault: true` you will be able to import Markdown files like so:

```js
import tpl from "~/views/file.md"
```

With `useDefault: true`, is as if the html file contains this:
```jsx
export default `
  <!DOCTYPE html>
  <title>eh</title>
`
```

For other options, see https://github.com/chjj/marked.


## ImageBase64Plugin
Works greatly if you want to have images bundled

```bash
npm install base64-img --save-dev
```
```js
plugins: [
    fsbx.ImageBase64Plugin(),
]
```

Example for react
```jsx
const image = require("./icons/image.png")
<img src={image} />
```


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


## JSON plugin
The JSON plugin allows .json files to be imported as javascript objects

```js
plugins: [
    fsbx.JSONPlugin(),
]
```

## SVG Plugin

The SVG plugin allows importing svg graphics files into javascript source for use in styles and as image source.

[here is an example usage](https://github.com/fuse-box/react-example/blob/master/fuse.js), and the
[source file that imports the SVG](https://github.com/fuse-box/react-example/blob/master/src/App.jsx#L10)

```js
plugins: [
    fsbx.SVGPlugin(),
]
```

## BannerPlugin
Add a comment with static text at the top of the bundle.
```js
plugins: [
    // Add a banner to bundle output
    fsbx.BannerPlugin('// Hey this is my banner! Copyright 2016!'),
]
```

## UglifyJSPlugin
Compresses the javascript code by using [UglifyJS2](https://github.com/mishoo/UglifyJS2)
```js
plugins: [
    // [options] - UglifyJS2 options
    fsbx.UglifyJSPlugin(options),
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
    fsbx.SourceMapPlainJsPlugin(),
],
```

## EnvPlugin
Creates environment variables for both client and server at build time.

```js
plugins: [
   fsbx.EnvPlugin({ NODE_ENV: "production" }),
],
```

Access it with `process.env.${ENVIRONMENT_VARIABLE_NAME}` as in:

```js
console.log(process.env.NODE_ENV)
```

The order of plugins is important: environment variables created with this plugin will only be available to plugins further down the chain, so EnvPlugin should be early in the list of plugins.

```js
plugins: [
   fsbx.BabelPlugin({ /* settings */ }), // <-- won't have NODE_ENV set
   fsbx.EnvPlugin({ NODE_ENV: "production" }),
   fsbx.BabelPlugin({ /* settings */ }), // <-- will have NODE_ENV set
]
```

## ReplacePlugin
The [EnvPlugin](#EnvPlugin) will define a value for you, but if somewhere along the line that value changes (for example, something setting `process.env.NODE_ENV = 'magic';`), the value will change.
In contrast, the ReplacePlugin will _replace_ that key, with the value you provide, for example, instead of `process.env.NODE_ENV`, the value is replaced with a string. This allows [UglifyJSPlugin](#UglifyJSPlugin) to remove "dead code" and enables you to use production mode with modules that rely on this behaviour.


### example:

#### your config
```js
plugins: [
  ReplacePlugin({ "process.env.NODE_ENV": JSON.stringify("production") }),
],
```

#### your code
```js
if (process.env.NODE_ENV === 'production') console.log('production!')
```

#### result
```js
if ('production' === 'production') console.log('production!')
```

#### after uglifying
```js
console.log('production!')
```


## CoffeePlugin

Allows [CoffeeScript](http://coffeescript.org) compilation of .coffee files

```js
plugins: [
   fsbx.CoffeePlugin({
       // Options passed to the coffeescript compiler
   }),
],
```

## Typescript helpers

This plugin adds required typescript functions to the bundle. Please note that it adds only the ones that are actually used, helping to avoid unnecessary code.

This [list](https://github.com/fuse-box/fuse-box/blob/master/src/plugins/TypeScriptHelpers.ts) shows the possible helpers.

Available helpers:

Name | Description
------------ | -------------
__assign | Generic typescript helper
__awaiter | Generic typescript helper
__decorator | Generic typescript helper + additional fusebox meta data patched
__extends | Generic typescript helper
__generator | Generic typescript helper
__param | Generic typescript helper

If you spot an error or a missing helper, please submit an issue or a pull request. If needed, you can always create your own plugin, based on this class [code](https://github.com/fuse-box/fuse-box/blob/master/src/plugins/TypeScriptHelpers.ts)

### Using the plugin

Simply add TypeScriptHelpers to your plugin list. No further configuration required. FuseBox will take care of everything else. To avoid unnecessary AST (which is heavy) this plugin does a simple RegExp, and tests for declarations. It is absolutely safe, and your code is not modified in any way.

```js
const fsbx = require("fuse-box");
let fuse = fsbx.FuseBox.init({
    homeDir: "test/fixtures/cases/ts",
    outFile: "./out.js",
    plugins: [fsbx.TypeScriptHelpers()],
});

```
### Extended metadata properties

You can have access to the entire environment of a file, using reflect-metadata. Make sure you have it installed first

```bash
yarn add reflect-metadata --dev
npm install reflect-metadata --save-dev
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
