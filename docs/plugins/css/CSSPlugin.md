# CSS Plugin

## Description

CSSPlugin is used to handle .css syntax.  As such, it should always be at the end of any CSS processing chain (see [#list-of-plugins](Plugin configuration) for examples of plugin chains), as it handles everything that is relating to bundling, reloading and grouping css styles.


[see the mastering css with fusebox example](https://github.com/fuse-box/mastering-css)


## Inline CSS

```js
const {CSSPlugin} = require("fuse-box")
plugins: [
  CSSPlugin(),
]
```
That configuration converts all `.css` files into a format that allows including them directly into javascript.  For example:

```js
import './main.css'
```

## Write css 

The outFile option is used to write css files to the bundle directory

```js
let tmp = './tmp'
plugins: [
    CSSPlugin({
        outFile: (file) => `${tmp}/${file}`,
    }),
]
```

FuseBox will automatically inject your files into the HEAD using link tags when imported

```js
import 'directory/main.css'
```

creates

```html
<link rel="stylesheet" type="text/css" href="main.css">
```

## Head injection

CSSPlugin automatically appends css styles or stylesheets into the HEAD by default as in the above example. You can override this behavior by setting `{inject: false}`

```js
plugins: [
    CSSPlugin({
        outFile: (file) => `${tmp}/${file}`,
        inject: false,
    }),
]
```

If you want to keep the magic but configure the injection yourself, you can provide a callback to the `inject`
parameter to customise your css file resolver in the browser

```js
plugins: [
    CSSPlugin({
        outFile: (file) => `${tmp}/${file}`,
        inject: (file) => `custom/${file}`,
    }),
]
```
Will result in:

```html
<link rel="stylesheet" type="text/css" href="custom/main.css">
```


## Grouping files
You can group many css files into a single file.  Imports of any individual file will be converted into imports of the grouped file.


```js
plugins: [
    CSSPlugin({group: "bundle.css"}),
]
```

the `group` option should not contain any relative or absolute paths. This is a virtual file in the dependency tree. You can use
all parameters described above to customise the behaviour. For example

```js
plugins: [
    CSSPlugin({
        group: "bundle.css"
    })
]
```

```js
plugins : [
    CSSPlugin({
        group: "app.css",
        outFile: `${tmp}/app.css`
    })
]
```

> NOTE! outFile must be a string (not a callback) when used with the `group` option.

Check out the tests [here](https://github.com/fuse-box/fuse-box/blob/master/src/tests/CSSPlugin.test.ts)