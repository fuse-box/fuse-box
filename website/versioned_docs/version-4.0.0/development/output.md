---
id: version-4.0.0-output
title: Output
original_id: output
---

Your project output is configuring in `runProd` or `runDev` respectively.

## Default configuration

If no configuration is specified FuseBox will preconfigure the output as follows

```ts
fuse.runDev({
  bundles: {
    rootDir: 'dist',
    app: 'app.$hash.js',
    vendor: 'vendor.$hash.js',
    styles: 'styles/styles.$hash.css',
  },
});
```

`styles` output is taking its effect only during `runProd`. Read [below](#configuring-the-styles-output)

## One file output

```ts
fuse.runDev({
  bundles: {
    rootDir: 'dist',
    app: 'app.js',
  },
});
```

`rootDir` is defaulted to to your `fuse.ts` file directory + "dist". It's important to specify and set relative paths to
your bundles

Additionally you can add `vendor` to the output.

## App + Vendor output

```ts
fuse.runDev({
  bundles: {
    rootDir: 'dist',
    app: 'app.js',
    vendor: 'vendor.js',
  },
});
```

Note that `vendor` cannot be set without `app`, however having only one `app` field will generate only one bundle in
your output folder.

## Bundle exports

In case if exports is needed:

```ts
fuse.runDev({
  bundles: {
    exported: true,
    app: 'app.js',
  },
});
```

This will use either `exports` or `window` (depending on your target) and expose all exported variables in all specified
entries of your application

## Configuring the styles output

Styles are written to the filesystem only during `runProd` and it is intentional

FuseBox takes care of your css files imported directly in the code. For example:

```ts
import './main.css';
```

Will result is `styles.css` in your dist root. All the import/require statements are removed from the code in favour of
loading them via `webIndex`

Make sure your have `$css` macro set in your index.html
