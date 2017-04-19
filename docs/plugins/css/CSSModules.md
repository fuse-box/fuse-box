# CSSModules

## Description
Converts your CSS files into modules

## Install

```bash
yarn add postcss-modules --dev
npm install postcss-modules --save-dev
```

Import the plugin from `fuse-box`

```js
const {  CSSModules, CSSPlugin } = require("fuse-box");
```

Add it to your chain


## Development mode 

```js
fuse.bundle("app")
    .plugin(CSSModules(), CSSPlugin())
    .instructions("> index.ts");
```

## Production mode

No HMR available in this mode
```js
fuse.bundle("app")
    .plugin(CSSModules(), CSSPlugin({
        group: "bundle.css",
        outFile: `dist/bundle.css`
    }))
    .instructions("> index.ts");
```




