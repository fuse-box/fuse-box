---
id: babel7-plugin
title: Babel7Plugin
---

## Description

Transpile code to different dialects of javascript.

## Install

This package depends on the `@babel/core` module.

```bash
yarn add @babel/core @babel/preset-env @babel/preset-react --dev
npm install @babel/core @babel/preset-env @babel/preset-react --save-dev
```

##### Parameters

| Name          | Type                                 | Description                                                                                                                                                                                                                                                   | ?Default                           |
| ------------- | ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------- |
| configFile    | `String` \| `Boolean` \| `undefined` | Relative path to `.babelrc` or `babel.config.js` babel config file from FuseBox' `homeDir`. When not set or `undefined`, it will lookup for a config file relatively to `homeDir` and auto-load if any found. To disable auto-load and lookup, set to `false` | `undefined`                        |
| config        | `Object`                             | Babel config options. Takes priority over configuration loaded from `configFile`                                                                                                                                                                              | `undefined`                        |
| limit2project | `boolean`                            | To use this plugin across an entire project (including other modules like npm)                                                                                                                                                                                | `true`                             |
| extensions    | `Array<string>`                      | File extensions allowed to be transpiled with fuse-box                                                                                                                                                                                                        | `[".js", ".jsx", ".ts", ".tsx"]`   |
| test          | `Regex`                              | RegExp for matching file extensions                                                                                                                                                                                                                           | <code>/\\.(j&#124;t)s(x)?$/</code> |

## Examples

### JSX and Source-Maps

```js
const { Babel7Plugin } = require("fuse-box");

plugins: [
  Babel7Plugin({
    config: {
      sourceMaps: true,
      presets: ["@babel/preset-env", "@babel/preset-react"],
    },
  }),
];
```

### Shorthand

when only passing in a babel config, there is no need to specify `config`
property

```js
plugins: [
  Babel7Plugin({
    presets: ["@babel/preset-env"],
  }),
];
```

### Loading `.babelrc` babel configuration

- assuming `.babelrc` is located in `./config`
- assuming `fuse.js` is located in `./` with `homeDir: './'`

```js
plugins: [Babel7Plugin({ configFile: "./config/.babelrc" })];
```

### Loading project-wide JavaScript babel configuration

- assuming `babel.config.js` is located in `./config`
- assuming `fuse.js` is located in `./` with `homeDir: './'`

```js
plugins: [Babel7Plugin({ configFile: "./config/babel.config.js" })];
```

## Notes

- `babel.config.js` must have an object as default export
- If you want to disable lookup for config files and do only manual
  configuration, set `configFile: false` and provide configuration options to
  `config` (e.g: `config: { presets: [...] }`)
