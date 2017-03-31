# Copy Plugin

## Description
Copies your files to a destination folder and return a hashed URL when required in your code. If no options are specified, the plugin copies your files into `assets` folder

## Usage

### Setup
Import from FuseBox

```js
const {CopyPlugin} = require("fuse-box");
```

Inject into a chain

```js
fuse.plugin(
     CopyPlugin({ files: ["*.txt"] })
)
```

Or add it to the main config plugins list to make it available across bundles

```js
FuseBox.init({
    plugins : [
        CopyPlugin({ files: ["*.txt"] })
    ]
});
```

### Require file in your code
With `useDefault : false`

```js
import * as foo from "./foo.txt"
```

With `useDefault : true`

```js
import foo from "./foo.txt"
```

## Options

## useDefault

`useDefault` is enabled by default. So a transpiled code would look like:

```js
module.exports.default = "/assets/43e9685c-foo.txt";
```

You can override it and drop back to `module.exports` by switching to `useDefault : false`

```js
CopyPlugin({ useDefault : false, files: [".txt", ".png"] })
```

Will result in:

```js
module.exports = "/assets/43e9685c-foo.txt";
```


## files

CopyPlugin accepts `files` which should be an array. All expressions must be `simplified Regexp` strings. 
You can set an extension to make it globally available, or define a specific path if you wish to handle files only in one particular folder.

Global:

```js
CopyPlugin({ files: [".txt", ".png"] })
```

Partial

```js
CopyPlugin({ files: ["static/*.txt", "static/some/**.png"] })
```

## dest

Customise server path by providing `dest` option. Note, that your global `output` configuration is considered to be the root.
Don't set an absolute path as it will break the overall consistency (global settings for hashing for example).

Global:

```js
CopyPlugin({ files: [".txt", ".png"], dest : "static" })
```

CopyPlugin will still resolve it as `assets/foo.txt` if  no `resolve` options is set.

## resolve

You can customise path resolving in the browser.
```js
CopyPlugin({ files: [".txt", ".png"], dest : "static", resolve : "static/files" })
```

If you copy `foo.txt` it will result in `/static/92849cf0-hello.txt`, however you will receive `/static/files/92849cf0-hello.txt`


## Test
To run tests
```
node test --file=CopyPlugin.test.ts
```


