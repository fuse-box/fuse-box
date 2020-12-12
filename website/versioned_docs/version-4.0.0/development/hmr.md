---
id: version-4.0.0-hmr
title: HMR
original_id: hmr
---

### Reload an entry point when a css file changes

Change the `reloadEntryOnStylesheet` option to reload an entry point when a css file is changed.

```ts
fusebox({
  watch: {
    reloadEntryOnStylesheet: true,
  },
});
```

### Hard reload scripts (js/ts files)

By default scripts are hot reloaded. Change the `hardReloadScripts` option to hard reload when changes are detected to
script source files.

```ts
fusebox({
  watch: {
    hardReloadScripts: true,
  },
});
```
