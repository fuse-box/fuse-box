# WebWorkers

## Introduction

FuseBox v4 features and a very simple and intutive way of working with `Worker` and `ShareWorker` object. What is the
actual problem and why does it need special treatments? To answer this question let's define requirements first;

- Worker doesn't have access to `window` object hence needs a special treatment
- Worker needs to be in a seperate bundle
- Worker might require transpilation (bundling)
- Path to workers need to be overridden

For example:

```ts
new Worker('./path/to/worker.js');
```

This is how a typical worker looks like. But here is a problem. This file needs to be publically available. Here comes
FuseBox, which offers automatic bundling with path re-writes and it supports production source maps too! Let's break it
down and try an example.

## Setting it up

Worker support doesn't require any configuration whatsoever (like the most features in FuseBox v4). So instead of trying
to configure it, let's enjoy and pass a relative path to the `Worker` init

First thing, let's create a folder `worker` (it will be explained later why it's better to have a separate folder)

```ts
const myWorker = new Worker('./worker');
myWorker.postMessage(['hello']);
myWorker.onmessage = function(e) {
  console.log('Message received from worker', e);
};
```

**IMPORTANT** FuseBox requires a static variable passed to the `Worker` or `SharedWorker` object

If you want to add some conditions to it, do it as described below:

```ts
if (process.env.NODE_ENV === 'development') {
  new Worker('./dev-worker');
} else {
  new Worker('./prod-worker');
}
```

Naturally, we need `index.ts` which will serve as an entry point for our new worker.

```ts
self.addEventListener(
  'message',
  function(e) {
    setInterval(() => {
      self.postMessage('I am working');
    }, 1000);
  },
  false,
);
```

You're all set up. FuseBox will automatically create a seperate bundle for development and production accordingly. If
you open the source of your application, you will notice that the path has been automatically re-written:

It looks like this:

```ts
new Worker('/worker1_0588407ac.js');
```

Now, but what if you want some custom configuration? No problem, we got your covered.

## Default behaviour

- Watching - WebWorker bundles will be watched automatically and re-bundled when changed.
- Shared Cache object - to avoid racing conditions
- Everything will be bunlding in 1 file

## Ignoring watcher paths

It's strongly recommended to place your workers in a separate folder and then ignore these folders in your master
configuration. For example

```ts
fusebox({
  watch: { ignored: ['worker/*'] },
});
```

FuseBox doesn't know about the dependenices of the worker (it's a separate process, remember? ), hence it's wise to
ignore those folders in order to prevent an excessive reload.

## Configuring

As said earlier, it's best to leave the configuration as is by default. However, if you want to add plugins and toggle
some flags, here is what you can do:

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
