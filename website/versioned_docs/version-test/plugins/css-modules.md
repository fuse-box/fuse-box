---
id: version-test-css-modules-plugin
title: CSSModulesPlugin
original_id: css-modules-plugin
---

## Description

CSSModulesPlugin allow you to include stylesheets as key value map of the class
name in your file to the transformed value.

## Install

Using the CSSModulesPlugin plugin requires postcss-modules to transform the
stylesheet into a JSON representation.

```bash
yarn add postcss-modules --dev

// OR

npm install postcss-modules --save-dev
```

## Usage

After that you can use the `CSSModulesPlugin` and `CSSPlugin` in your
configuration in either the chainable or in the following verbose manner.

Import from FuseBox

```js
import { Fusebox, CSSModulesPlugin, CSSPlugin } from "fuse-box";
```

```js
Fusebox.init({
  homeDir: "src",
  output: "dist/$name.js",
  plugins: [[CSSModulesPlugin(), CSSPlugin()]],
})
  .bundle("app")
  .instructions(">index.js");
```

The configuration above will enter `src/index.js` and parse every imported
stylesheet and return a JSON object that can be used in your file.

A React example may look like the following:

```js
import React from 'react'
import styles from './styles.css'

export default () => <button className={styles.button}>Warp Drive<button>
```

### Use with SassPlugin

Yes, you can chain this with the SassPlugin (and other CSS pre-processor
plugins). Here's an example:

Set up FuseBox

```js
Fusebox.init({
  homeDir: "src",
  output: "dist/$name.js",
  plugins: [[SassPlugin(), CSSModulesPlugin(), CSSPlugin()]],
})
  .bundle("app")
  .instructions(">index.js");
```

Use in code:

CSS

```css
.myClass {
  color: red;
}
```

TS

```ts
import styles from "./Home.scss";

<h1 className={styles.myClass}>Welcome homes!</h1>;
```

Note: in order to make your asset imports play nice with TSLint, you can add the
following module declarations to your project:

```ts
declare module "*.scss";
```

## Options

### useDefault

By default, `CSSModulesPlugin` uses the default export of your `css` file. To
disable that pass `useDefault: false` when initializing the plugin.

```js
CSSModulesPlugin({
  useDefault: false,
});
```

### generateScopedName

By default, `CSSModulesPlugin` uses the following class naming strategy:

```
_[local]___[hash:base64:5]
```

To override that, use the `scopedName` property when initializing the plugin.

```js
CSSModulesPlugin({
  scopedName: "[name]__[local]___[hash:base64:3]",
});
```

### root

Set `postcss-modules` root path. _see wef_

```js
CSSModulesPlugin({
  root: path.resolve(__dirname, "src"),
});
```

## Development mode

In development, the imported stylesheets are appended to the `<head>` of the
document by the outputted JavaScript bundle. This allows for the files to be hot
reloaded individually.

```js
fuse
  .bundle("app")
  .plugin(CSSModulesPlugin(), CSSPlugin())
  .instructions("> index.ts");
```

## Production mode

The following groups all of the imported `css` files into a single `bundle.css`
and puts in the `dist` folder. Hot reloading is _not_ available when outputting
to a single bundle as it's up to the view itself to call for the asset - for
example the `index.html` file.

```js
fuse
  .bundle("app")
  .plugin(
    CSSModulesPlugin(),
    CSSPlugin({
      group: "bundle.css",
      outFile: `dist/bundle.css`,
    }),
  )
  .instructions("> index.ts");
```
