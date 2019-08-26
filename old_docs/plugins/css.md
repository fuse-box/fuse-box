---
id: css-plugin
title: CSSPlugin
---

## Description

CSSPlugin is used to handle .css syntax. As such, it should always be at the end
of any CSS processing chain (see [#list-of-plugins](Plugin configuration) for
examples of plugin chains), as it handles everything that is relating to
bundling, reloading and grouping css styles.

## Usage

### Setup

Import from FuseBox

```js
const { CSSPlugin } = require("fuse-box");
```

Add it to the main config plugins list to make it available across bundles

```js
FuseBox.init({
  plugins: [CSSPlugin()],
});
```

### Require file in your code

`import './main.css'`

With the example above and default configuration, `FuseBox` will convert
`main.css` file into a format to be injected into client's code. Production
optimisations are available when QuantumPlugin is enabled.

## Options

CSS Plugin accepts no options. Since development handled entirely in browser's
memory. Use `QuantumPlugin({css : true})` to write the files to the file system.
