# Plugin API

Plugin API has a very powerful mechanism of manipulating the output.



Let's take a look a plugin's interface first

```typescript
interface Plugin {
    test?: RegExp;
    dependencies?: string[];
    init: { (context: WorkFlowContext) };
    transform: { (file: File) };
    bundleStart?(context: WorkFlowContext);
    bundleEnd?(context: WorkFlowContext);
}
```

### test [RegExp]

Defining `test` will filter files into your plugin. For example `\.js$`
If spefified you plugin's `transform` will get  triggered upon tranformation. It's optional.

### dependencies

`dependencies` a list of npm dependencies your plugin might require.  For example [this case](https://github.com/fuse-box/fuse-box/blob/master/src/plugins/CSSplugin.ts#L23)

### init

Happens when a plugin is initilized. Good places, to reset your states.

### transform

`transform` if your plugin has a `test` property, fusebox will trigger tranform method sending [file](https://github.com/fuse-box/fuse-box/blob/master/src/File.ts) as a first argument.

### bundleStart
Happens on bundle start. A good place to inject your custom code here. For example [here](https://github.com/fuse-box/fuse-box/blob/master/src/plugins/CSSplugin.ts#L50)

### bundleEnd
All files are bundled.

Please be patient! __Documentation is in progress__. 


