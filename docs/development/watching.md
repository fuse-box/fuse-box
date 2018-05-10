# Watching


FuseBox can automatically re-bundle your bundles on file change. FuseBox Producer makes sure that only 1 watcher is bound (chokidar).

```js
const app = fuse.bundle("app")
    .instructions(`> app.tsx`)
    .watch()
```

`watch()` accepts a simplified regex (if you want to customise watched folder). Let's watch server and client bundle at the same time.

```js
fuse.bundle("client/app")
    .instructions(`> app.tsx`)
    .watch("client/**")

fuse.bundle("server/app")
    .instructions(`> index.ts`)
    .watch("server/**")
```

In this example whenever a change happen in `homeDir` FuseBox will figure out which bundle requires re-triggering. It's implemented in order to save up your resources as physically only 1 watcher is defined.

A typical configuration for production builds would look like:

```js
if (!production) { app.hmr().watch() }
```

### Chokidar options

Additionally, you can provide [chokidar](https://github.com/paulmillr/chokidar) options to `run()` 

```js
fuse.run({chokidar : {ignored: /(^|[\/\\])\../} })
```
