# Env Plugin

## Description
Creates environment variables that can be accessed  at build or run time. it works both on server and in browser, You can even access in other `FuseBox` plugins.

## Usage

### Setup
Import from FuseBox

```js
const {EnvPlugin} = require("fuse-box");
```

Inject into a chain

```js
fuse.plugin(
     EnvPlugin()
)
```

Or add it to the main config plugins list to make it available across bundles

```js
FuseBox.init({
    plugins : [
         EnvPlugin()
    ]
});
```

### Require file in your code
Say you want to pass  `Node_env`  as global variable to your application, you can do :
```js
plugins: [
   fsbx.EnvPlugin({ NODE_ENV: "production" }),
]
```

Then in your code you can access it in your code like `process.env.${process.env.NODE_ENV}` which translates to the same as `console.log(process.env.NODE_ENV)`.
 
## Options
`EnvPlugin` accepts a `key/value` object as a parameter. For example `{myVarName: "production"}`

## Notes
The order of plugins is important: environment variables created with this plugin will only be available to plugins further down the chain, so EnvPlugin should be early in the list of plugins.

```js
plugins: [
   fsbx.BabelPlugin({ /* settings */ }), // <-- won't have NODE_ENV set
   fsbx.EnvPlugin({ NODE_ENV: "production" }),
   fsbx.BabelPlugin({ /* settings */ }), // <-- will have NODE_ENV set
]
```

## Test
To run tests
```
node test --file=EnvPlugin.test.ts
```
