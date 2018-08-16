---
id: postcss-plugin
title: PostCSS
---

## Description

Allows using PostCSS, a tool for transforming styles with JS plugins. These
plugins can lint your CSS, support variables and mixins, transpile future CSS
syntax, inline images, and more.

Check [PostCSS website](http://postcss.org/) for more information.

## Install

```bash
yarn add postcss --dev
// OR
npm install postcss --save-dev
```

## Usage

The PostCSS plugin generates CSS. It must therefore be chained prior to the
CSSPlugin to be used.

### Setup

Import the plugin from FuseBox

```js
const { PostCSSPlugin } = require("fuse-box");
```

Inject into a chain.

```js
fuse.plugin([PostCSSPlugin(), CSSPlugin()]);
```

Or add it to the main config plugins list to make it available across bundles.

```js
FuseBox.init({
  plugins: [[PostCSSPlugin(), CSSPlugin()]],
});
```

### Require file in your code

```js
import "./styles/main.css";
```

### Plugins

The `PostCSSPlugin` take PostCss plugins as a first argument:

```js
FuseBox.init({
  plugins: [
    [
      PostCSSPlugin([
        require("postcss-import"),
        // You can optionally pass options to the plugins
        require("postcss-url")({ url: "rebase" }),
        require("postcss-nested"),
      ]),
      CSSPlugin(),
    ],
  ],
});
```

If you require more options, you can pass them as a second argument to the
plugin:

```js
FuseBox.init({
  plugins: [
    [
      PostCSSPlugin(
        // postcss plugins
        [require("postcss-url")({ url: "rebase" })],
        {
          // should fusebox generate sourcemaps (see below), default: true
          sourceMaps: false,
          // additional paths for css resolution (see below)
          paths: [],
          // all other options will go to the postcss process function (see below)
          parser: parser,
        },
      ),
      CSSPlugin(),
    ],
  ],
});
```

Or like this:

```js
FuseBox.init({
  plugins: [
    [
      PostCSSPlugin({
        // postcss plugins
        plugins: [require("postcss-url")({ url: "rebase" })],
        // should fusebox generate sourcemaps (see below), default: true
        sourceMaps: false,
        // additional paths for css resolution (see below)
        paths: [],
        // all other options will go to the postcss process function (see below)
        parser: parser,
      }),
      CSSPlugin(),
    ],
  ],
});
```

## Options

`PostCSSPlugin` passes any additional option as
[process options](http://api.postcss.org/global.html#processOptions) to PostCss.
For example:

```js
var nested = require("postcss-nested");
var sugarss = require("sugarss");

fuse.plugin([
  PostCSSPlugin([nested], {
    // passed to PostCss process function
    parser: sugarss,
  }),
  CSSPlugin(),
]);
```

## Paths for HMR

If you are using `postcss-import` plugin, you might need to provide additional
paths to FuseBox config. It will allow fusebox's HMR to work and detect css
dependencies automatically.

You don't need to add the paths option if all you are using paths relative to
the processed file.

```js
fuse.plugin([
  PostCSSPlugin([require("postcss-import")({ path: ["src"] })], {
    paths: [path.resolve(__dirname, "src/shared")],
  }),
  CSSPlugin(),
]);
```

## Disable sourceMaps

You can internally disable sourceMaps if you wish to preserve source maps
generated earlier (by Sass for example)

```js
fuse.plugin([
  SassPlugin(),
  PostCSSPlugin([require("postcss-import")({ path: ["src"] })], {
    sourceMaps: false,
  }),
  CSSPlugin(),
]);
```
