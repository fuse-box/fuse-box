# Image Base64 Plugin

## Description
Allows images to be bundled as `base64` data. Supports most image formats, including SVGs.

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

### Require file in your code (Babel)
An example of how to use it with `react`:

```js
const image = require("./icons/image.png")
<img src={image} />
```

### Require file in your code (Typescript)
An example of how to use it with `react` in Typescript:

```js
import * as image from "./icons/image.png"
<img src={image} />
```

Note: in order to make your asset imports play nice with TSLint, you can add the following module declarations to your project:

```ts
declare module '*.jpeg';
declare module '*.jpg';
declare module '*.gif';
declare module '*.png';
declare module '*.svg';
```

Add any other image formats you need to import.

## Options
None.

## Test
To run tests
```
node test --file=ImageBase64Plugin.test.ts
```
