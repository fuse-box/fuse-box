# Raw Plugin

## Description
Allows files  to be imported as plain text.

## Usage

### Setup
Import from FuseBox

```js
const {RawPlugin} = require("fuse-box");
```

Inject into a chain

```js
fuse.plugin(
     RawPlugin()
)
```

Or add it to the main config plugins list to make it available across bundles

```js
FuseBox.init({
    plugins : [
         RawPlugin()
    ]
});
```

### Require file in your code

```js
import * as rawText from "./test.js";
```

And `test.js` content is `console.log(`This is raw content and wont be executed`)`.

You would expect to see the text above logged in your console, Well that is usually true, but this is the power of this plugin. it will import this file as text only, thus it is not going to be executed as JavaScript code.

## Options
The `RawPlugin` accepts a one parameter that can be a string or an array of strings, where you define the globing or file extension you want it to operate on. As an example :

```js
plugins:[
 RawPlugin([".txt", "inline-styles/*.css"])
]
```

The above, will apply the `RawPlugin` on all files with `.txt` extension, and only files with `.css` extension that are under the folder `inline-styles`.

## Notes
Make sure you have a valid mask with extension at the end of it. For example `RawPlugin(["asdf"])` will throw an error. But `RawPlugin(["hello.txt"])` will enable txt.

## Test
To run tests
```
node test --file=RawPlugin.test.ts
```
