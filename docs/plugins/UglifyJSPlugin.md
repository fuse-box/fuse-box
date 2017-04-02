# UglifyJS Plugin

## Description
Compresses the javascript code by using [UglifyJS2](https://github.com/mishoo/UglifyJS2)

## Usage

### Setup
Import from FuseBox

```js
const {UglifyJSPlugin} = require("fuse-box");
```

Inject into a chain

```js
fuse.plugin(
     UglifyJSPlugin()
)
```

Or add it to the main config plugins list to make it available across bundles

```js
FuseBox.init({
    plugins : [
         UglifyJSPlugin()
    ]
});
```

### Require file in your code

## Options
The plugin accepts an object that is the original `UglifyJS` options as a parameter. For example:
```js
FuseBox.init({
    plugins: [
        UglifyJSPlugin({
            mangle: {
                toplevel: true,
                screw_ie8: true
            }
        })
    ]
});
```

## Test
To run tests
```
node test --file=UglifyJSPlugin.test.ts
```
