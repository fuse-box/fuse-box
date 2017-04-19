# BabelPlugin

## Description
The babel plugin is used to transpile code to different dialects of javascript.

## Install
The npm `babel-core` package must be installed to use the babel plugin.

For example, to transpile JSX, you can use this configuration:

```bash
yarn add babel-core babel-preset-es2015 babel-plugin-transform-react-jsx --dev
npm install babel-core babel-preset-es2015 babel-plugin-transform-react-jsx --save-dev
```
## Usage


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

`limit2project` is default true, to use this plugin across an entire project (including other modules like npm)