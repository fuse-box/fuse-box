# Plugin development

Plugins in FuseBox are functions to which the `Context` is passed.
Using the `Context`, you can alter the behavior of fuse-box by
tapping into global/system events, intercepting modules, etc.

## Plugin Convention

While FuseBox is very flexible with what can be done, there are some battle tested
conventions which will help make your plugin easier to understand:

1. Start the name of your plugin with the word "plugin."  Ex. pluginSass, pluginRawText, etc.

2. Make the first argument for initialization of type `[string | RegExp | IYourPluginProps]`
and the second a configuration object of type `IYourPluginProps`.

	*(The `[string | RegExp]` is used to optionally match certain files.  The `IYourPluginProps` describe the configuration of your plugin.)*

3. (Optional) Use `parsePluginOptions` to parse these two arguments and returns a standard `RegExp` and `IPluginProps` pair.

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


------


## How do plugins work?

### ICT - Interceptor

Every plugin is part of a chain which takes the `Context`, modifies it, and passes it on.

The `Context` is a global object
which is shared between all the running instances in FuseBox.
This context object has an `Interceptor` property `context.ict`.


The Interceptor is an object which can emit and trigger events. Most functionality goes through the `Interceptor`.


```ts
const pluginBar = () => (ctx: Context) => {
	ctx.ict.on('complete', props => {
		console.log('Bundling is completed');
		return props;
	});
};
```

If your plugin is asynchronous and you want to instruct fuse-box to wait fair for it, you should pass a `Promise` to `context.ict.waitFor()`.
*Please notice that fuse-box might not wait (depending on the event and context).*

```ts
const pluginBar = () => (ctx: Context) => {
	ctx.ict.waitFor('complete', async props => {
		await someAsyncFunction();
		console.log('Bundling is completed');

		// async functions automatically treat return as resolve
		return props;
	});
};
```

------

## Module plugins

Module plugins ones which do work on the actual files (javascript or typescript). A very simple plugin that
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

------

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

------

## Module Events

### assemble_before_analysis

If you have a custom language that you transform beforehand and then want to feed the javascript for analysis, that
would be right event

If you have a custom extension `.foo` follow the example below

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

If you are building a plugin that exports content make sure you give a possibility to toggle `useDefault`. `wrapContents`
will take care of that.

The resulting contents will look as follows;

```js
Object.defineProperty(exports, '__esModule', { value: true });
module.exports.default = { foo: 'bar' };
```
