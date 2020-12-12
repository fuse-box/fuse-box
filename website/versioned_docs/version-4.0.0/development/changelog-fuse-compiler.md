---
id: version-4.0.0-changelog-fuse-compiler
title: Changelog fuse 3 to 4
original_id: changelog-fuse-compiler
---

First things to do:

- Get rid of `homeDir` (and forget about it forever)
- Remove the `output` paramater (and forget about it forever). Read below on the new configuration
- Remove `useSingleBundle` and forget about it forever
- Rename `watch` to `watcher` (read watcher docs [here](./watcher)))
- If you had `modules` field set with `node_modules` in it remove it. We have fixed the module resolution.
- If you're targeting IE11 set buildTarget in `runProd`. Ignore this line if you're targeting modern browsers

### compilerOptions

```ts
fusebox({
  compilerOptions: {},
});
```

This is a custom option that partially resembles tsconfig

```ts
interface ICompilerOptions {
  baseUrl?: string;
  buildEnv?: Record<string, any>; // cool thing to inject objects in the code
  buildTarget?: ITarget;
  emitDecoratorMetadata?: boolean;
  esModuleInterop?: boolean;
  esModuleStatement?: boolean;
  experimentalDecorators?: boolean;
  jsxFactory?: string;
  paths?: ITypeScriptPaths;
  processEnv?: Record<string, string>; // don't touch that
  tsConfig?: string; // a path to a custom tsConfig (will merge properties)
  jsParser?: { nodeModules?: ICompilerParserType; project?: ICompilerParserType };
}
type ICompilerParserType = 'meriyah' | 'ts';
```

### New output

```ts
await rendererConfig.runDev({
  bundles: {
    distRoot: 'dist/renderer',
    app: 'app.js',
  },
});
```

If `distRoot` isn't set we will set `{FUSE_FILE_FOLDER}/dist`

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

### Launching process

That has been simplified dramatically

```ts
const { onComplete } = await fuse.runDev();
onComplete(({ server }) => server.start());
```

### Dependency field

```ts
interface IDependencies {
  ignore?: Array<string | RegExp>;
  importRefs?: Array<IImportRef>; // coming soon
  include?: Array<string>;
  serverIgnoreExternals?: boolean;
}
```

### HMR

Docs are coming later. Demo is [here](https://github.com/fuse-box/sandbox/tree/master/hmr-plugin-example)

### Webworker support

Coming soon

### Electron

target "electron" is very similar to "browser". Node.js built-ins are no longer considered to be a part of the scope and
polyfills are bundled. Electron recommends setting `nodeIntegration` to false. You can changed that

```ts
fusebox({
  electron : {
    nodeIntegration : true
  }
}
```

Main process should always have the `server` target

Main config:

```ts
const fuse = fusebox({
  dependencies: { serverIgnoreExternals: true },
  entry: 'src/main/main.ts',
  logging: { level: 'succinct' },
  target: 'server',
});
fuse.runDev({ bundles: { distRoot: 'dist/main', app: 'app.js' } });
onComplete(({ electron }) => electron.start());
```

For the renderer:

```ts
const fuse = fusebox({
  devServer: {
    hmrServer: { port: 7878 },
    httpServer: false,
  },
  entry: 'src/renderer/index.ts',
  target: 'electron',
  webIndex: {
    publicPath: './',
    template: 'src/renderer/index.html',
  },
});
fuse.runDev({ bundles: { distRoot: 'dist/renderer', app: 'app.js' } });
```
