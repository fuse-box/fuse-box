# WebIndexPlugin


## Description
Generates a HTML file once a producer's job is completed

note: This plugin is under development



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
| ` target `   | The main filename. Default is `index.html`  |



## Custom template

A custom template has the following macro available:

| Symbol | Meaning |
| ------------- | ------------- |
| ` $title `   | Html Title  |
| ` $bundles `   | A list of script tags |

github_example: vendor-splitting
