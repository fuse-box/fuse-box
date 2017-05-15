# Fusebox

[![Build Status](https://travis-ci.org/fuse-box/fuse-box.svg?branch=master)](https://travis-ci.org/fuse-box/fuse-box)
[![Fusebox-bundler](https://img.shields.io/badge/gitter-join%20chat%20%E2%86%92-brightgreen.svg)](https://gitter.im/fusebox-bundler/Lobby)

[![NPM](https://nodei.co/npm/fuse-box.png?downloads=true)](https://nodei.co/npm/fuse-box/)

FuseBox is a bundler/module loader with super powers - Blazing speed, simplicity and ultimate flexibility.

It is blazing fast (it takes 50-100ms to re-bundle) which makes it extremely convenient for developers. It requires zero configuration to bundle such monsters like `babel-core`.

FuseBox loves __typescript__, and does not require any additional configuration. It will compile and bundle your code within a fraction of a second, yet offering a comprehensive loader API.

It is packed with features, and unfolds limitless possibilities of extending the API.

Join [gitter channel](https://gitter.im/fusebox-bundler/Lobby), we are active! / View on [github](https://github.com/fuse-box/fuse-box) / Submit an [issue](https://github.com/fuse-box/fuse-box/issues/new) / Contribute to this [documentation](https://github.com/fuse-box/fuse-box/tree/master/docs)

## Features

FuseBox is a next generation bundler and module loader, it is the result of our years of experience dealing with complex projects requirements and many of the development tools out there.

steps:
    * Speed
    It takes 50ms for a regular project, 100ms for a big project to re-bundle. It applies aggressive but responsible module caching, which makes it fly.
    * Effortless bundling
    You have an npm library in mind? You can bundle it without any extra configuration. babel-core with all plugins? No problem, fusebox will take care of everything you need.
    * First class TypeScript support
    Just point it to a typescript file, and FuseBox will do the rest - no additional steps required
    * Simplicity
    FuseBox will take care of all nodejs dependencies. We offer a comprehensive list of nodejs modules for browser out of the box. No worries, no matter what are you trying to bundle. It will work.
    * API first
    Whatever your usage scenario, FuseBox provides you the flexibility to get it done. Apply hacks, intercept require statements, use an amazing dynamic module loading, and many many other neat features!

## Minimum requirement

You need NodeJs 6+. FuseBox will not run on an earlier version of node. If you have an SSD that will help you a lot as FuseBox uses filesystem cache extensively 

## Installation

```bash
yarn add fuse-box --dev
npm install fuse-box --save-dev
```
