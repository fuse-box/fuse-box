---
id: version-test-launching
title: Launching
original_id: launching
---

You can capture an event when a single bundle is completed. You will have access
to `FuseProcess` that will help you to launch your application on server.

```js
fuse.bundle("bundle2")
    .instructions(`~ index.ts`);
    .completed(proc => proc.start())

fuse.run()
```

## Executing a bundle

```js
completed(proc => proc.exec());
```

The following code will spawn a separate nodejs process once.

## Start / restart

```js
completed(proc => proc.start());
```

The following code will spawn a separate nodejs process, if a process is already
running FuseBox will kill and spawn a new one.

## Require

```js
completed(proc => proc.require(opts));
```

The following code will require a file in the same process as the fuse process
instead of launching a new one.

The differences are :

- A bundle is executed in a `Promise` and its exports are available to the fuse
  caller : `proc.require().then(exports => void)`.
- A bundle has access to the same loaded libraries than the fuser, they share
  the same global object.
- A bundle is inspected if fuse is inspected: `node --debug fuse.js` debugs the
  bundle too.
- To free the allocated resources when a bundle is restarted, there is no clean
  `process.kill` option; it must therefore export a `close` function, or a
  default that has such a function.

An `express` bundle would look as follows:

```js
export default app.listen(process.env.PORT);
```

### Options

- `close(bundleExport)=> Promise`: A closing function.

The exports of the main file can be retrieved with
`bundleExport.FuseBox.import(bundleExport.FuseBox.mainFile)`

### Closing function

When the module is unloaded, the first of these functions is called :

- A function `close(bundleExport)=> Promise` given as an option to `require`

After, if the bundle has a main file,

- An `export function close(): Promise` in the bundle
- A default export who has a `close()=> Promise` function.

If the close function returns a promise, this one will be awaited before
requiring the new version of the bundle. If it returns anything else than a
promise, the value is ignored. The `require` function by itself returns a
promise that resolves to the loaded bundle main-file `FuseBox` Object.
