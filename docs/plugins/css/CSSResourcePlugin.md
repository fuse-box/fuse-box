# CSSResource Plugin


## Description
This program is designed to make it easy to import a css library from an npm package.

## Usage
note: The CSSResource plugin generates CSS, Therefor it must be chained prior to the CSSPlugin to be used.

### Setup

Import from FuseBox

```js
const {CSSResourcePlugin} = require("fuse-box");
```

Inject into a chain.

```js
fuse.plugin(
     [CSSResourcePlugin(), CSSPlugin()]
)
```

Or add it to the main config plugins list to make it available across bundles.

```js
FuseBox.init({
    plugins : [
         [CSSResourcePlugin(), CSSPlugin()]
    ]
});
```

Let's try to make the [jstree](https://github.com/vakata/jstree) library work

```js
import "jstree/dist/jstree.js";
import "jstree/dist/themes/default/style.css";
```

`style.css` has relative resources (images, fonts), which need to be copied in order to use it. CSSResourcePlugin solves this problem.
It re-writes the URL and copies files to a destination specified by user.

## Options

### dist
Sets the location of the folder where the assets will be written to. For Eample:

```js
plugins: [
   ["node_modules.**css",
      CSSResourcePlugin({
          dist: "build/resources"
      }), CSSPlugin()]
]
```

The above ill write your assets (images,fonts) to folder `myProject/build/resources`.

### resolve

Allows rewriting the path of files to be served in the browser. For example:

```js
plugins: [
   ["node_modules.**css",
      CSSResourcePlugin({
          dist: "build/resources",
          resolve: (f) => `/resources/${f}`
      }), CSSPlugin()]
]
```

In the above, `resolve` in our case is the actual path on browser. `f` is a modified file name (you don't need to change it).


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

note: disable cache while playing with the options, as npm modules along with css files are heavily cached.


### Macros

If you have problems resolving the paths, you can define macros:



```js
CSSResourcePlugin({
    resolve: file => `/css-resources/${file}`,
    macros: {static: `${__dirname}/src/static/`},
    dist: `${__dirname}/dist/css-resources/`,
})
```

And use it in your css like so:

```css
body {
    background: url("$static/logo.png");
}
```
