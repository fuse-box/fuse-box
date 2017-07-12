# VuePlugin

## Description
The Vue plugin is used to transpile .vue files into Javascript.

## Install
This package depends on the `vue-template-compiler`, `vue-template-es2015-compiler` and one of `typescript` and `babel-core` modules.

Also, if you want to include Vue library into the bundle, remember to install `vue` module too.

```bash
# Using yarn:
yarn add vue-template-compiler vue-template-es2015-compiler typescript babel-core vue --dev

# Using npm:
npm install vue-template-compiler vue-template-es2015-compiler typescript babel-core vue --save-dev
```

## Example

```js
// fuse.js

const { FuseBox, VuePlugin } = require('fuse-box')

const fsbx = FuseBox.init({
    homeDir: './src',
    output: 'dist/app.js',
    plugins: [
        VuePlugin()
    ]
})

fsbx.dev()

fsbx.bundle('app.js')
    .instructions('>index.ts')
    .watch()

fsbx.run()

```

```typescript
// src/index.ts

import * as Vue from 'vue/dist/vue.js'
import * as App from './components/App.vue'

new Vue({
    el: '#app',
    render: h => h(App)
})

```

```html
<!-- src/components/App.vue -->

<template>
    <div>
        <p>{{ msg }}</p>
        <input type="text" v-model="msg" />
    </div>
</template>

<script>
    export default {
        name: 'app',
        data () {
            return {
                msg: 'Welcome to Your Vue.js App'
            }
        }
    }
</script>
```

## Script transpiler

By default `VuePlugin` uses `typescript` to compile contents of `<script></script>`. By defining the `lang` attribute of the `<script>` tag, content can be compiled using desired transpiler. Currently only `ts` and `babel` are supported.

### Babel

If `babel` attribute is given, VuePlugin will load babel config from there, otherwise VuePlugin will load `.babelrc` from the root of the project. If no config given and no rc found, it uses default config. Packages `babel-core` and `babel-plugin-transform-es2015-modules-commonjs` must be installed to use babel.

```js
// Configuring babel in fuse.js (Default)
VuePlugin({
    babel: {
        config: {
            "plugins": ["transform-es2015-modules-commonjs"]
        }
    }
})

// .babelrc
{
 "plugins": ["transform-es2015-modules-commonjs"]
}
```

## Template engine preprocessor

By defining the `lang` attribute of the `<template>` tag, content can be compiled to HTML using your favorite template engine.

The `consolidate` module must be installed in addition to the template engine module you want to use.

View a list of all [supported template engines](https://github.com/tj/consolidate.js#supported-template-engines).

### Example using Pug:

```bash
# Using yarn:
yarn add consolidate pug --dev

# Using npm:
npm install consolidate pug --save-dev
```

```html
<!-- src/components/App.vue -->

<template lang="pug">
    .content
        p {{ msg }}
        input(type="text", v-model="msg")
</template>

<script>
    export default {
        data () {
            return {
                msg: 'Welcome to Your Vue.js App'
            }
        }
    }
</script>
```
