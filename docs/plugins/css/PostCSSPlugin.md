# PostCSS Plugin

## Description
Allows using PostCSS, A tool for transforming CSS with JavaScript.

## Install

```bash
yarn add postcss --dev
// OR
npm install postcss --save-dev
```

## Usage
check [PostCSS website](http://postcss.org/) for more information.
note: The PostCSS plugin generates CSS, Therefor it must be chained prior to the CSSPlugin to be used.

### Setup

Import from FuseBox

```js
const {PostCSSPlugin} = require("fuse-box");
```

Inject into a chain.

```js
fuse.plugin(
     [PostCSSPlugin(), CSSPlugin()]
)
```

Or add it to the main config plugins list to make it available across bundles.

```js
FuseBox.init({
    plugins : [
         [PostCSSPlugin(), CSSPlugin()]
    ]
});
```

### Require file in your code
```js
import "./styles/main.css"
```

## Options

`PostCSSPlugin` accepts a `key/value` `PostCSS` object options as a parameter. For example:

```js
var nested = require('postcss-nested');
var sugarss = require('sugarss');

fuse.plugin(
    [PostCSSPlugin({
       plugins, { parser: sugarss }
    }), CSSPlugin()]
)
```