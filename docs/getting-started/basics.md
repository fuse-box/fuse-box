# Basics

## Target

Possible values are: `browser`, `server`, `electron`, `universal`, `web-worker`;

```ts
fusebox({
  target: 'browser',
});
```

## Defining your entry point

You can specify your entry point like this:

```ts
fusebox({
  target: 'server',
  entry: 'yourEntryPoint'
});
```

## Dependencies

It's possible to ignore/include/ignore all dependencies in your bundle.

When target is set to `server` FuseBox toggle `ignoreAllExternal` mode automatically, since that's a recommended way of
bundling server (at least for development). You can tweak it like so:

```ts
fusebox({
  target: 'server',
  dependencies: {
    ignoreAllExternal: isProduction,
  },
});
```

In most cases that should be fine. However, FuseBox won't be able to bundle native modules, you can ignore them by using
`ignorePackages` field

```ts
fusebox({
  target: 'server',
  dependencies: {
    ignoreAllExternal: true,
    ignorePackages: ['some-package'],
  },
});
```

You can also include packages or modules by using `include` field:

```ts
fusebox({
  target: 'server',
  dependencies: {
    include: ['tslib', './someModuleRelativeToTheEntry'],
  },
});
```

`include` works relatively to the entry point, In fact all the strings are being resolved as a dependency of your entry
point. You can add modules there too.