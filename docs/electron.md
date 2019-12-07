# Electron

[Electron](https://electronjs.org/) is a tool for making web apps act like
native applications.  Electron applications are split into 2 separate bundles:

1. `launcher` - the launcher process which starts the application and tweaks its settings (e.g. window size, file menu)

2. `renderer` - a mostly typical web app bundle.

-----
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

It is highly recommended you [view the example fuse.ts file](https://github.com/fuse-box/fuse-box-electron-seed/blob/master/fuse.ts) for this project.

------

## Configuration for the Launcher Bundle
*Items 2-4 will be checked automatically at run time, but can not be set automatically.  You must set them.*

1. The `target` field must be `'electron'`.

2. To avoid collision between the `launcher` and `render` bundles, **their `output` and `homeDir` fields must be custom and different.**

3. The Electron launcher must be a single bundle. To specify this use the `useSingleBundle` field.

    *(By default, FuseBox manages bundles automatically and the amount of them may vary.)*

4. Because Electron dependencies are all native, trying to bundle them will cause errors.  To specify they should not be bundled set the `dependencies` field to `{ ignoreAllExternal: true }`.

5. (Optional) Though most collisions are unlikely, you will likely also want to set a custom cache location.


```ts
// fuse.ts

fusebox({
  entry: 'launcher.ts',

  target: 'electron',                         // #1
  output: 'dist/launcher/$name-$hash',        // #2
  homeDir: 'src/launcher',                    // #2
  useSingleBundle: true,                      // #3
  dependencies: { ignoreAllExternal: true },  // #4
  cache: {
    enabled: true,
    root: '.cache/launcher',                  // #5
  },

  logging: { level: 'succinct' }, // optional but nice
});
```

-----

## Configuration for the Renderer Bundle

For the most part, the renderer bundle can be written and developed in the same way you write and develop web apps; with the addition of these configurations:

1. The `target` field must be set to `'electron'`

2. Similar to configuration for the Launcher, `output`, `homeDir`, `cache`, and `webIndex` **must be customized to avoid collision.**

3. For reasons, `tslib` is required

4. (Optional) You can still use the devServer (browser flow) for development.



Here is an example of a valid renderer config:

```ts
fusebox({
  entry: 'renderer.ts',

  target: 'electron',                     // #1
  output: 'dist/renderer/$name-$hash',    // #2
  homeDir: 'src/renderer',                // #2
  webIndex: {
    publicPath: './',
    template: 'src/renderer/index.html',  // #2
  },
  cache: {
    enabled: false,
    root: '.cache/renderer',              // #2
  },
  dependencies: { include: ['tslib'] },   // #3

  devServer: {                            // #4
    httpServer: false,
    hmrServer: { port: 7878 },
  },

  logging: { level: 'succinct' }, // optional but nice
});
```


---------

## Launcher Code


The FuseBox bundle will not contain natives like `fs` or `path`, so you must enable NodeJS Integration in Electron.

```ts
mainWindow = new BrowserWindow({
  ...windowBounds.get(),
  webPreferences: {
    nodeIntegration: true,
  },
});
```


You can then direct your `mainWindow` to load up the renderer bundle.

```ts
mainWindow.loadURL(
  url.format({
    pathname: path.join(app.getAppPath(), '../', 'renderer', `index.html`),
    protocol: 'file:',
    slashes: true,
  }),
);
```

-----

## Running the Electron Project

You can now launch the application using the electron handler.

*(make sure you have the `electron` package installed)*

```ts
const main = fusebox({
  /* configuration */
}};
main.runDev(handler => {
  handler.onComplete(output => {
    output.electron.handleMainProcess();
  });
})
```

From here FuseBox will manage the process and start/restart the application when your `launcher`
bundle is changed.


-------



## Production builds

Production build (like any other scenario) is initiated by calling `runProd`. But unlike `runDev` as we know, it has a
slightly different API;

```ts
await electronMain.runProd({
  uglify: true,
  manifest: true,
  handler: handler => {
    handler.onComplete(output => {
      output.electron.handleMainProcess();
    });
  },
});
```

You can use the same handler, available in `runProd` under the `handler` field to launch and preview the application.

It's recommended to generate a manifest file. That will help you to create a production electron launcher. Since all the
bundles will be hashed, that would the right place to look for your application entry point.

```json
{
  "bundles": [
    {
      "type": "PROJECT_JS",
      "size": 1887,
      "absPath": "electron/dist/launcher/app-38c09469.js",
      "localPath": "app-38c09469.js",
      "name": "app",
      "priority": 10,
      "relBrowserPath": "app-38c09469.js",
      "webIndexed": true
    }
  ]
}
```
