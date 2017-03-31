# CoffeeScript Plugin

## Description
Allows [CoffeeScript](http://coffeescript.org/) compilation of `.coffee` files

## Usage

### Setup
Import from FuseBox

```js
const {CoffeePlugin} = require("fuse-box");
```

Inject into a chain

```js
fuse.plugin(
     CoffeePlugin()
)
```

Or add it to the main config plugins list to make it available across bundles

```js
FuseBox.init({
    plugins : [
         CoffeePlugin()
    ]
});
```

### Require file in your code

```js
import * as config from "./config.json"
```

## Options
`CoffeePlugin` accepts a `key/value` `CoffeeScript` object options as a parameter. For example:

```js
plugins: [
    [CoffeePlugin({
        bare: false,
    })]
]
```

## Test
To run tests
```
node test --file=CoffeePlugin.test.ts
```
