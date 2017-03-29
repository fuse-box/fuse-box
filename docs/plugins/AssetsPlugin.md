# AssetsPlugin

## Description
Copies your files to a destination and return a hashed URL when required. If not options are specified the plugin copies
your files into `assets` folder

## Usage

### Setting up
Import from FuseBox
```js
const {AssetsPlugin} = require("fuse-box");
```

Inject into a chain
```js
fuse.plugin(
     AssetsPlugin({ files: ["*.txt"] })
)
```

Or add it to the plugin list to make available across bundles
```js
FuseBox.init({
    plugins : [
        AssetsPlugin({ files: ["*.txt"] })
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

## ES6 Default

`default` is enable by default. So a transpiled code would look like:

```js
module.exports.default = "/assets/43e9685c-foo.txt";
```

You can override it and drop back to `module.exports` by switching to `useDefault : false`

```js
AssetsPlugin({ useDefault : false, files: [".txt", ".png"] })
```

Will result in:

```js
module.exports = "/assets/43e9685c-foo.txt";
```


## File list

AssetsPlugin accepts `files` which should be an array. All expressions must be `simplified Regexp` strings. 
You can set an extension to make it globally available, or define a specific path if you wish to handle files only in one particular folder.

Globall:

```js
AssetsPlugin({ files: [".txt", ".png"] })
```

Partial
```js
AssetsPlugin({ files: ["static/*.txt", "static/some/**.png"] })
```

## Output destination

Customise server path by providing `dest` option. Note, that your global `output` configuration is considered to be the root.
Don't set an absolute path as it will break the overal cosistency (global settings for hashing for example)

Globall:

```js
AssetsPlugin({ files: [".txt", ".png"], dest : "static" })
```

AssetPlugin will still resolve it as `assets/foo.txt` if  no `resolve` options is set

## Resolve on browser

You can customise path resolving. 
```js
AssetsPlugin({ files: [".txt", ".png"], dest : "static", resolve : "static/files" })
```
If you copy `foo.txt` it will result in `/static/92849cf0-hello.txt`, however you will receive `/static/files/92849cf0-hello.txt`


## Test
To run tests
```
node test --file=AssetsPlugin.test.ts
```


