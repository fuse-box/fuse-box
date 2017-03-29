# AssetsPlugin

## Description
Copies your files to a destination and return a hashed URL when required. If not options are specified the plugin copies
your files into `assets` folder

## Usage

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
## Options

## File list

AssetsPlugin accepts `files` which should be an array. All expressions must be `simplified Regexp` strings. 
You can set an extension to make it globally available, or define a specific path if you wish to hanle files only in one particular folder.

Globall:

```js
AssetsPlugin({ files: [".txt", ".png"] })
```

Partial
```js
AssetsPlugin({ files: ["static/*.txt", "static/some/**.png"] })
```

## Output destination

Customise server path by providing `dest` option. Not, that your global `output` configuration is considered to be the root.
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


