---
id: version-4.0.0-createNewPlugin
title: Create new plugin
original_id: createNewPlugin
---

Plugins in FuseBox are functions to which the `Context` is passed. Using the `Context`, you can alter the behavior of
fuse-box by tapping into global/system events, intercepting modules, etc.

## Plugin Convention

While FuseBox is very flexible with what can be done, there are some battle tested conventions which will help make your
plugin easier to understand:

1.  Start the name of your plugin with the word "plugin." Ex. pluginSass, pluginRawText, etc.

2.  Make the first argument for initialization of type `[string | RegExp | IYourPluginProps]` and the second a
    configuration object of type `IYourPluginProps`.

        *(The `[string | RegExp]` is used to optionally match certain files.  The `IYourPluginProps` describe the configuration of your plugin.)*

3.  (Optional) Use `parsePluginOptions` to parse these two arguments and returns a standard `RegExp` and `IPluginProps`
    pair.

A very basic setup looks like this:

```ts
import { parsePluginOptions } from 'fuse-box/plugins/pluginUtils';
export interface IPluginProps {
	enableWarpSpeed?: boolean;
}
export function pluginFoo(a: string | RegExp | IPluginProps, b?: IPluginProps) {
	let [opts, matcher] = parsePluginOptions<IPluginProps>(a, b, {
		enableWarpSpeed: false, // these are the default prop values
	});
	return (ctx: Context) => {
		// plugin logic goes here...
	});
})
```

---

## How do plugins work?

### ICT - Interceptor

Every plugin is part of a chain which takes the `Context`, modifies it, and passes it on.

The `Context` is a global object which is shared between all the running instances in FuseBox. This context object has
an `Interceptor` property `context.ict`.

The Interceptor is an object which can emit and trigger events. Most functionality goes through the `Interceptor`.

```ts
const pluginBar = () => (ctx: Context) => {
  ctx.ict.on('complete', (props) => {
    console.log('Bundling is completed');
    return props;
  });
};
```

If your plugin is asynchronous and you want to instruct fuse-box to wait fair for it, you should pass a `Promise` to
`context.ict.waitFor()`. _Please notice that some event types are never treated asynchronously._

```ts
const pluginBar = () => (ctx: Context) => {
  ctx.ict.waitFor('complete', async (props) => {
    await someAsyncFunction();
    console.log('Bundling is completed');

    // async functions automatically treat return as resolve
    return props;
  });
};
```

---

## Module plugins

Module plugins ones which do work on the actual files (javascript or typescript). A very simple plugin that modifies the
code, would look like this:

```ts
import { Context } from 'fuse-box/core/Context';
import { wrapContents } from 'fuse-box/plugins/pluginStrings';
import { parsePluginOptions } from 'fuse-box/plugins/pluginUtils';

export interface IPluginProps {
  useDefault?: boolean;
}

export function pluginFoo(a: string | RegExp | IPluginProps, b?: IPluginProps) {
  let [opts, matcher] = parsePluginOptions<IPluginProps>(a, b, {
    useDefault: true,
  });
  return (ctx: Context) => {
    ctx.ict.on('bundle_resolve_module', (props) => {
      if (!props.module.captured) {
        const module = props.module;

        if (!matcher.test(module.props.absPath)) {
          return;
        }
        // read the contents
        module.read();
        module.contents = wrapContents('module.contents = foo', opts.useDefault);
      }
      return props;
    });
  };
}
```

---
