# CSSResourcePlugin


## Description
This program is designed to make it easy to import a css library from an npm package.

## Install

```js
const {CSSResourcePlugin} = require("fuse-box");
```

Let's try to make the [jstree](https://github.com/vakata/jstree) library work

```js
import "jstree/dist/jstree.js";
import "jstree/dist/themes/default/style.css";
```

`style.css` has relative resources (images, fonts), which need to be copied in order to use it. CSSResourcePlugin solves this problem.
It re-writes the URL and copies files to a destination specified by user,



## Copy files

```js
plugins: [
   ["node_modules.**css",
      CSSResourcePlugin({
          dist: "build/resources",
          resolve: (f) => `/resources/${f}`
      }), CSSPlugin()]
]
```

`resolve` in our case is the actual path on browser. `f` is a modified file name (you don't need to change it)


## Inline
You can inline images as well, converting them to base64 data images inside the CSS

```js
plugins: [
   [/node_modules.*\.css$/,
    fsbx.CSSResourcePlugin({
      inline: true,
    }), fsbx.CSSPlugin()],
]
```

note: disable cache while playing with the options, as npm modules along with css files are heavily cached