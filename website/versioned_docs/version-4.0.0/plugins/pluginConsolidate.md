---
id: version-4.0.0-pluginConsolidate
title: pluginConsolidate
original_id: pluginConsolidate
---

## Usage

This plugin allows to use an arbitrary template engine supported by
[`consolidate.js`](https://github.com/tj/consolidate.js) to be used to process a `webIndex` template file. The usage is
easy and effective:

```ts
pluginConsolidate(engine: string, options: any);
```

## Example

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

### Arguments

1.  The first argument is the name of the template engine to use. The name must exactly match with the name of the
    engines function name in the `consolidate` module.

2.  The second argument may contain data that you want to use in the template.

        The keys `bundles` and `css` are already declared in the template data and contains fuse-box'es informations about the bundles

    generated.

---

You can [read more about `consolidate.js` here](https://github.com/tj/consolidate.js)
