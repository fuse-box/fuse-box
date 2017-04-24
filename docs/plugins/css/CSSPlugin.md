# CSS Plugin

## Description
CSSPlugin is used to handle .css syntax.  As such, it should always be at the end of any CSS processing chain (see [#list-of-plugins](Plugin configuration) for examples of plugin chains), as it handles everything that is relating to bundling, reloading and grouping css styles.

[see the mastering css with fusebox example](https://github.com/fuse-box/mastering-css)

## Usage

### Setup

Import from FuseBox

```js
const {CSSPlugin} = require("fuse-box");
```

Inject into a chain

```js
fuse.plugin(
     CSSPlugin()
)
```

Or add it to the main config plugins list to make it available across bundles

```js
FuseBox.init({
    plugins : [
         CSSPlugin()
    ]
});
```

### Require file in your code
`import './main.css'`

With the example above and default configuration, `FuseBox` will converts `main.css` file into a format that allows including it directly into javascript.

## Options

### outFile

The outFile option is used to bundle the `CSS` and write them to a file in your bundle folder. `outFile` accepts a string or a function as parameter, if string is used the file that will be written to disk will have the name defined in the string, on the other hand, If a function is passed you would have more flexibility by defining placeholders that will formulate the path of the file to be written. for example :

```js
let tmp = './tmp'
plugins: [
    CSSPlugin({
        outFile: (file) => `${tmp}/${file}`,
    }),
]
```
The above will write the `CSS` file into your bundle folder as follows `myProject/dist/tmp/myBundle.css`

### inject
By default it is `true`. `FuseBox` will automatically inject your files into the HEAD using link tags when imported. For example:

```js
import 'directory/main.css'
```

will add the below to your Page.

```html
<link rel="stylesheet" type="text/css" href="main.css">
```

If you want to keep the magic but configure the injection yourself, you can provide a callback to the inject parameter to customise your css file resolver in the browser. For example:

```js
plugins: [
    CSSPlugin({
        outFile: (file) => `${tmp}/${file}`,
        inject: (file) => `custom/${file}`,
    }),
]
```

The above will result in:

```html
<link rel="stylesheet" type="text/css" href="custom/main.css">
```

### group
You can group many css files into a single file.  Imports of any individual file will be converted into imports of the grouped file. For Example:


```js
plugins: [
    CSSPlugin({group: "bundle.css"}),
]
```

The `group` option should not contain any relative or absolute paths. This is a virtual file in the dependency tree. You can use all parameters described above to customise the behaviour. For example:

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