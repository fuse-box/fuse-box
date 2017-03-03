# Fusebox

[![Build Status](https://travis-ci.org/fuse-box/fuse-box.svg?branch=master)](https://travis-ci.org/fuse-box/fuse-box)
[![Fusebox-bundler](https://img.shields.io/badge/gitter-join%20chat%20%E2%86%92-brightgreen.svg)](https://gitter.im/fusebox-bundler/Lobby)

[![NPM](https://nodei.co/npm/fuse-box.png?downloads=true)](https://nodei.co/npm/fuse-box/)

FuseBox is a bundler/module loader that combines the power of webpack, JSPM and SystemJS.

It is blazing fast (it takes 50-100ms to re-bundle) which makes it extremely convenient for developers. It requires zero configuration to bundle such monsters like `babel-core`.

FuseBox loves __typescript__, and does not require any additional configuration. It will compile and bundle your code within a fraction of a second, yet offering a comprehensive loader API.

It is packed with features, and unfolds limitless possibilities of extending the API.

Join [gitter channel](https://gitter.im/fusebox-bundler/Lobby), we are active! / View on [github](https://github.com/fuse-box/fuse-box) / Submit an [issue](https://github.com/fuse-box/fuse-box/issues/new) / Contribute to this [documentation](https://github.com/fuse-box/fuse-box/tree/master/docs)

## Minimum requirement
**Node v6.0.0**

## Installation

```bash
npm install fuse-box --save-dev
```

FuseBox has many plugins in place to help you get started. All you need to do is install `fuse-box` from npm.

## Sample projects

Learn how [easy it](https://github.com/fuse-box/angular2-example) is to fuse angular with `less` in __50ms__!

[react-example](https://github.com/fuse-box/react-example) 50ms to fuse!

# Why?

## Effortless bundling
You have an npm library in mind? You can bundle it without any extra configuration. babel-core with all plugins? No problem, fusebox will take care of everything you need.

__Typescript__! Oh! We love typescript. You know what you need to do, to start transpiling and bundling typescript at the same time? `Change .js to .ts` [Are you ready?](https://github.com/fuse-box/angular2-example)

FuseBox will take care of __ALL__ nodejs dependencies. We offer a comprehensive list of nodejs modules for browser out of the box. No worries, no matter what are you trying to bundle. It will work.

There is nothing that cannot be fused. Create a 3 liner config and bundle some heavy project! Do conventional import statements, use shared bundles, hack API, create crazy plugins!

And bundle it fast. Jaw-dropping fast.

## Speed

It takes 50ms for a regular project, 100ms for a big project to re-bundle. It applies aggressive but responsible module caching, which makes it fly.

Check this [benchmark](https://github.com/fuse-box/benchmark):

1200 files to bundle

|         |            |
| ------------- |:-------------:|
| FuseBox      | 0.234s |
| Webpack      | 1.376s |


1000 files to bundle / 10 times

|         |            |
| ------------- |:-------------:|
| FuseBox      | 2.257s |
| Webpack      | 13.591s |


## Built-in typescript support.

FuseBox is written in typescript, so I could not just proceed without a seamless typescript integration. In fact, you don't need to configure anything! Just point it to a typescript file, and FuseBox will do the rest.

```js
fuse.bundle(">index.ts");
```

## Comprehensive Loader API

Whatever you tempted mind would want - you can get it all here. Apply hacks, intercept require statements, use an amazing dynamic module loading, and many many other neat features!

## Extensive plugins

Have an idea in mind? Just develop a plugin, it's extremely easy to make one. Besides, we have [a few plugins](#built-in-plugins), that will help you get started. Want to develop one? Read up [here](#plugin-api)
