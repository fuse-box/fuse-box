# Babel Plugin

## Description
Transpile code to different dialects of javascript.

## Install
This package depends on the `babel-core` module.

```bash
yarn add babel-core babel-preset-es2015 babel-plugin-transform-react-jsx --dev
npm install babel-core babel-preset-es2015 babel-plugin-transform-react-jsx --save-dev
```

##### Parameters

| Name | Type | Description | ?Default |
| ---- | ---- | ----------- | -------- |
| config | `Object`  | when using other fuse-box only properties, babel config is passed in as .config |  |
| limit2project | `boolean`  | to use this plugin across an entire project (including other modules like npm) | `true` |
| extensions | `Array<string>`  | file extensions to allow with fuse-box | `[".jsx"]`
| test | `Regex`  | files to match | <code>/\\.(j&#124;t)s(x)?$/</code> |




## Examples

### JSX

```js
const {BabelPlugin} = require("fuse-box");

plugins: [
    BabelPlugin({
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

### Shorthand

when only passing in a babel config, there is no need for .config

```js
plugins: [
  BabelPlugin({
    presets: ["es2015"]
  })
]
```
