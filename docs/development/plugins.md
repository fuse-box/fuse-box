# Plugin development

Plugins in FuseBox are functions to which the `Context` is passed. You can alter the behavior by tapping into global
events, intercepting modules/system events etc.

## Plugin Convention

all plugins in FuseBox start with `plugin`. Let's keep the convention and add another plugin `pluginFoo`

It's important to make your plugin flexible, therefore if your plugin works with modules (captured) you should offer 2
arguments, where the first one could be either a `string` or `RegExp` of `YourOptionInteface`. The second argument must
be your plugin options always.

User can choose whether to apply the plugin globally or pick files individually.

`parsePluginOptions` is a helper that parser 2 arguments and gives you a `matcher` - that's the Regular expression you'd
be testing paths against, and the option.

A very basic setup looks like this:

```ts
import { parsePluginOptions } from 'fuse-box/plugins/pluginUtils';
export interface IPluginProps {
  useDefault?: boolean;
}
export function pluginFoo(a: string | RegExp | IPluginProps, b?: IPluginProps) {
  let [opts, matcher] = parsePluginOptions<IPluginProps>(a, b, {
    useDefault: true, // those are the default values if user didn't specifiy any
  });
  return (ctx: Context) => {

  });
})
```

Obviosly, if you are not planning on applying your plugin globally (to all files) you can skip the `parsePluginOptions`
having only one arguments

## How plugins works?

### ICT - Interceptor

Every plugin is a function which returns another function with the `Context`. Context in FuseBox is a global object
which is shared between all the running instances in FuseBox. They way we alter the behavior is through an
`Interceptor`.

Interceptor or `ict` (that's how it's being called in the Context) is an object which can emit and trigger events. Most
of the functionality goes through the `ict`

Having the Context gives us the access to `ict`. For example:

```ts
const pluginBar = () => (ctx: Context) => {
  ctx.ict.on('complete', props => {
    console.log('Bundling is completed');
    return props;
  });
};
```

If your plugin is asynchronous and you want to instruct fuse-box to wait until the `Promise` that it returns will
resolve, you should use `waitFor`. This will give fuse-box the change to wait until your plugin finished it's work.
Please notice that fuse-box will decide if it will await the results or not (depending on the event and context).

```ts
const pluginBar = () => (ctx: Context) => {
  ctx.ict.waitFor('complete', async props => {
    console.log('Bundling is completed');

    // in async functions, all return values are wrapped in Promises automatically
    return props;
  });
};
```

## Module plugins

Module plugins are the ones that work with the actual files (javascript or typescript) A very simple plugin that
modifies the code, would look like this:

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
    ctx.ict.on('bundle_resolve_module', props => {
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

## Capturing modules

You can capture modules with a simple RegExp that is provided by `parsePluginOptions`.

```ts
ctx.ict.on('bundle_resolve_module', props => {
  if (!matcher.test(props.module.props.absPath)) {
    return;
  }
});
```

It's usually a very good practice not to block other plugins and check whether a module has been captured earlier.

```ts
if (!props.module.captured) {
  props.module.captured = true;
}
```

Don't forget to toggle the flag, otherwise it might affect and break other plugins that might be working with the same
module.

There are several types of events related to capturing modules in `ict`

### assemble_before_analysis

If you have a custom language that you transform beforehand and then want to feed the javascript for analysis, that
would be right event

If you have a custom extension `.foo` follow the examble below

```ts
ctx.ict.on('assemble_before_analysis', props => {
  const module = props.module;
  if (props.module.props.extension === '.foo') {
    // do whatever you want with the contents
    // it's loaded at this point
    module.contents = `import "that_will_be_picked_up_by_fusebox"`;
  }
  return props;
});
```

Don't forget to make that `foo` extension executable

```ts
ctx.ict.on('assemble_module_init', props => {
  if (props.module.props.extension === '.foo') {
    // making module executable so fusebox will take it and parse all dependencies later on
    props.module.makeExecutable();
  }
  return props;
});
```

### assemble_module_init

```ts
ctx.ict.on('assemble_module_init', props => {});
```

At this point module hasn just been resolved. It won't contain any information (analysis etc.) whatsoever. Never perform
any async operations here, since it will lead to race conditions. NEVER transform the contents at this point.

**NEVER** transform the contents at **assemble_module_init**

### assemble_fast_analysis

```ts
ctx.ict.on('assemble_fast_analysis', props => {});
```

At this point the module has been analysed, and we know for sure that this module is executable (`js`, `jsx`, `ts`,
`tsx`)

You will never have this event triggered on an arbitrary file (e.g `json`)

That would a great place to add dependencies or read some information about the module. For example:

```ts
ict.on('assemble_fast_analysis', props => {
  const module = props.module;
  const pkg = module.pkg;

  if (pkg.isDefaultPackage && pkg.entry === module) {
    module.fastAnalysis.imports.push({ type: ImportType.REQUIRE, statement: 'fuse-box-hot-reload' });
  }
  return props;
});
```

Here we verify that we are dealing with an entry point for our application and inject a dependency.

**NEVER** transform the contents at **assemble_fast_analysis**

### bundle_resolve_module

Transform you contents here.

```ts
import { wrapContents } from 'fusebox/plugins/pluginStrings';

ctx.ict.on('bundle_resolve_module', props => {
  if (!props.module.captured) {
    const module = props.module;

    if (!matcher.test(module.props.absPath)) {
      return;
    }
    // read the contents
    module.read();
    module.contents = wrapContents(JSON.stringify({ foo: 'bar' }), opts.useDefault);
    props.module.captured = true;
  }
  return props;
});
```

If you are bulding a plugin that exports content make sure you give a possiblity to toggle `useDefault`. `wrapContents`
will take care of that.

The resulting contents will look as follows;

```js
Object.defineProperty(exports, '__esModule', { value: true });
module.exports.default = { foo: 'bar' };
```
