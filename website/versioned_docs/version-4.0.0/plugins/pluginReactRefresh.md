---
id: version-4.0.0-pluginReactRefresh
title: pluginReactRefresh
original_id: pluginReactRefresh
---

## Usage

`pluginReactRefresh` will do enable 'react-refresh' feature that is fully supported hot reloading by react.

```ts
pluginReactRefresh(path: string | RegExp);
```

### Example

To use `pluginReactRefresh`, you have to do three steps. 

First, install `react-refresh` package that is used for wiring necessary to integrate Fast Refresh into bundlers.

Second, add custom hmr plugin file into your project. For example,

```ts
// hmr.ts
import { HMRHelper, HMRPayload } from "fuse-box/types/hmr";
import * as runtime from 'react-refresh';
import debounce from 'lodash/debounce';
const enqueueUpdate = debounce(runtime.performReactRefresh, 30);

export default function (payload: HMRPayload, helper: HMRHelper) {
    const { updates } = payload;
    helper.flushModules(updates);
    helper.updateModules();
    helper.callModules(updates);
    enqueueUpdate();
}
```

Thrid, configure hmr.ts and pluginReactRefresh on your fuse.ts

```ts
await fusebox({
    /*...*/
    hmr: {
        enabled: true,
        plugin: "path/to/hmr.ts",
    },
    plugins: [
        /*...*/
        pluginReactRefresh(/(\/page\/|\/component\/)/),
    ],
    /*...*/
})
```

That's it. Now plugin will add some codes on every module source for enable react refresh. And when the module is changed, hmr.ts will update react with react-refresh.

You can [read more about `react-refresh` for bundler here](https://github.com/facebook/react/issues/16604#issuecomment-528663101)