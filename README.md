# FuseBox

[![Build Status](https://travis-ci.org/fuse-box/fuse-box.svg?branch=master)](https://travis-ci.org/fuse-box/fuse-box)
[![Fusebox-bundler](https://img.shields.io/badge/gitter-join%20chat%20%E2%86%92-brightgreen.svg)](https://gitter.im/fusebox-bundler/Lobby)

[![NPM](https://nodei.co/npm/fuse-box.png?downloads=true)](https://nodei.co/npm/fuse-box/)

http://fuse-box.org/

FuseBox is a bundler/module loader that combines the power of webpack, JSPM and SystemJS. 

It is blazing fast (it takes 50-100ms to re-bundle) which makes it extremely convenient for developers. It requires zero configuration to bundle such monsters like `babel-core`.

FuseBox loves __typescript__, and does not require any additional configuration. It will compile and bundle your code within a fraction of a second, yet offering a comprehensive loader API. 

It is packed with features, and unfolds limitless possibilities of extending the API.

[Offical documentation](http://fuse-box.org/) / Submit an [issue](https://github.com/fuse-box/fuse-box/issues/new) / Make [documentation](https://github.com/fuse-box/fuse-box/tree/master/docs) better / Join [gitter channel](https://gitter.im/fusebox-bundler/Lobby) we are active!


## Installation

```bash
npm install fuse-box --save-dev
```

FuseBox has many plugins in place to help you get started. All you need to do is install `fuse-box` from npm.

## Try it now!
### Angular
Check a [marvellous TODO app](https://github.com/fuse-box/angular2-example) built on the latest angular2. Demo [here](https://fuse-box.github.io/angular2-example/).
Fuse it in a fraction of second! (50-80ms)

### React
Fuse [react](https://github.com/fuse-box/react-example) with babel in 50ms
---
This [benchmark](https://github.com/fuse-box/benchmark) will tell you, that speed matters.
__1200 files to bundle__:

* FuseBox __0.234s__
* Webpack 1.376s


## Highlights

* No headache, minimalist configs
* First class [typescript](http://fuse-box.org/#typescript) support
* Arithmetic [instructions](http://fuse-box.org/#arithmetic-instructions)
* Blazing fast bundle time
* [Wildcard imports](http://fuse-box.org/#wildcard-import)
* [Dynamic modules](http://fuse-box.org/#dynamic-modules) at runtime
* [Tilde support](http://fuse-box.org/#point-to-the-root)
* Works everywhere

There is so much more. FuseBox pushing it to a whole new level. 

## Start now

```
npm install typescript fuse-box --save-dev
```

```
FuseBox.init({
    homeDir: "src/",
    sourceMap: {
         bundleReference: "./sourcemaps.js.map",
         outFile: "sourcemaps.js.map",
    },
    outFile: "./out.js"
}).bundle(">index.ts");
```

---
Don't hesitate to concat me personally or join our [gitter channel](https://gitter.im/fusebox-bundler/Lobby) we are very active and friendly!

If you like the project, don't forget to star it!
