# NGTemplatePlugin

(https://www.npmjs.org/package/fuse-box-ng-template-plugin) [![npm version](https://badge.fury.io/js/fuse-box-ng-template-plugin.svg)](https://www.npmjs.com/package/fuse-box-ng-template-plugin) [![Build Status](https://img.shields.io/travis/TobiasTimm/fuse-box-ng-template-plugin/master.svg)](https://travis-ci.org/TobiasTimm/fuse-box-ng-template-plugin)


https://github.com/TobiasTimm/fuse-box-ng-template-plugin

Includes your AngularJS templates into your fuse-box bundle. Pre-loads the AngularJS template cache to remove initial load times of templates.

Inspired by [ngtemplate-loader](https://github.com/WearyMonkey/ngtemplate-loader)

## Install

With `npm`

```shell
npm install --save-dev fuse-box-ng-template-plugin
```

With `yarn`

```shell
yarn add --dev fuse-box-ng-template-plugin
```

## Usage

Just call `NgTemplatePlugin` within the FuseBox plugins array.

```js
const { FuseBox } = require("fuse-box");
const NgTemplatePlugin = require("fuse-box-ng-template-plugin");

const fuse = FuseBox.init({
  homeDir: "./src",
  plugins: [NgTemplatePlugin()]
});
```

## Example

https://github.com/TobiasTimm/fuse-box-angularjs-example