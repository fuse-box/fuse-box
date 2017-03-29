# Html Plugin

## Description
Allows importing of `HTML` files as a string in your code.

## Usage

### Setup
Import from FuseBox
```js
const {HtmlPlugin} = require("fuse-box");
```

Inject into a chain
```js
fuse.plugin(
     HtmlPlugin()
)
```

Or add it to the plugin list to make available across bundles
```js
FuseBox.init({
    plugins : [
         HtmlPlugin()
    ]
});
```

### Require file in your code
With `useDefault : false`
```js
import * as tpl from "~/views/file.html"
```

With `useDefault : true`

```js
import  tpl from "~/views/file.html"
```
## Options

### ES6 Default
default` is enable by default. So a transpiled code would look like:

```js
module.exports.default =  "
  <!DOCTYPE html>
  <title>eh</title>"
```

You can override it and drop back to `module.exports` by switching to `useDefault : false`

```js
CopyPlugin({ useDefault : false, files: [".txt", ".png"] })
```

Will result in:

```js
module.exports = "
  <!DOCTYPE html>
  <title>eh</title>"
```

## Notes:
Remember to bundle your `HTML` files when using this plugin.

```js
const clientBundle = fuse.bundle("client/app")
     .watch()
     .hmr()
     .instructions(" > client/app.ts **/*.+(html|css)")
```