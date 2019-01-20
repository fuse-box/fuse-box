---
id: worker-global-scope-plugin
title: WorkerGlobalScopePlugin
---

## Description

Fixes `window is undefined` errors in web workers that result from a different global scope.
[https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers#Web_Workers_API]

## Setup

Import from FuseBox

```js
const { WorkerGlobalScopePlugin } = require("fuse-box");
```

Inject into a chain

```js
fuse.plugin(WorkerGlobalScopePlugin());
```

Or add it to the main config plugins list to make it available across bundles

```js
FuseBox.init({
  plugins: [WorkerGlobalScopePlugin()],
});
```
