---
id: version-4.0.0-cache
title: Cache
original_id: cache
---

The main goal of caching is to reduce time spent on compiling of modules. It's enabled by default.

Your cache is located by default in `${APP_ROOT}/.cache`

When running production mode - `runProd()` cache will be ALWAYS disabled and all of its settings will be ignored.

### Setting custom cache folder

Sometimes it's required to set different cache folders in order to avoid cache collision. FuseBox makes a unique
combination of the target folder for caching (based on your entries). However, if you have 2 instances of FuseBox
pointed to the same entry point it's always a good idea to set different folders

```ts
fusebox({
  cache: { root: path.join(__dirname, '.cache/server') },
});
```

### Setting cache strategy

FuseBox will write cache to the file system by default and restore next time your launch `fuse.ts`. It's extremeley
useful if you're working with large code base application which require some time to get bundled.

You can set the `strategy` to `memory` to avoid writing to the file system

```ts
fusebox({
  cache: { enabled: true, strategy: 'memory' /* or 'fs' */ },
});
```
