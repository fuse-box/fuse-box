# Less Plugin

## Description
Handles Less CSS pre-processor files.

## Install

```bash
yarn add less --dev
npm install less --save-dev
```

## Usage
check [Less website](http://lesscss.org/) for more information.
note: The less plugin generates CSS, Therefor it must be chained prior to the CSSPlugin to be used.

### Setup

Import from FuseBox

```js
const {LESSPlugin} = require("fuse-box");
```

Inject into a chain.

```js
fuse.plugin(
     [LESSPlugin(), CSSPlugin()]
)
```

Or add it to the main config plugins list to make it available across bundles.

```js
FuseBox.init({
    plugins : [
         [LESSPlugin(), CSSPlugin()]
    ]
});
```

### Require file in your code
```js
import "./styles/main.less"
```

## Options

`LessPlugin` accepts a `key/value` `Less` object options as a parameter. For example:

```js
fuse.plugin(
    [LESSPlugin({
        paths: [path.join(__dirname, 'less', 'includes')]
    }), CSSPlugin()]
)
```

note: Sourcemaps are not yet properly handled.  Development is ongoing on this feature