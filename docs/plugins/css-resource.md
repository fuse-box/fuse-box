---
id: css-resource-plugin
title: CSS resource
---

## Description

This program is designed to make it easy to import a css library from an npm
package. It can also be used to bring assets spread around your project folder
into a single directory when building.

## Usage

note: The CSSResource plugin generates CSS, Therefor it must be chained prior to
the CSSPlugin to be used.

### Setup

Import from FuseBox

```js
const { CSSResourcePlugin } = require("fuse-box");
```

Inject into a chain.

```js
fuse.plugin([CSSResourcePlugin(), CSSPlugin()]);
```

Or add it to the main config plugins list to make it available across bundles.

```js
FuseBox.init({
  plugins: [[CSSResourcePlugin(), CSSPlugin()]],
});
```

Let's try to make the [jstree](https://github.com/vakata/jstree) library work

```js
import "jstree/dist/jstree.js";
import "jstree/dist/themes/default/style.css";
```

`style.css` has relative resources (images, fonts), which need to be copied in
order to use it. CSSResourcePlugin solves this problem. It re-writes the URL and
copies files to a destination specified by user.

## Options

### dist

Sets the location of the folder where the assets will be written to. For
example:

```js
plugins: [
  [
    "node_modules.**css",
    CSSResourcePlugin({
      dist: "build/resources",
    }),
    CSSPlugin(),
  ],
];
```

The above will write your assets (images, fonts) to folder
`myProject/build/resources`.

### resolve

Allows rewriting the path of files to be served in the browser. For example:

```js
plugins: [
  [
    "node_modules.**css",
    CSSResourcePlugin({
      dist: "build/resources",
      resolve: f => `/resources/${f}`,
    }),
    CSSPlugin(),
  ],
];
```

In the above, `resolve` in our case is the actual path on browser. `f` is a
modified file name (you don't need to change it).

### Inline

You can inline images as well, converting them to base64 data images inside the
CSS

```js
plugins: [
  [
    /node_modules.*\.css$/,
    fsbx.CSSResourcePlugin({
      inline: true,
    }),
    fsbx.CSSPlugin(),
  ],
];
```

note: disable cache while playing with the options, as npm modules along with
css files are heavily cached.

### Macros

If you have problems resolving the paths, you can define macros:

```js
CSSResourcePlugin({
  resolve: file => `/css-resources/${file}`,
  macros: { static: `${__dirname}/src/static/` },
  dist: `${__dirname}/dist/css-resources/`,
});
```

And use it in your css like so:

```css
body {
  background: url("$static/logo.png");
}
```

## useOriginalFilenames

By default the plugin will generate unique file names for resources which take
the form of random numbers. If you set `useOriginalFilenames` the the original
path and filename of the resource will be used instead. This is useful when
developing.

## filesMapping

If you need unique file names and also a list of all generated CSS resources,
set `filesMapping` option as a function to get all generated file names.

```js
CSSResourcePlugin({
  dist: "resources/",

  // Called when a new set of resources is copied to the resources/ folder
  filesMapping: files => {
    // Log copied files
    files.map(fileMapping => {
      console.log(fileMapping.from, "has been copied to", fileMapping.to);
      // -> Write a json file of all resources for example
    });
  },
});
```

This function also fires in watch mode. It only fires when a new resources is
added, this is to avoid watch infinite loop, if you are creating a typescript
file in sources folder from this function for example. It can be useful when
generated resources file names are needed on the javascript side (asset
preloading), or to create a manifest of all resources.
