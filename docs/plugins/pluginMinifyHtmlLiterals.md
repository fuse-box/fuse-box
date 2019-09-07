---
id: pluginMinifyHtmlLiterals
title: pluginMinifyHtmlLiterals
---

## Usage

This plugin should only be used for production builds. `pluginMinifyHtmlLiterals` uses npm module
[minify-html-literals](https://github.com/asyncLiz/minify-html-literals#readme). Plugin looks for template tags with
name `html` and `css` in javascript and typescript files.

```ts
import { fusebox, pluginMinifyHtmlLiterals } from 'fuse-box';
```

```ts
fusebox({
  plugins: [pluginMinifyHtmlLiterals()],
});
```

You can also use [minify-html-literals](https://github.com/asyncLiz/minify-html-literals#readme) module options, these
will be added after the source content. See npm module
[minify-html-literals](https://github.com/asyncLiz/minify-html-literals#readme) for all options you can use.

```ts
fusebox({
  plugins: [pluginMinifyHtmlLiterals(/* minify-html-literals npm module options */),
});
```
