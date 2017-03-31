# Banner Plugin

## Description
Adds a comment with static text at the top of the bundle.

## Usage

### Setup
Import from FuseBox

```js
const {Banner} = require("fuse-box");
```

Inject into a chain

```js
fuse.plugin(
     BannerPlugin()
)
```

Or add it to the main config plugins list to make it available across bundles

```js
FuseBox.init({
    plugins : [
         BannerPlugin()
    ]
});
```

### Require file in your code

## Options
The Plugin accepts one parameter as a string that contains your comment. For example:
```js
plugins: [
    // Add a banner to bundle output
    fsbx.BannerPlugin('// Hey this is my banner! Copyright 2016!'),
]
```

## Test
To run tests
```
node test --file=BannerPlugin.test.ts
```
