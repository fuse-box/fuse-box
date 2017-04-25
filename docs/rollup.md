# Rollup

For those how are into minimalist bundles, FuseBox offers built-in `Rollup` support.

At the moment it works only on typescript projects, this is because typescript is used to transpile your code from es6 to es5 in the virtual file system.

## Installation

```bash
yarn add rollup typescript --dev
npm install rollup typescript --save-dev
```

## Requirements

There are few things that you need to consider before jumping it:

steps:
    * All your modules need to be using es6 imports
    * Use external library that support ONLY ["jsnext:main"](https://github.com/jsforum/jsforum/issues/5)
    * Read [rollup documentation](rollupjs.org)
    * FuseBox API will NOT be included. You won't be able to use ANY of the FuseBox features.

If you are comfortable with the above setup, you can proceed by [checking out the fuse-box-rollup-example](https://github.com/fuse-box/fuse-box-rollup-example):

```bash
git clone git@github.com:fuse-box/fuse-box-rollup-example.git
npm install
node fuse
```

## How it works

steps:
 * your code is bundled with fusebox
 * the bundle is decorated with the features fusebox provides
 * rollup is sent instructions to use the virtual fusebox's file-system
 * magic

## Configuration

```js
rollup: {
    bundle: {
        moduleName: "Fuse4ever",
    },
    entry: "index.js",
    treeshake: true,
}
```

`Bundle` contains configuration that happen at the latest stage of rollup. Everything is a primary configuration. You will not be able to use Rollup plugins (for now), as FuseBox injects it's own plugin for resolving modules. However, this means you are able to use the rest of the features FuseBox has to offer, such as [aliases](/page/configuration#alias)
