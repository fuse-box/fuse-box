---
id: terser-plugin
title: TerserPlugin
---

## Description

Compresses the javascript code by using
[Terser](https://github.com/terser-js/terser).

Unlike the **UglifyJS** plugin, the **Terser** plugin supports ES2015+ (ES6+)
code.

## Install

This package depends on the `terser` package.

```bash
yarn add terser --dev
npm install terser --save-dev
```

## Setup

Import from FuseBox

```js
const { TerserPlugin } = require("fuse-box");
```

Inject into a chain

```js
fuse.plugin(TerserPlugin());
```

Or add it to the main config plugins list to make it available across bundles

```js
FuseBox.init({
  plugins: [TerserPlugin()],
});
```

## Options

The plugin accepts an object that is the original `Terser` options as a
parameter. For example:

```js
FuseBox.init({
  plugins: [
    TerserPlugin({
      mangle: {
        toplevel: true,
        screw_ie8: true,
      },
    }),
  ],
});
```
