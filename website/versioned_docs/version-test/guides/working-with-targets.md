---
id: version-test-working-with-targets
title: Working with targets
original_id: working-with-targets
---

Regardless of the output (esnext or es5) module resolution must be set to
commonjs. It's not because FuseBox cannot handle `imports` it's because FuseBox
mimics `require` statements in development (that's why FuseBox is so fast - it's
not altering the code).

As FuseBox is tightly coupled with TypeScript, there are a few tricks you can
apply to make your life easier. If you are using Babel - you shoulds still
install TypeScript as it will be used to transpile npm modules. More about it
[here](#working-with-babel)

`tsconfig.json` is being scanned from the current `homeDir` and higher up, if
it's not found, FuseBox generates in-memory configuration, which looks like
this:

```json
{
  "compilerOptions": {
    "module": "commonjs",
    "target": "es6"
  }
}
```

Once the config is created, you cannot override `"module": "commonjs"` it will
always be set to use `commonjs`.

Take a look a [target](../development/configuration#target) option.

```js
FuseBox.init({
  target: "browser@es5",
});
```

If the above configuration is set, FuseBox will override
`compilerOptions.target` in your `tsconfig.json` making it easier to control the
output. It will also take care of all npm modules. For example if you are
importing a library and the script target is not `es5` FuseBox will transpile it
down.

An alternative way of overriding `tsconfig.json` is using
[tsConfig](../development/configuration#tsconfig) option

```js
FuseBox.init({
  tsConfig: [{ target: `es5` }],
});
```

## Uglifying

Make sure you have `uglify-js` and/or `uglify-es` installed. If your target is
higher than `es5`, Quantum will use `uglify-es`. More about it
[here](../production-builds/quantum#uglify) You can control that manually too.

## Working with Babel

So you use `Babel` instead of `TypeScript` but you still should install it.
Don't worry you don't need to do anything, FuseBox will use TypeScript under the
hood to help matching your script target.

For example if you are importing a library and the script target is not `es5`
FuseBox will transpile it down. If you target is `es6`, FuseBox won't touch it
(unless `import` statements are used - it will transpile it using `es6` target -
respecting your script level choice)

## Server bundles

When working with server bundle, it's highly recommended to use the latest
NodeJS and `server@esnext` option. If you want to take advantage of the new
syntax, and it make it blazing fast it's imperative to use the latest tech.

```js
FuseBox.init({
  target: `server@esnext`,
});
```

### Why can't we use Babel to transpile npm modules?

Because `TypeScript` is much much faster and it's easy to change the script
target. By the way, if you are interested, FuseBox can transpile javascript
using TypeScript. Read up on
[useTypescriptCompiler](../development/configuration#usetypescriptcompiler)
option
