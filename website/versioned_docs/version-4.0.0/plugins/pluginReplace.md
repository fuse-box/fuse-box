---
id: version-4.0.0-pluginReplace
title: pluginReplace
original_id: pluginReplace
---

## Usage

`pluginReplace` will replace any string in the targeted -- or all -- files.

### Example

To replace the string `"$version"` with `"1.1.0"` in all files in the components folder, you could use a RegExp which
matches their file names, and an object which contains properties of the string you'd like to replace and values of the
replacement you'd like.

```ts
import { fusebox, pluginReplace } from 'fuse-box';

fusebox({
  plugins: [pluginReplace(/components\/.*/, { $version: '1.1.0' })],
});
```
