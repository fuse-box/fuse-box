# Web Index

The `webIndex` feature allows to process a template HTML file in your project and let fuse-box inject the generated
JavaScript and CSS bundles at specific places you define.

```ts
fusebox({
  webIndex: { template: 'src/index.html' },
});
```

Your template may contain two variables which are replaced by thier `<script ...>` and `<link rel="stylesheet" ... />`
counterparts:

- `$bundles`: JavaScript bundles generated
- `$css`: CSS bundles generated

```html
<!DOCTYPE html>
<html>
  <head>
    <title></title>
    $css
  </head>

  <body>
    Some content above the JS bundles. $bundles
  </body>
</html>
```

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

## Custom transformations

You might be interested in transforming the `index.html` template page even further dynamically. For this purpose you
can develop a plugin that listens to the event `before_webindex_write` like this:

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
