---
id: version-4.0.0-resource_links
title: Resource links
original_id: resource_links
---

By default, FuseBox assumes that imports like

```ts
import * as file from './grumpy_cat.png';
```

should be treated as public links. Below is a list of all the file extensions that are assumed to be public links. Upon
import, they will be copied to your dest folder.

```js
['.ttf', '.otf', '.woff', '.woff2', 'eot', '.png', '.jpeg', '.jpg', '.gif', '.bmp', '.svg'];
```

<!-- If you wish to tweak the settings, try the following public configuration:

```ts
fusebox({
  link: { useDefault: true, resourcePublicRoot: '/some-custom-public-root' },
});
``` -->

# Resource root

If no option specified, FuseBox will deduce your resource root by doing the following:

- Checking `resources` setting for `resourceFolder` and `resourcePublicRoot` field
- Checking `webIndex` setting for `publicPath` and combined it with `resourceFolder`

You can specify these settings like so:

```ts
fusebox({
  resources: {
    resourceFolder: './some_folder',
    resourcePublicRoot: '/assets',
  },
});
```

You can alternatively specify them with the `link` field:

<!-- If the global configuration doesn't suit you, alternatively you can define it either globally and in the plugin which is
exposed by FuseBox; -->

```ts
fusebox({
  link: { resourcePublicRoot: '/some-custom-public-root' },
});
```

# Via Plugin

Alternatively, you can create a pluginLink to override/add additional rules:

```ts
fusebox({
  plugins: [pluginLink(/\.png/, { useDefault: true })],
});
```

<!-- You can also use string:

```ts
pluginLink("somepath/(png|jpg)$"/, { useDefault: true })
``` -->
