---
id: version-4.0.0-pluginMinifyHtmlLiterals
title: pluginMinifyHtmlLiterals
original_id: pluginMinifyHtmlLiterals
---

## Usage

_This plugin is typically only used for production builds._ It will minify any html it finds within `html` or `css`
template string literals. (ie: `` conts str = html`<div>I'm an html string literal</div>`; ``)This plugin uses the npm
module [minify-html-literals](https://github.com/asyncLiz/minify-html-literals#readme).

```ts
import { fusebox, pluginMinifyHtmlLiterals } from 'fuse-box';

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
