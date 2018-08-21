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
[home directory](/docs/development/configuration#home-directory)
