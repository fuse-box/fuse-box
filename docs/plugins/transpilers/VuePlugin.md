# VuePlugin

## Description
The Vue plugin is used to transpile .vue files into Javascript.

## Install
This package depends on the `vue-template-compiler` and `typescript` modules.

Also, if you want to include Vue library into the bundle, remember to install `vue` module too.

```bash
yarn add vue-template-compiler typescript vue --dev
npm install vue-template-compiler typescript vue --save-dev
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
