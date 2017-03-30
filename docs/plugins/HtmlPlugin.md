# HTML Plugin

## Description
Allows importing of `HTML` files as a string in your code.

## Usage

### Setup
Import from FuseBox

```js
const {HTMLPlugin} = require("fuse-box");
```

Inject into a chain

```js
fuse.plugin(
     HTMLPlugin()
)
```

Or add it to the main config plugins list to make it available across bundles

```js
FuseBox.init({
    plugins : [
         HTMLPlugin()
    ]
});
```

### Require file in your code
With `useDefault : false`

```js
import * as tpl from "./views/file.html"
```

With `useDefault : true`

```js
import  tpl from "./views/file.html"
```

## Options

### useDefault
`useDefault` is enable by default. So a transpiled code would look like:

```js
module.exports.default =  "
  <!DOCTYPE html>
  <title>eh</title>"
```

You can override it and drop back to `module.exports` by switching to `useDefault : false`

```js
HTMLPlugin({ useDefault : false})
```

Which will result in:

```js
module.exports = "
  <!DOCTYPE html>
  <title>eh</title>"
```

## Notes:
If you use the normal `ES6` import syntax  like `import  tpl from "./views/file.html"`, then there is no need for bundling your `HTML` files.

but if you intend to use `FuseBox` Lazy Load feature like `FuseBox.import("./views/file.html")` then you need to bundle them. see below example:

```js
const clientBundle = fuse.bundle("client/app")
     .watch()
     .hmr()
     .instructions(" > client/app.ts **/*.+(html|css)")
```

## Test
To run tests
```
node test --file=HTMLPlugin.test.ts
```
