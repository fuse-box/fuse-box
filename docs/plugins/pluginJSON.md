---
id: plugin-json
title: pluginJSON
---

## Usage

By default all the exports are not using `default`.

You don't need to add this plugin. IT's already a part of the core, unless you want to manually handle it and override
the way the JSON is exported

```ts
import { fusebox, pluginJSON } from 'fuse-box';
fusebox({
  plugins: [pluginJSON('configs/.*', { useDefault: true })],
});
```
