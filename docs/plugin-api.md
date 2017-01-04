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
## Spec

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

## Concat files

It is possible to concat file into a one using plugin API. There is [ConcatPlugin](https://github.com/fuse-box/fuse-box/blob/master/src/plugins/ConcatPlugin.ts#L51) which serves as an example for the subject. 

It order to understand how it works imagine a plugin chain:

```js
[/\.txt$/, fsbx.ConcatPlugin({ ext: ".txt", name: "textBundle.txt" })],
```

We have 2 files, `a.txt` and `b.txt` which are captured by the plugin API, and each of them is redirected to the ConcatPlugin's transform, which looks like this:

```
public transform(file: File) {
    // Loading the contents of file a.txt or b.txt
    file.loadContents();

    let context = file.context;
    
    // create a file group in the context with name which is set in the plugin configuration
    // let's say "txtBundle.txt"
    let fileGroup = context.getFileGroup(this.bundleName);
    if (!fileGroup) {
        fileGroup = context.createFileGroup(this.bundleName);
    }
    // Adding current file (say a.txt) as a subFile 
    fileGroup.addSubFile(file);

    // making sure the current file refers to an object at runtime that calls our bundle
    file.alternativeContent = `module.exports = require("./${this.bundleName}")`;
}
 ```




