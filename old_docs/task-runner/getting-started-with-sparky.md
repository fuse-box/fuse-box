---
id: getting-started-with-sparky
title: Getting started with sparky
---

## Tasks

Let's start off by creating `fuse.js` in your repository. We will put all
configuration here.

To make your life easier in the future, let's use
[sparky](../task-runner/sparky). Sparky is a very smart task runner, you will be
able to copy files, share configurations and much more!

Let's require essential modules from FuseBox:

```js
const { src, task, exec, context } = require("fuse-box/sparky");
const { FuseBox, WebIndexPlugin } = require("fuse-box");
```

## Task context

You should always start with a context. A context is a shared object between
tasks. It will help to keep your configuration clean and readable.

```js
context(
  class {
    getConfig() {
      return FuseBox.init({
        homeDir: "src",
        output: "dist/$name.js",
        plugins: [
          !this.isProduction && WebIndexPlugin(),
          this.isProduction &&
            QuantumPlugin({
              uglify: true,
              treeshake: true,
              bakeApiIntoBundle: "app",
            }),
        ],
      });
    }
  },
);
```

It doesn't need to a class, it can be a function or a plain object.

`WebIndexPlugin` will automatically create `index.html` in the dist folder.
QuantumPlugin we will use for making production builds

## Default task

Create `default` task (the one that will be executed once `node fuse.js` is
called)

```js
task("default", async context => {
  const fuse = context.getConfig();
  fuse
    .bundle("app")
    .hmr()
    .watch()
    .instructions(">index.ts");

  await fuse.run();
});
```

In the example above, we will create a bundle named `app` with HMR features,
watched (re-triggered on each file change) `.instructions(">index.ts")` - sets
up an entry point. In our case it's `index.js`.

`>` means that we want to execute the entry point once loaded.

Now run `node fuse` and enjoy!

## Production build

For production builds, we use [Quantum](../production-builds/quantum). It's
super plugin that makes a highly optimised API

```js
task("dist", async context => {
  context.isProduction = true;
  const fuse = context.getConfig();
  fuse.bundle("app").instructions(">index.ts");

  await fuse.run();
});
```

Now run `node fuse dist` and get your production bundle ready!
