---
id: version-4.0.0-pluginJSON
title: pluginJSON
original_id: pluginJSON
---

## Usage

This plugin is included by default. It is used to catch imports of json files and transform them into a json object.

You can manually override the way the JSON is exported like so:

```ts
import { fusebox, pluginJSON } from 'fuse-box';
fusebox({
  plugins: [pluginJSON('configs/.*', { useDefault: true })],
});
```
