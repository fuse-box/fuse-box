# Web Index Plugin


## Description
Generates a HTML file once a producer's job is completed

## Usage

### Setup
Import from FuseBox

```js
const { WebIndexPlugin } = require("fuse-box");
```

Inject into a chain

```js
fuse.plugin(
    WebIndexPlugin()
)
```

## Options

| Name | Meaning |
| ------------- | ------------- |
| ` title `   | Sets the title  |
| ` bundles ` | Provide a list of bundle names (if not set all registered bundles are through) |
| ` path `   | The relative url bundles are served from. Default is `/`. Empty is set with `.`  |
| ` template `   | Provide a path to your own template  |
| ` templateString `   | Provide your own template as a string  |
| ` target `   | The main filename. Default is `index.html`  |
| ` resolve `   | `resolve ?: {(output : UserOutput) : string}` Allows to completely override the output  |

note: If you specify template and templateString then template will take precedent 

### Resolve example
`resolve` option allows you to completely override the path

```js
WebIndexPlugin({
    resolve : output => output.lastPrimaryOutput.filename
})
```


## Custom template

A custom template has the following macro available:

| Symbol | Meaning |
| ------------- | ------------- |
| ` $title `   | Html Title  |
| ` $bundles `   | A list of script tags |

github_example: vendor-splitting
