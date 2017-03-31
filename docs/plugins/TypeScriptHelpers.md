# TypeScript Helpers Plugin

## Description
Adds required typescript functions to the bundle. Please note that it adds only the ones that are actually used, helping to avoid unnecessary code.

This [list](https://github.com/fuse-box/fuse-box/blob/master/src/plugins/TypeScriptHelpers.ts) shows the possible helpers.

Available helpers:

Name | Description
------------ | -------------
__assign | Generic typescript helper
__awaiter | Generic typescript helper
__decorator | Generic typescript helper + additional fusebox meta data patched
__extends | Generic typescript helper
__generator | Generic typescript helper
__param | Generic typescript helper

If you spot an error or a missing helper, please submit an issue or a pull request. If needed, you can always create your own plugin, based on this class [code](https://github.com/fuse-box/fuse-box/blob/master/src/plugins/TypeScriptHelpers.ts)

## Usage
Simply add TypeScriptHelpers to your plugin list. No further configuration required. FuseBox will take care of everything else. To avoid unnecessary AST (which is heavy) this plugin does a simple RegExp, and tests for declarations. It is absolutely safe, and your code is not modified in any way.

### Setup
Import from FuseBox

```js
const {TypeScriptHelpers} = require("fuse-box");
```

Inject into a chain

```js
fuse.plugin(
     TypeScriptHelpers()
)
```

Or add it to the main config plugins list to make it available across bundles

```js
FuseBox.init({
    plugins : [
         TypeScriptHelpers()
    ]
});
```

### Require file in your code

## Options
None.

## Extended metadata properties

You can have access to the entire environment of a file, using reflect-metadata. Make sure you have it installed first

```bash
yarn add reflect-metadata --dev
npm install reflect-metadata --save-dev
```

Then, include it in your entry point

```js
import "reflect-metadata";
```

Now, you can access "commonjs" variables via fusebox metadata property

```js
export function testDecorator() {
    return function (target, key: string, descriptor: PropertyDescriptor) {
        Reflect.getMetadata("fusebox:__filename", target, key);
        Reflect.getMetadata("fusebox:__dirname", target, key);
        Reflect.getMetadata("fusebox:require", target, key); // Local "require" function
        Reflect.getMetadata("fusebox:module", target, key);
        Reflect.getMetadata("fusebox:exports", target, key);
    }
}
```

## Test
To run tests
```
node test --file=TypeScriptHelpers.test.ts
```
