# NGTemplatePlugin

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