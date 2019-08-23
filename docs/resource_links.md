# Resource links

FuseBox takes an assumption that imports like

```ts
import * as file from './grumpy_cat.png';
```

Will be treated as public links. Below is the list of file extension that be assumed to be public links and copied
accordingly to your dest folder

```js
['.ttf', '.otf', '.woff', '.woff2', 'eot', '.png', '.jpeg', '.jpg', '.gif', '.bmp', '.svg'];
```

If you wish to tweak the settings, try the following public configuration:

```ts
fusebox({
  link: { useDefault: true, resourcePublicRoot: '/some-custom-public-root' },
});
```

# Resource root

If no option specified, FuseBox will try to assume your resource root by doing the following:

- Checking `resources` setting for `resourceFolder` and `resourcePublicRoot` field
- Checking `webIndex` setting for `publicPath` and combined it with `resourceFolder`

You can override those settings by doing the following:

```ts
fusebox({
  resources: {
    resourceFolder: './some_folder',
    resourcePublicRoot: '/assets',
  },
});
```

If the global configuration doesn't suit you, alternatively you can define it either globally and in the plugin which is
exposed by FuseBox;

```ts
fusebox({
  link: { resourcePublicRoot: '/some-custom-public-root' },
});
```

# Via Plugin

Alternatively, you can use a plugin to override/add additional rules:

```ts
fusebox({
  plugins: [pluginLink(/\.png/, { useDefault: true })],
});
```

You can also use string:

```ts
pluginLink("somepath/(png|jpg)$"/, { useDefault: true })
```
