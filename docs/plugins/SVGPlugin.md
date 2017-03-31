# SVG Plugin

## Description
Allows  importing `.svg` graphics files into javascript source for use in styles and as image source.

## Usage

### Setup
Import from FuseBox

```js
const {SVGPlugin} = require("fuse-box");
```

Inject into a chain

```js
fuse.plugin(
     SVGPlugin()
)
```

Or add it to the main config plugins list to make it available across bundles

```js
FuseBox.init({
    plugins : [
         SVGPlugin()
    ]
});
```

### Require file in your code

```js
import logo from './logo.svg';
```

Here is an [example](https://github.com/fuse-box/react-example/blob/master/fuse.js) usage, and the [source](https://github.com/fuse-box/react-example/blob/master/src/App.jsx#L10) file that imports the SVG.

## Options
None.

## Test
To run tests
```
node test --file=SVGPlugin.test.ts
```
