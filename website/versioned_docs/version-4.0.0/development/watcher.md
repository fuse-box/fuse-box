---
id: version-4.0.0-watcher
title: Watcher
original_id: watcher
---

Watcher watches for project file changes, and will run updates when they occur. It is based on
[the chokidar project](https://github.com/paulmillr/chokidar).

```ts
fusebox({ watcher: true });
```

---

### Default behevior

By default the watcher watches the entire application root, but reacts only to the path relative to the first entry
point.

You can change what the watcher reacts to by passing an `include` property.

```ts
fusebox({
  watcher: {
    include: { "src/" },
  },
});
```

### Overriding the root path

You can override the root that the watcher will watch by setting the `root` property, which can be a path, or an array
of paths.

```ts
const workspace = path.dirname(__dirname);
fusebox({
  watcher: {
    root: workspace, // watch parent folder
  },
});
```

### Adding and ignoring paths

```ts
fusebox({
  watcher: {
    include: { "src/" },
    ignore: { "configs" }
  }
});
```

### Chokidar options

You can pass chokidar options by using `chokidar` field:

```ts
fusebox({
  watcher: {
    chokidar: { chokidarOptions: true },
  },
});
```

_(note: The `ignored` field given to `chokidar` is declared by the `watcher` field in FuseBox's configuration. Do not
define the `ignored` field here.)_

Here is a default configuration for the chokidar configured by FuseBox.

```js
config = {
  awaitWriteFinish: {
    pollInterval: 100,
    stabilityThreshold: 100,
  },
  ignoreInitial: true,
  ignored: ignorePaths,
  interval: 100,
  persistent: true,
};
```

Note that overriding this configuration will affect the overall peformance which might yield unpredicted behavior. Use
it wisely
