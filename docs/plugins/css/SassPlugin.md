# SassPlugin

## Description
Generates CSS, and must be chained prior to the CSSPlugin to be used:

[Sass](http://sass-lang.com/)

```bash
yarn add node-less --dev
npm install node-sass --save-dev
```

## Usage:
```js
plugins:[
  [SassPlugin({ /* options */ }), CSSPlugin()],
],
```

## Macros

To enable macros add:
```js
SassPlugin({importer : true})
```

By default, you have 3 macros available:

That same as [home directory](#home-directory)
```css
@import '$homeDir/test2.scss';
```

Your application root.

```css
@import '$appRoot/src/test.scss';
```

`Tilde` that points to node_modules
```css
@import '~bootstrap/dist/bootstrap.css';
```

You can override any of these by providing a key:

```js
plugins: [
    [ SassPlugin({ importer : true, macros: { "$homeDir": "custom/dir/" }}), CSSPlugin() ]
]
```
