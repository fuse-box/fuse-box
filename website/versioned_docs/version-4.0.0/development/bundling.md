---
id: version-4.0.0-bundling
title: Bundling
original_id: bundling
---

Bundles are a compiled outputs of many project files grouped together.

```ts
await rendererConfig.runDev({
  bundles: {
    distRoot: 'dist/renderer',
    app: 'app.js',
  },
});
```

By default `distRoot` will be `{FUSE_FILE_FOLDER}/dist`

### Deep paths

```ts
await rendererConfig.runDev({
  bundles: {
    distRoot: 'dist/renderer',
    app: { path: 'app.js', publicPath: '/static' },
  },
});
```

Will result in:

```html
<script type="text/javascript" src="/static/app.js"></script>
```

### Hashes

Use \$hash to enable hash for production (Or don't)

```ts
app: { path: 'app.$hash.js', publicPath: '/static' },
```

or like this:

```ts
app: 'app.$hash.js';
```

The same config can be applied to `vendor` and `css`

More options are coming (like `maxBundleSize`)
