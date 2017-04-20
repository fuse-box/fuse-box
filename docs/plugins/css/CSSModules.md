# CSSModules

## Description
CSSModules allow you to include stylesheets as key value map of the
class name in your file to the transformed value.

## Install
Using the CSSModules plugin requires postcss-modules to transform the
stylesheet into a JSON representation.

```bash
yarn add postcss-modules --dev

// OR

npm install postcss-modules --save-dev
```

## Usage
After that you can use the `CSSModules` and `CSSPlugin` in your
configuration in either the chainable or in the following verbose
manner.

```js
import {Fusebox, CSSModules, CSSPlugin} from 'fuse-box'

Fusebox.init({
  homeDir: 'src',
  output: 'dist/$name.js',
  plugins: [
    CSSModules(),
    CSSPlugin(),
  ],
})
.bundle('app')
.instructions('>index.js')
```

The configuration above will enter `src/index.js` and parse every
imported stylesheet and return a JSON object that can be used in your
file.

A React example may look like the following:

```js
import React from 'react'
import styles from './styles.css'

export default () => <button className={styles.button}>Warp Drive<button>
```

## Options
By default, `postcss-modules` uses the default export of your `css`
file. To disable that pass `useDefault: false` when initializing the
plugin.

```js
CSSModules({
  useDefault: false,
})
```

## Development mode
In development, the imported stylesheets are appended to the `<head>` of
the document by the outputted JavaScript bundle. This allows for the files
to be hot reloaded individually.

```js
fuse.bundle("app")
    .plugin(CSSModules(), CSSPlugin())
    .instructions("> index.ts");
```

## Production mode
The following groups all of the imported `css` files into a single
`bundle.css` and puts in the `dist` folder. Hot reloading is *not*
available when outputting to a single bundle as it's up to the view
itself to call for the asset - for example the `index.html` file.

```js
fuse.bundle("app")
    .plugin(CSSModules(), CSSPlugin({
        group: "bundle.css",
        outFile: `dist/bundle.css`
    }))
    .instructions("> index.ts");
```
