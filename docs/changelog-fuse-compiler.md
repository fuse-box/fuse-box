## Changes

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
  modules: ['node_modules'],
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
