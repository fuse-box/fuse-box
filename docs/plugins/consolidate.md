---
id: consolidate-plugin
title: Consolidate
---

## Description

Allows importing of templates as a string in your code using the consolidate
package.

## Install

This plugin depends on the following node modules:

- `consolidate`
- Template engine(s) of your choice, e.g. `pug`, `handlebars` etc.

Please check the
[consolidate documentation](https://github.com/tj/consolidate.js) for available
template engines.

```bash
# Using yarn:
yarn add consolidate <template_engine(s)> --dev

# Using npm:
npm install consolidate <template_engine(s)> --save-dev
```

## Usage

### Setup

Import from FuseBox

```js
const { ConsolidatePlugin } = require("fuse-box");
```

Inject into a chain

```js
fuse.plugin(
  ConsolidatePlugin({
    engine: "pug",
  }),
);
```

Or add it to the main config plugins list to make it available across bundles

```js
FuseBox.init({
  plugins: [
    ConsolidatePlugin({
      engine: "pug",
    }),
  ],
});
```

## Configuration

### engine

The `engine` option is required to tell the `ConsolidatePlugin` what template
engine you want to use. For a list of available engines please refer to the
[consolidate documentation](https://github.com/tj/consolidate.js)

### extension

If you want to use a different file extension for the `ConsolidatePlugin` to
process then set the `extension` option. By default the `ConsolidatePlugin` will
use the `engine` option you provided. For example:

```js
ConsolidatePlugin({ engine: "pug" }); // will process all files with the extension `.pug` using the `pug` template engine
```

```js
ConsolidatePlugin({ engine: "pug", extension: ".custom-extension" }); // will process all files with the extension `.custom-extension` using the `pug` template engine
```

You can mix and match as you please.

### baseDir

The `baseDir` option allows you to set the root path

```js
ConsolidatePlugin({ baseDir: "my/root/path" });
```

### includeDir

The `includeDir` option allows you to set the root path to include something

```js
ConsolidatePlugin({ engine: "my/include/root/" });
```

Also, it allows to avoid `../../../../../` mess for example let's take a look at
this `pug` file:

```pug
extends ../layouts/base
block content
	include ../partials/header
	include ../partials/side-nav

	+header
	+side-nav
	section
		h2 I love ConsolidatePlugin !
```

_the `pug` file is located in `views/`_

As you can see, the `pug` file extends and includes other `pug` files. By
setting the `includeDir` option it allows you to avoid doing `../` to go outside
`views/`. So it'll look like this:

```pug
extends /layouts/base
block content
	include /partials/header
	include /partials/side-nav

	+header
	+side-nav
	section
		h2 I love ConsolidatePlugin !
```

### useDefault

`useDefault` is enable by default. So the transpiled output would look like:

```js
module.exports.default = "<!DOCTYPE html><title>eh</title>";
```

You can override it and drop back to `module.exports` by switching to
`useDefault : false`

```js
ConsolidatePlugin({ useDefault: false });
```

Which will result in:

```js
module.exports = "<!DOCTYPE html><title>eh</title>";
```

### Require file in your code

With `useDefault : false`

```js
import * as tpl from "./views/file.pug";
```

With `useDefault : true`

```js
import tpl from "./views/file.pug";
```

## Test

To run tests

```
node test --file=ConsolidatePlugin.test.ts
```
