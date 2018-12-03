---
id: add-css
title: Add CSS
---

## Adding CSS support

```js
const { FuseBox, SassPlugin, CSSPlugin } = require("fuse-box");
const fuse = FuseBox.init({
  target: "browser@es6",
  homeDir: "src",
  output: "dist/$name.js",
  plugins: [
    [
      SassPlugin(),
      CSSResourcePlugin({ dist: "dist/css-resources" }),
      CSSPlugin(),
    ],
  ],
});
```

| Type            | Example                                                                                                                                |
| --------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| Sass example    | [examples/css-resource-plugin-example](https://github.com/fuse-box/fuse-box-examples/tree/master/examples/css-resource-plugin-example) |
| PostCSS example | [examples/post-css-plugin-example](https://github.com/fuse-box/fuse-box-examples/tree/master/examples/post-css-plugin-example)         |

A common mistake made by rookies is not grouping (chaining) the plugins.

```js
plugins: [
  [
    SassPlugin(),
    CSSResourcePlugin({ dist: "dist/css-resources" }),
    CSSPlugin(),
  ],
  WebIndexPlugin(),
];
```

For development purposes CSS will be inlined with working sourcemaps,

## Production build

when making a production build, don't forget tell Quantum to optimise it and
store to file system

```js
plugins : [
  isProd && QuantumPlugin({ css: true });
]
```

QuantumPlugin will extract all CSS files and store it to the filesystem
including the source maps. Note that Quantum also respects Code Splitting. CSS
will be split and loaded accordingly upon split bundle request.

You can customise the path where the source maps are written. More on this topic
[here](/docs/production-builds/quantum-configuration#css)

```ts
QuantumPlugin({
  css: {
    path: "client/css-resources/styles.min.css",
  },
});
```

## Typings and CSS modules

If you are planning on using CSSModules, here is a little trick for TypeScript
that will make it stop complaining about typings:

```js
// for default imports
// e.g import style from "./main.css"
declare module "*.css" {
    const content: string;
    export default content;
}
// for regular imports
// e.g import * as styles from "./main.css"
declare module "*.css" {
    const content: string;
    export = content;
}
```
