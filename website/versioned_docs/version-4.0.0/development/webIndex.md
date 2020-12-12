---
id: version-4.0.0-webIndex
title: WebIndex
original_id: webIndex
---

The `webIndex` field is used to configure how the final product html files are templated and handled.

By default, FuseBox will generate an empty html file with links to your javascript and stylesheet added.

---

## Creating a Custom HTML Template

1. First, create an html template file. The template should include the following two template strings:

   - `$bundles`: JavaScript bundles generated. Will be replaced with a list of `<script ...>` items
   - `$css`: CSS bundles generated. Will be replaced with a list of `<link rel="stylesheet" ... />` items.
   - `$import('<path>')`: Resource imports. Will be replaced with the path of the copied resource.

2. Then, direct FuseBox to use this template as the webIndex.

### Example

```html
<!DOCTYPE html>
<html>
  <head>
    <title>My Page Title</title>
    <link rel="icon" href="$import('assets/favicon.png')" />
    $css
  </head>

  <body>
    Some content above the JS bundles. $bundles
  </body>
</html>
```

```ts
fusebox({
  webIndex: { template: 'src/index.html' },
});
```

_If you'd like to define your own custom template strings (ie: `$bundles` and `$css`) you can do so with the
[Consolidate Plugin](./plugins/pluniConsolidate)_

---

## Advanced options

The WebIndex feature can be customized by the following optional parameters:

```ts
{
  enabled?: boolean;
  target?: string;
  template?: string;
  distFileName?: string;
  publicPath?: string;
  embedIndexedBundles?: boolean;
}
```

---

## Super Custom Transformations

If the [Consolidate Plugin](./plugins/pluniConsolidate)\* is not enough for your purposes, fou might be interested in
transforming the `index.html` template page dynamically. You can develop a plugin to do this by listening to the
`"before_webindex_write"` event:

```ts
function myCustomWebIndexTransformPlugin(options?: any) {
  return async (ctx: Context) => {
    ctx.ict.waitFor(
      'before_webindex_write',
      async (props: {
        filePath: string;
        fileContents: string;
        bundles: Array<IBundleWriteResponse>,
        scriptTags: Array<string>,
        cssTags: Array<string>
      }) => {
        props.fileContents = props.fileContents + 'Appended something after </html>'.
        return props;
      },
    );
  };
```

`before_webindex_write` is an awaited event. If you return a `Promise`, fuse-box will await your plugin to finish its
transformation before it writes out the HTML file.

Don't forget to apply your custom plugin in the fuse-box `plugins` section:

```ts
fusebox({
  webIndex: { template: 'src/index.html' },
  plugins: [myCustomWebIndexTransformPlugin()],
});
```
