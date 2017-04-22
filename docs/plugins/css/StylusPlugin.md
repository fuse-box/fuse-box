# Stylus Plugin

## Description
Allows using Stylus, An expressive, dynamic, robust CSS.

## Install

```bash
yarn add stylus --dev
// OR
npm install stylus --save-dev
```

## Usage
check [Stylus website](http://stylus-lang.com/) for more information.
note: The Stylus plugin generates CSS, Therefor it must be chained prior to the CSSPlugin to be used.

### Setup

Import from FuseBox

```js
const {StylusPlugin} = require("fuse-box");
```

Inject into a chain.

```js
fuse.plugin(
     [StylusPlugin(), CSSPlugin()]
)
```

Or add it to the main config plugins list to make it available across bundles.

```js
FuseBox.init({
    plugins : [
         [StylusPlugin(), CSSPlugin()]
    ]
});
```

### Require file in your code
```js
import "./styles/main.styl"
```

## Options

`StylusPlugin` accepts a `key/value` `Stylus` object options as a parameter. For example:

```js
fuse.plugin(
    [StylusPlugin({
       compress: true
    }), CSSPlugin()]
)
```