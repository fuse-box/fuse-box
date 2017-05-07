# CSSModules Plugin

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

Import from FuseBox

```js
import {Fusebox, CSSModules, CSSPlugin} from 'fuse-box'
```

```js
Fusebox.init({
  homeDir: 'src',
  output: 'dist/$name.js',
  plugins: [
    [ CSSModules(), CSSPlugin() ]
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

### Use with SassPlugin
Yes, you can chain this with the SassPlugin (and other CSS pre-processor plugins). Here's an example:

Set up FuseBox

```js
Fusebox.init({
  homeDir: 'src',
  output: 'dist/$name.js',
  plugins: [
    [SassPlugin(), CSSModules(), CSSPlugin()]
  ]
})
.bundle('app')
.instructions('>index.js')
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
import styles from './Home.scss';

<h1 className={styles.myClass}>Welcome homes!</h1>
```

Note: in order to make your asset imports play nice with TSLint, you can add the following module declarations to your project:

```ts
declare module '*.scss';
```

## Options

### useDefault

By default, `CSSModules` uses the default export of your `css`
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
