---
id: version-4.0.0-electron
title: Electron
original_id: electron
---

[Electron](https://electronjs.org/) is a tool for making web apps act like native applications. Electron applications
are split into 2 separate bundles:

1. `launcher` - the launcher process which starts the application and tweaks its settings (e.g. window size, file menu)

2. `renderer` - a mostly typical web app bundle.

---

## Goal

The following instructions will create a project which loosely resembles this file structure.

```
fuse.ts
- src
  - launcher
    - launcher.ts
  - renderer
    - renderer.ts
- dist
  - launcher
  - renderer
```

A working example project can be found [here](https://github.com/fuse-box/fuse-box-electron-seed).

It is highly recommended you
[view the example fuse.ts file](https://github.com/fuse-box/fuse-box-electron-seed/blob/master/fuse.ts) for this
project.

---

## Configuration for the Main process

Always use `server` target for the main process

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

Make sure to set a different `distRoot` to avoid a collision with your renderer or other processes

---

## Configuration for the Renderer Bundle

The target doesn't need to be set to `electron`. It can be `browser` too.

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

Use `electron` target if you want to enable `nodeIntegration`

```ts
fusebox({
  target : "electron",
  electron : {
    nodeIntegration : true
  }
}
```

---

## Launcher Code

`mainWindow` to load up the renderer bundle:

```ts
mainWindow.loadURL(
  url.format({
    pathname: path.join(app.getAppPath(), '../', 'renderer', `index.html`),
    protocol: 'file:',
    slashes: true,
  }),
);
```
