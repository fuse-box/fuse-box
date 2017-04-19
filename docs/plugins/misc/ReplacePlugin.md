# Replace Plugin

## Description
Allows replacing strings in files with new values.

## Usage

### Setup
Import from FuseBox

```js
const {ReplacePlugin} = require("fuse-box");
```

Inject into a chain

```js
fuse.plugin(
     ReplacePlugin()
)
```

Or add it to the main config plugins list to make it available across bundles

```js
FuseBox.init({
    plugins : [
         ReplacePlugin()
    ]
});
```

### Require file in your code

## Options
The plugin accepts a `key/value` object as a parameter. where a `key` is the string you want to replace and the `value` is new content. For example:

```js
plugins: [
  ReplacePlugin({"$versionPlaceHolder": "1.4.1"})
],
```

## Notes
The [EnvPlugin](#EnvPlugin) will define a value for you, but if somewhere along the line that value changes (for example, something setting process.env.NODE_ENV = 'magic';), the value will change. In contrast, the ReplacePlugin will replace that key, with the value you provide, for example, instead of process.env.NODE_ENV, the value is replaced with a string. This allows [UglifyJSPlugin](#UglifyJSPlugin) to remove "dead code" and enables you to use production mode with modules that rely on this behaviour.

Example

#### your config
```js
plugins: [
  ReplacePlugin({ "process.env.NODE_ENV": JSON.stringify("production") }),
],
```

#### your code
```js
if (process.env.NODE_ENV === 'production') console.log('production!')
```

#### result
```js
if ('production' === 'production') console.log('production!')
```

#### after uglifying
```js
console.log('production!')
```

## Test
To run tests
```
node test --file=ReplacePlugin.test.ts
```
