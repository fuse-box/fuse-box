# Built-in plugins



Fusebox contains premade plugins, that should help you to get started. 

## CSS Plugin

It's very easy to start working with css files. You have 2 options, you either bundle the contents or serve the files. A decision that can be made at build time.

For example:
```js
plugins: [
    fsbx.CSSPlugin({
        minify: true
    })
]
```

In this case, all CSS files will be bundled.

But if you define "serve" option with a callback, all files will be filtered through it. A callback is expected to return a string with a browser path. If you return "undefined" or *NOT* a string, that file will be bundled as if no option was specified.

All css files will be served by server.
```js
plugins: [
    fsbx.CSSPlugin({
        minify: true,
        serve: path => `./${path}`
    })
]
```

All files will be served except for "styles.css" (contents will be included in the bundle)
```
plugins: [
    fsbx.CSSPlugin({
        minify: true,
        serve: path => path === "styles.css` ? 0 : ./${path}`
    })
]
```

On top of that a CSS file will added to DOM upon request if not found in the bundle.

### Write contents to a different file

Combine this module with something else, and you will see real magic happen.
```
plugins: [
    [
        fsbx.SassPlugin({ outputStyle: 'compressed' }),
        fsbx.CSSPlugin({ write: true })
    ]
]
```
* It will create an according file, ./main.scss becomes build/main.css (your [outFile](#out-file) folder + project path) 
* It sourcemaps attached it will create main.css.map and it will do mappping too
* It will automatically append filename to the head

Check how it works [here](https://github.com/fuse-box/angular2-example)

> Note - we are still working on the CSS plugins. Be patient. Customisations are coming soon.

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



## PostCSSPlugin
Install libraries first

```js
npm install precss postcss --save-dev
```

PostCSS should be chained along the with the CSSPlugin

```js
const precss = require("precss");
const POST_CSS_PLUGINS = [precss()];


plugins:[
  [fsbx.PostCSSPlugin(POST_CSS_PLUGINS), fsbx.CSSPlugin()],
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

Of course, it can't be all shiny without a JSON plugin, can it?

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
    fxbx.BannerPlugin('// Hey this is my banner! Copyright 2016!')
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
