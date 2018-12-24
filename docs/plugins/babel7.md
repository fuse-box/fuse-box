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

| Name          | Type            | Description                                                                     | ?Default                           |
| ------------- | --------------- | ------------------------------------------------------------------------------- | ---------------------------------- |
| config        | `Object`        | when using other fuse-box only properties, babel config is passed in as .config |                                    |
| limit2project | `boolean`       | to use this plugin across an entire project (including other modules like npm)  | `true`                             |
| extensions    | `Array<string>` | file extensions to allow with fuse-box                                          | `[".jsx"]`                         |
| test          | `Regex`         | files to match                                                                  | <code>/\\.(j&#124;t)s(x)?$/</code> |

## Examples

### JSX

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

when only passing in a babel config, there is no need for .config

```js
plugins: [
  Babel7Plugin({
    presets: ["es2015"],
  }),
];
```

note: The Babel7Plugin will merge options from your .babelrc file and any options
passed into the plugin directly. If an option exists in both, then the options
object passed into the plugin will take priority.
