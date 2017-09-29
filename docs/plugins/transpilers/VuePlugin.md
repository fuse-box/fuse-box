# VueComponentPlugin

## Description
The VueComponentPlugin is used to transpile `.vue` files into Javascript.

## Install
This package depends on the `vue-template-compiler`, `vue-template-es2015-compiler` and `vue` node modules.

```bash
# Using yarn:
yarn add vue-template-compiler vue-template-es2015-compiler vue --dev

# Using npm:
npm install vue-template-compiler vue-template-es2015-compiler vue --save-dev
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

Or add it to the main config to make it available across bundles:
```js
FuseBox.init({
  plugins: [
    VueComponentPlugin()
  ]
});
```

## Configuration
### Defaults
If no `lang` attributes are specified (see below) the `VueComponentPlugin` will use the following configuration out of the box:

- `<template>` Defaults to `html` and uses [HTMLPlugin](/plugins/html-plugin)
- `<script>` Defaults to `ts` and uses FuseBox's integrated Typescript compiler
- `<style>` Defaults to `css` and uses [CSSPlugin](/plugins/css-plugin)

### Language Attributes
When `VueComponentPlugin` detects a `lang` attribute on a block it will attempt to match with the corresponding FuseBox plugin. For example:

- `<script lang="coffee">` - [CoffeeScriptPlugin](/plugins/coffeescript-plugin)
- `<script lang="js">` - [BabelPlugin](/plugins/babelplugin) (will read configuration from `.babelrc` file)
- `<style lang="less">` - [LESSPlugin](/plugins/less-plugin)
- `<style lang="scss">` - [SASSPlugin](/plugins/sass-plugin)

note: If using `lang="js"` and configuration item `useTypescriptCompiler: true` then FuseBox will use the internal Typescript compiler and ***not*** BabelPlugin


### Using Custom Plugin Chains
If the above functionality doesn't fit your needs, you can override the pre-processing by optionally setting the `script`, `style` or `template` options. This follows the standard FuseBox way of defining plugin chains:

```js
const { FuseBox, VueComponentPlugin, BabelPlugin, SassPlugin, CSSResourcePlugin, PostCSSPlugin, CSSPlugin } = require('fuse-box')

const fsbx = FuseBox.init({
    homeDir: './src',
    output: 'dist/app.js',
    plugins: [
      VueComponentPlugin({
          script: BabelPlugin({ ... }),
          template: HTMLPlugin({ ... })
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

note: Overriding a plugin chain for a `.vue` block will make the `VueComponentPlugin` ignore any `lang` attribute.

### Scoped Styling
Scoped styling is fully supported by using the `scoped` attribute. Support for the `module` attribute will be coming soon.

### HMR
Hot Module Reloading is also fully supported, just enable it on your bundles by calling `.hmr()`. See [here](/page/development#hot-module-reload) for more info.
