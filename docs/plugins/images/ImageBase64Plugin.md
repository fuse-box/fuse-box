# Image Base64 Plugin

## Description
Allows images to be bundled as `base64` data.

## Usage

### Setup
Import from FuseBox

```js
const {ImageBase64Plugin} = require("fuse-box");
```

Inject into a chain

```js
fuse.plugin(
     ImageBase64Plugin()
)
```

Or add it to the main config plugins list to make it available across bundles

```js
FuseBox.init({
    plugins : [
         ImageBase64Plugin()
    ]
});
```

### Require file in your code
An example of how to use it with `react`:

```js
const image = require("./icons/image.png")
<img src={image} />
```

## Options
None.

## Test
To run tests
```
node test --file=ImageBase64Plugin.test.ts
```
