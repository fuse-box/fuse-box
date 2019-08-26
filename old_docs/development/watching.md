---
id: watching
title: Watching
---

FuseBox can automatically re-bundle your bundles on file change. To conserve
resources, FuseBox Producer ensures that only 1 watcher is bound (via chokidar).

```js
const app = fuse
  .bundle("app")
  .instructions(`> app.tsx`)
  .watch();
```

`watch()` accepts two optional arguments; 1) a simplified regex (if you want to
customize the watched folder), and 2) a filter function that includes any files
that return a truthy value.

Let's watch server and client bundle at the same time.

```js
fuse
  .bundle("client/app")
  .instructions(`> app.tsx`)
  .watch("client/**");

fuse
  .bundle("server/app")
  .instructions(`> index.ts`)
  .watch("server/**", path => !path.match(".*.temp"));
```

In this example whenever a change happen in `homeDir` FuseBox will figure out
which bundle requires re-triggering. Additionally, the server bundle will ignore
any file that ends in `.temp`.

A typical configuration for production builds would look like:

```js
if (!production) {
  app.hmr().watch();
}
```

### Chokidar options

Additionally, you can provide [chokidar](https://github.com/paulmillr/chokidar)
options to `run()`

```js
fuse.run({ chokidar: { ignored: /(^|[\/\\])\../ } });
```

### Problems with some cloud providers

To solve some issues with running on docker container providers set this:

```ts
fuse.run({ chokidar: { awaitWriteFinish: true } });
```

This will allow you to stop the watcher from looking in folders like
node_modules:

```ts
fuse.run({ chokidarPaths: ["path"] });
```
