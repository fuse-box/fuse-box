# Get started

To begin with, let's install required dependencies.

```bash
npm install typescript fuse-box tslib --save-dev
```

FuseBox requires typescript at the core level, since many of the operations rely on it. `tslib` is being used by
production - all the modules are compiled using typescript. Please note, that it doesn't mean that FuseBox works only
with typescript. You can transpile javascript code too.

Once you are done installing, let's go throught the main concepts

## Concepts

FuseBox is packed with features and takes a lot of assumptions when bundling your code. Here are the highlights:

- FuseBox has a concept of `homeDir` which defaults to the location of your `fuse.ts` file launcher. All bundles rely on
  this value to calculate a special path which is being used when resolving paths during development
- Home directory `homeDir` is the key for being so fast. FuseBox tries to avoid unnecessary transformations, by leaving
  the transpiled output untouched.
- Many things are taken on the assumption basis. For example, you can import any `CSS` style CSS preprocessor and
  FuseBox will handle it accordingly. You can import `svg` (or many others) files and those will be copied over to the
  dist folder with a link as a result of import
- FuseBox uses an alternative process for transformations during the production build. It's much slower and requires a
  lot of RAM. All modules during development use `EsNext` target to include most of the features without transforming
  them
- FuseBox is radically different compared to WebPack or any other bundlers, and requires a much less learning curve to
  grasp the concepts.

## Making your first bundle

First off, we should create a `fuse.ts` or `fuse.js` files (whichever makes you comfortable) with the following contents

```ts
import { fusebox } from 'fuse-box';
const fuse = fusebox({
  target: 'browser',
  entry: 'src/index.ts',
  devServer: true,
  webIndex: {
    template: 'src/index.html',
  },
});

fuse.runDev();
```

Entry is the entry point of your application. We would like to open a development server too and use some `index.html`
as our index.

Let's create `src/index.html` with the following contents:

```html
<!DOCTYPE html>
<html>
  <head>
    <title></title>
    $css
  </head>

  <body>
    <div id="root"></div>
    $bundles
  </body>
</html>
```

Once your application has been bundled, FuseBox will copy this template and replace `$bundles` and `$css` with the
following scripts. To read more about how webIndex propery works, read [here](../webIndex.md)

And finally we launch the process by calling `fuse.runDev()`

## Targets

Possible values are: `browser`, `server`, `electron`;

FuseBox behaves differenly when processing modules using those targets. For `example` a `server` target won't touch
`process` variables, as opposed to `browser` target, where it's being polyfilled.

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
  entry: 'index.ts',
});
```

FuseBox has only one entry point. If you wish to load more files, split your entry point better or use
(dependencies)[#dependencies] field to include additional modules to the bundle

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

## Caching

Caching in FuseBox is enabled automatically.

Default cache folder is located under `node_modules/.fusebox`.

```ts
fusebox({
  // ... basic config
  cache: false,
});
```

`runProd()` disable caching automatically since we shouldn't use caching for production builds. More information about
caching is [here](cache.md)
