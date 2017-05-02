# PlainJsPlugin
Handles cache and HMR for plain javascript

## Description
If you are using just plain javascript without transformation, this plugin will handle caching and HMR

## Usage

### Setup
Import from FuseBox

```js
const {PlainJSPlugin} = require("fuse-box");
```

Inject into a chain

```js
fuse.bundle("app").plugin(PlainJSPlugin())
```

Or add it to the main config plugins list to make it available across bundles

```js
FuseBox.init({
    plugins : [
         PlainJSPlugin()
    ]
});
```