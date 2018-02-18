# Vue Component Plugin

## Description
Transpile .vue files into JavaScript.

## Install
This plugin depends on the following node modules:
- `vue-template-compiler`
- `vue-template-es2015-compiler`
- `vue-hot-reload-api`
- `postcss-selector-parser`
- `vue`

```bash
yarn add vue-template-compiler vue-template-es2015-compiler vue-hot-reload-api vue postcss-selector-parser --dev

npm install vue-template-compiler vue-template-es2015-compiler vue-hot-reload-api vue postcss-selector-parser --save-dev
```

For more information about the `*.vue` file specifications please see the official [documentation](https://vue-loader.vuejs.org/en/start/spec.html)

## Usage
Just import from FuseBox:
```js
const { VueComponentPlugin } = require('fuse-box')
```

Inject into a chain:
```js
fuse.plugin(
  VueComponentPlugin()
)
```

note:
It's recommended to use typescript to compile your javascript. Even if you are not familiar with Typescript you can still use it to transpile modern code without dancing around the fire with a drum configuring Babel. {useTypescriptCompiler : true}

Or add it to the main config to make it available across bundles:
```js
FuseBox.init({
  useTypescriptCompiler : true,
  plugins: [
    VueComponentPlugin()
  ]
});
```


## Defaults
If no `lang` attributes are specified (see below) the `VueComponentPlugin` will use the following configuration out of the box:

- `<template>` Defaults to `html` and uses [HTMLPlugin](/plugins/html-plugin)
- `<script>` Defaults to `ts` and uses FuseBox's integrated Typescript compiler
- `<style>` Defaults to `css` and uses [CSSPlugin](/plugins/css-plugin)

## Language Attributes
When `VueComponentPlugin` detects a `lang` attribute on a block it will attempt to match with the corresponding FuseBox plugin. For example:

- `<script lang="coffee">` - [CoffeeScriptPlugin](/plugins/coffee-script-plugin)
- `<script lang="js">` - [BabelPlugin](/plugins/babel-plugin) (will read configuration from `.babelrc` file)
- `<style lang="less">` - [LESSPlugin](/plugins/less-plugin)
- `<style lang="scss">` - [SASSPlugin](/plugins/sass-plugin)
- `<template lang="pug">` - [ConsolidatePlugin](/plugins/consolidate-plugin)
- `<template lang="hogan">` - [ConsolidatePlugin](/plugins/consolidate-plugin)

In addition, the `VueComponentPlugin` will try to infer the `lang` type if it is not explicitly set but the `src` contains an extension:

```html
<template src="my-template.pug"> <!-- VueComponentPlugin will infer lang as "pug" -->
```

note: If using lang="js" and configuration item useTypescriptCompiler: true then FuseBox will use the internal Typescript compiler and NOT BabelPlugin

## Using Custom Plugin Chains
If the above functionality doesn't fit your needs, you can override the pre-processing by optionally setting the `script`, `style` or `template` options. This follows the standard FuseBox way of defining plugin chains:

```js
const { FuseBox, VueComponentPlugin, BabelPlugin, ConsolidatePlugin, SassPlugin, CSSResourcePlugin, PostCSSPlugin, CSSPlugin } = require('fuse-box')

const fsbx = FuseBox.init({
    homeDir: './src',
    output: 'dist/app.js',
    plugins: [
      VueComponentPlugin({
          script: BabelPlugin({ ... }), // consider setting useTypescriptCompiler option in FuseBox
          template: ConsolidatePlugin({ ... })
          style: [
              SassPlugin({ ... }),
              CSSResourcePlugin({ ... }),
              PostCSSPlugin( ... ),
              CSSPlugin({ ... })
          ]
      })
    ]
})
```
note: Overriding a plugin chain for a .vue block will make the VueComponentPlugin ignore any lang attributes.

## Using Typescript Decorators
If you are writing Vue components with Typescript and are making use of [vue-class-component](https://github.com/vuejs/vue-class-component) then you will need to install [tslib](https://github.com/Microsoft/tslib) and update your `tsconfig.json`:

```js
{
  "compilerOptions": {
    "importHelpers": true
  }
}
```

## External Files
The `VueComponentPlugin` fully understands the `src` attribute and will handle external files just the same as inline content.

## Scoped Styling
Scoped styling is fully supported by using the `scoped` attribute. Support for the `module` attribute will be coming soon.

## HMR
Hot Module Reloading is also fully supported, just enable it on your bundles by calling `.hmr()`. See [here](/page/development#hot-module-reload) for more info.
