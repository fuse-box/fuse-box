---
id: version-4.0.0-webworkers
title: Webworkers
original_id: webworkers
---

_A new FuseBox v4 feature_

### What are Workers?

Workers are a means of multi-threading in javascript. Because javascript is single-threaded, workers must act as a
_totally separate context_. The following is the problem set which FuseBox works through:

1. Workers never have acess to the `window` object
2. Each worker must have its own bundle
3. All paths to workers must be overwritten to instead point to the workers' bundle.

Fortunately, FuseBox catches Workers and handles all of these by default.

<!--
a very simple and intuitive way of working with `Worker` and `ShareWorker` object. What is the
actual problem and why does it need special treatments? To answer this question let's define requirements first;

- Worker doesn't have access to `window` object hence needs a special treatment
- Worker needs to be in a separate bundle
- Worker might require transpilation (bundling)
- Path to workers need to be overridden

For example:

```ts
new Worker('./path/to/worker.js');
```

This is how a typical worker looks like. But here is a problem. This file needs to be publicly available. Here comes
FuseBox, which offers automatic bundling with path re-writes and it supports production source maps too! Let's break it
down and try an example. -->

---

## Setting it up

1. First, create an entry point file. Similar to your project entry point, this is a file which acts as the root of a
   bundle.

   ```ts
   // src/workers/my-worker.ts
   self.addEventListener(
     'message',
     function (e) {
       setInterval(() => {
         self.postMessage('I am working');
       }, 1000);
     },
     false,
   );
   ```

2. (optional) For the sake of efficiency, it's usually best to put Worker entry point files in a folder that can be
   ignored by the rest of the project. If you don't do this, the _entire project bundle_ will update with every change
   to the worker, instead of just the worker bundle.

   ```ts
   fusebox({
     watch: { ignored: ['src/workers/*'] },
   });
   ```

3. Finally, call `new Worker()` and pass it a **static** path argument to it's entry file.

   ```ts
   const myWorker = new Worker('./workers/my-worker');
   myWorker.postMessage(['hello']);
   myWorker.onmessage = function (e) {
     console.log('Message received from worker', e);
   };
   ```

### Conditional Static Path Arguments

FuseBox requires the path variable passed to the `Worker` or `SharedWorker` object to always be static.

If you want to add some conditions to it, you can do it as described below:

```ts
if (process.env.NODE_ENV === 'development') {
  new Worker('./workers/dev-my-worker');
} else {
  new Worker('./workers/my-worker');
}
```

---

## Default behavior

- Watching - WebWorker bundles will be watched automatically and re-bundled when changed.
- Shared Cache object - to avoid racing conditions everything will be bundling in 1 file

---

## Configuring

In most scenarios, the default configuration should do the trick. But if you would like to add plugins or toggle some
flags, here is what you can do:

```ts
fusebox({
  webWorkers : {
     config: {
       alias : { foo : "bar"}
     };
  }
})
```

There are restrictions, for example the following list of items cannot be overridden:

| field     | value      | reason                                                                 |
| --------- | ---------- | ---------------------------------------------------------------------- |
| homeDir   | [parent]   | The exact same directory,                                              |
| target    | web-worker | FuseBox sets a special target "web-worker",                            |
| devServer | false      | You cannot launch a devServer inside a webworker process               |
| hmr       | false      | WebWorker is an isolated instance, which doesn't have access to window |
| entry     | [differs]  | Entry is being set automatically after the path has been resolved      |
| logging   | [disabled] | Logging is disabled unless `--verbose` flag is passed                  |
