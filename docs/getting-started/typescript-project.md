---
id: typescript-project
title: TypeScript project
---

In order to start with TypeScript you won't be required to setup anything
special.

## Getting started with TypeScript

Create `fuse.js` with the following javascript code.

```js
const { FuseBox, WebIndexPlugin } = require("fuse-box");
const fuse = FuseBox.init({
  homeDir: "src",
  target: "browser@es6",
  output: "dist/$name.js",
  plugins: [WebIndexPlugin()],
});
fuse.dev(); // launch http server
fuse
  .bundle("app")
  .instructions(" > index.ts")
  .hmr()
  .watch();
fuse.run();
```

## Typescript Configuration

If you have a project without `tsconfig`, FuseBox will automatically generate
one for you. Here is how it looks like by default:

```ts
{
    "compilerOptions": {
        "module": "commonjs",
        "target": "esnext",
        "sourceMap": true,
        "inlineSources": true,
        "jsx": "react",
        "importHelpers": true,
        "emitDecoratorMetadata": true,
        "experimentalDecorators": true
    }
}
```

It will be placed in your
[home directory](/docs/development/configuration#home-directory) and can be
moved higher in the hirarchy (for example in your application root)

## Module requirement

Changing `module` in `tsconfig` option will not affect the build, since FuseBox
requires commonjs module resolution (`require` function) in order to resolve
files at runtime. That's why it's so fast!

Fear not, FuseBox takes the full advantage of ES6 import statements.

## Changing TypeScript target

Pay attention to `target: "browser"` if no target is set, FuseBox will take the
one from `tsconfig.json`, However, you can override the target by changing the
`FuseBox.init` configuration

```ts
const fuse = FuseBox.init({
  homeDir: "src",
  target: "browser@es6",
  output: "dist/$name.js",
});
```

Read more about target in [this section](/docs/guides/working-with-targets)
