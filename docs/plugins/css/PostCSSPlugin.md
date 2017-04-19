# PostCSS

## Description
Handles PostCss

## Install
Install [postcss](https://github.com/postcss/postcss) and any postcss plugins first

```bash
yarn add precss postcss --dev
npm install precss postcss --save-dev
```

PostCSS generates CSS, and must be chained prior to the CSSPlugin to be used:

```js
const precss = require("precss");
const POST_CSS_PLUGINS = [precss()];
const {PostCSS, CSSPlugin} = require("fuse-box");
plugins:[
  [PostCSS(POST_CSS_PLUGINS), CSSPlugin()],
],
```