![logo](logo.png)


[![Build Status](https://travis-ci.org/fuse-box/fuse-box.svg?branch=master)](https://travis-ci.org/fuse-box/fuse-box)
[![Fusebox-bundler](https://img.shields.io/badge/gitter-join%20chat%20%E2%86%92-brightgreen.svg)](https://gitter.im/fusebox-bundler/Lobby)


[![NPM](https://nodei.co/npm/fuse-box.png?downloads=true)](https://nodei.co/npm/fuse-box/)


# FuseBox
http://fuse-box.org/
FuseBox is a bundler/module loader that combines the power of webpack, JSPM and SystemJS. 

It is blazing fast (it takes 50-100ms to re-bundle) which makes it extremely convenient for developers. It requires zero configuration to bundle such monsters like `babel-core`.

FuseBox loves __typescript__, and does not require any additional configuration. It will compile and bundle your code within a fraction of a second, yet offering a comprehensive loader API. It is packed with features, and unfolds limitless possibilities of extending the API.

Watch a [4 minute intro video on youtube](https://www.youtube.com/watch?v=gCfWVRsWoKA).

Follow us on [twitter](https://twitter.com/FuseBoxJS)

Upvote your [favourite feature](https://productpains.com/product/fusebox)

You have created an awesome plugin? Add it to the [list](https://github.com/fuse-box/fuse-box/blob/master/docs/third-party-plugins.md)



- [Official Documentation](http://fuse-box.org/)
- [Submit an Issue](https://github.com/fuse-box/fuse-box/issues/new)
- [Make Documentation Better](https://github.com/fuse-box/fuse-box/tree/master/docs)
- [Join Gitter Channel](https://gitter.im/fusebox-bundler/Lobby) (we are active!)


## Installation

FuseBox has many plugins in place to help you get started. All you need to do is install `fuse-box` from npm.

```bash
npm install fuse-box --save-dev
```

Or install using Yarn:

```bash
yarn add fuse-box --dev
```

## Try it out!

### [Angular2 Example](https://github.com/fuse-box/angular2-example)

Todo App built on the latest Angular2 (compiles in 50-80ms!)

### [React Example](https://github.com/fuse-box/react-example)

Simple example using React with babel (compiles in 50ms!)

### [Benchmark](https://github.com/fuse-box/benchmark)

Speed matters. Check out our benchmark example for a real world demo! 
__1200 files to bundle__:

* FuseBox __0.234s__
* Webpack 1.376s


## Highlights

* No headache, minimal configuration
* First class [typescript](http://fuse-box.org/#typescript) support
* Arithmetic [instructions](http://fuse-box.org/#arithmetic-instructions)
* Blazing fast bundle time
* [Wildcard imports](http://fuse-box.org/#wildcard-import)
* [Dynamic modules](http://fuse-box.org/#dynamic-modules) at runtime
* [Tilde support](http://fuse-box.org/#point-to-the-root)
* [DevServer and HMR](http://fuse-box.org/#dev-server-and-hmr) integrate with existing HTTP apps in 1 second!
* Metadata e.g `__filename` for decorators.
* Works everywhere for easy universal applications!

There is so much more. FuseBox pushing it to a whole new level!

## Start Now

```bash
npm install typescript fuse-box --save-dev
```

```ts
FuseBox.init({
    homeDir: "src/",
    sourceMap: {
         bundleReference: "./sourcemaps.js.map",
         outFile: "sourcemaps.js.map",
    },
    outFile: "./out.js"
}).bundle(">index.ts");
```

## Seeds

* [Typescript + React + Reflux + Sass + Code Splitting](https://github.com/fuse-box/fuse-box-ts-react-reflux-seed)
* [Vue.js Seed](https://github.com/fuse-box/fuse-box-vue-seed) 
* [Express seed](https://github.com/fuse-box/fuse-box-express-seed)
* [Electron + babel + live-reload seed](https://github.com/fuse-box/electron-fuse-box-babel-live-reload-boilerplate)

---
Join our [gitter channel](https://gitter.im/fusebox-bundler/Lobby) we are very active and friendly!

Special thanks to [devmondo](https://github.com/devmondo) for incredible ideas, giving inspiration and relentless testing/contributing to the project.  

If you like the project, don't forget to star it!

