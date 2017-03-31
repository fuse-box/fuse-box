# JSON Plugin

## Description
Allows `.json` files to be imported as javascript objects

## Usage

### Setup
Import from FuseBox

```js
const {JSONPlugin} = require("fuse-box");
```

Inject into a chain

```js
fuse.plugin(
     JSONPlugin()
)
```

Or add it to the main config plugins list to make it available across bundles

```js
FuseBox.init({
    plugins : [
         JSONPlugin()
    ]
});
```

### Require file in your code

```js
import * as config from "./config.json"
```

## Options
None.

## Test
To run tests
```
node test --file=JSONPlugin.test.ts
```
