# Introduction

[![Build Status](https://travis-ci.org/fuse-box/fuse-box.svg?branch=master)](https://travis-ci.org/fuse-box/fuse-box)
[![Fusebox-bundler](https://img.shields.io/badge/gitter-join%20chat%20%E2%86%92-brightgreen.svg)](https://gitter.im/fusebox-bundler/Lobby)

# FuseBox

> We are getting there. The API is stable. Documentation is in progress.
> Join [gitter channel](https://gitter.im/fusebox-bundler/Lobb), we are active!

## A heroic bundler, that just does it right

FuseBox is a bundler/module loader that combines the power of webpack, JSPM and SystemJS. It is blazing fast (it takes 50-100ms to re-bundle) which makes it extremely convenient for developers. It requires zero configuration to bundle such monsters like `babel-core`, it will compile and bundle your typescript project within a fraction of a second, yet offering a comprehensive loader API. It is packed with features, and unfolds limitless possibilities of extending the API.

Start fusing!

[Angular2 + less](https://github.com/fuse-box/angular2-example) 50ms to fuse!

[react-example](https://github.com/fuse-box/react-example) 50ms to fuse!

## Recent updates
* 1.3.24 Added [BannerPlugin](#bannerplugin) (shepless)
* 1.3.21-23 Require options introduced. Added [StylusPlugin](#stylusplugin), Raw style options for CSSPlugin (big thanks to _kai_ and _shepless_),
* v1.3.18-1.3.21 PluginChains introduced! Added [PostCSSPlugin](#postcssplugin) [LESSPlugin](#lessplugin) (thanks shepless)
* v1.3.17 Added [wildcard import](#wildcard-import) support
* v1.3.16 Prints a pretty stacktrace instead of unreadable acorn exceptions.

## Why fusebox?

### Bundle anything without an extra effort
You have an npm library in mind? You can bundle it without any extra configuration. babel-core with all plugins? No problem, fusebox will take care of everything you need.

__Typescript__! Oh! We love typescript. You know what you need to do, to start transpiling and bundling typescript at the same time? `Change .js to .ts` [Are you ready?](https://github.com/fuse-box/angular2-example) 

FuseBox will take care of __ALL__ nodejs depedendencies. We offer a comprehensive list of nodejs modules for browser out of the box. No worries, no matter what are you trying to bundle. It will work. 

There is nothing that cannot be fused. Create a 3 liner config and bundle some heavy project! Do conventional import statements, use shared bundles, hack API, create crazy plugins!

And bundle it fast. Jaw-dropping fast.

### It is blazing fast

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


### Built-in typescript support.

FuseBox is written in typescript, so I could not just proceed without a seamless typescript integration. In fact, you don't need to configure anything! Just point it to a typescript file, and FuseBox will do the rest.

```js
fuseBox.bundle(">index.ts");
```

### Comprehensive Loader API
