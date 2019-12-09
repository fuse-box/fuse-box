---
id: plugin-consolidate
title: pluginConsolidate
---

## Usage

This plugin allows to use an arbitrary template engine supported by
[`consolidate.js`](https://github.com/tj/consolidate.js) to be used to process a `webIndex` template file. The usage is
easy and effective:

```ts
import * as ts from 'typescript';
import { fusebox, pluginConsolidate } from 'fuse-box';
fusebox({
  webIndex: { template: 'src/index.html' },
  plugins: [
    pluginConsolidate('pug', {
      // custom template data
      user: 'tobi',
    }),
  ],
});
```

As you can see, the first argument is the name of the template engine to use. The name must exactly match with the name
of the engines function name in the `consolidate` module.

The second argument may contain data that you want to use in the template.

The key `bundles` is already declared in the template data and contains fuse-box'es informations about the bundles
generated.
