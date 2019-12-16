# Transformer Plugin development

Before starting here, read the part about creating plugins. This document contains a short write up about
writing a plugin and transformer IN FuseBox. Not for FuseBox. This is only internally accessible.

## Using transformerAtPath

For these plugins we use the internal `transformerAtPath` function. This will assign our transformer thus our 
plugin to the correct files.

`transformerAtPath` accepts three arguments

```ts
public transformerAtPath(
  path: string | RegExp,
  transformer: (opts: any) => ITransformer,
  transformerOptions?: any
) {
  // ...
};
```

We use the third parameter to pass down our config.

## Full simple code example

Simplified example without fallbacks to defaults:

`fuse.ts`
```js
plugins: [
  pluginTest({
    autoInject: true,
    target: /src\/(.*?)\.(js|jsx|ts|tsx)$/
  }),
  pluginAlternative(
    /src\/(.*?)\.(js|jsx|ts|tsx)$/,
    {
      autoInject: true
    }
  )
]
```

Because we write the plugin ourselfs, we control the format we pass down to the `transformerAtPath`

`plugin_test.ts`
```ts
export function pluginTest(opts?: any) {
  const { target, ...options } = opts;
  return (ctx: Context) => {
    ctx.transformerAtPath(target, TestTransformer, options);
  };
};
```

`plugin_alternative.ts`
```ts
export function pluginAlternative(target: string | RegExp, options?: any) {
  return (ctx: Context) => {
    ctx.transformerAtPath(target, TestTransformer, options);
  };
};
```

Becasue `transformerAtPath` bubbles down our options, we can use them in the Transformer

`TestTransformer.ts`
```ts
export const TestTransformer = (opts?: any): ITransformer => {
  if (opts.autoInject) {
    // do something super awesome!!
  }
};
```
