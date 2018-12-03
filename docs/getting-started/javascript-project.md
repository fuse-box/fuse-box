---
id: javascript-project
title: JavaScript project
---

In order to start with JavaScript you need to use either
[BabelPlugin](/docs/plugins/babel-plugin) or simply install `TypeScript` which
is the recommended way. We will go with `TypeScript` compiler approach, as it's
the most effecient and stable approach.

You can find an example [here](https://github.com/fuse-box/react-example)

## Install TypeScript

Don't be put off by us asking you to install TypeScript, you won't even know its
presence. FuseBox uses `TypeScript` to transpile your javascript modules.

```bash
npm install typescript --save-dev
```

## Getting started with JavaScript

Create `fuse.js` with the following javascript code.

```js
const { FuseBox, WebIndexPlugin } = require("fuse-box");
const fuse = FuseBox.init({
  homeDir: "src",
  target: "browser@es6",
  output: "dist/$name.js",
  useTypescriptCompiler: true,
  plugins: [WebIndexPlugin()],
});
fuse.dev(); // launch http server
fuse
  .bundle("app")
  .instructions(" > index.jsx")
  .hmr()
  .watch();
fuse.run();
```

## Changing JavaScript target

You can override the target by changing the `FuseBox.init` configuration

```ts
const fuse = FuseBox.init({
  homeDir: "src",
  target: "browser@es6",
  output: "dist/$name.js",
});
```

Read more about targets in [this section](/docs/guides/working-with-targets)

## Synthetic Default Imports

FuseBox doesn't polyfill default imports by default.

Correct:

```js
import * as React from "react";
```

NOT correct:

```js
import React from "react"; // <-- not correct
```

If you really want to make it work you can enable
[allowSyntheticDefaultImports](/docs/development/configuration#allowsyntheticdefaultimports).

However, it's not recommended adding this option as it adds additional overhead
to your runtime.
