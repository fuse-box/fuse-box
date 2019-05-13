---
id: plugin-replace
title: pluginReplace
---

## Usage

`pluginReplace` will replace any string in the targeted (or all) files

```ts
import { fusebox, pluginReplace } from 'fuse-box';
```

In order to replace the contents in all files do the following:

```ts
fusebox({
  plugins: [pluginReplace({ $version: '1.1.0' })],
});
```

It's cheaper, however, to target a specific file:

```ts
fusebox({
  plugins: [pluginReplace('compoents/Other.ts', { $version: '1.1.0' })],
});
```
