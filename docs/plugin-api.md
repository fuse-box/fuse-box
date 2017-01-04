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

## Alternative content

If for some reason we want to preserve file contents for a later reuse and override the output, we can use 
`file.alternativeContent` which affects directly bundling process over [here](https://github.com/fuse-box/fuse-box/blob/96b646a632f886f296a533ccf4c45f436cf443f3/src/BundleSource.ts#L133)

It can be use for the [concat](#concat-files) technique for example

## Concat files

It is possible to concat files into one using the plugin API. There is [ConcatPlugin](https://github.com/fuse-box/fuse-box/blob/master/src/plugins/ConcatPlugin.ts#L51) which serves as an example for the subject. 

In order to understand how it works imagine a plugin chain:

```js
[/\.txt$/, fsbx.ConcatPlugin({ ext: ".txt", name: "textBundle.txt" })],
```

We have 2 files, `a.txt` and `b.txt` which are captured by the plugin API, and each of them is redirected to the ConcatPlugin's transform, which looks like this:

```js
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
 
When we register a new file group `context.createFileGroup("txtBundle.txt")` FuseBox creates a __fake__ or a virtual file which is added to the dependency tree. This file has a special mode, called `groupMode`.

We need to alter the output as well using [alternative content](#alternative-content). Original contents will be ignored by the Source bundler.

After FuseBox has bundled all files related to your current project, it checks for groups over [here](https://github.com/fuse-box/fuse-box/blob/master/src/ModuleCollection.ts#L260), iterates and executes plugins. Then each plugin is tested accordingly (now our file name is called `txtBundle.txt` with `.txt` extension) and executes `transformGroup` of a plugin if set.

You should understand that `txtBundle.txt` behaves like any other file, with one exception - it does not call `transform` but `tranformGroup` instead.


```js
public transformGroup(group: File) {
    let contents = [];
    group.subFiles.forEach(file => {
        contents.push(file.contents);
    });
    let text = contents.join(this.delimiter);
    group.contents = `module.exports = ${JSON.stringify(text)}`;
}
 ```
 
Now our bundle has a virtual file which looks like this:

```js
___scope___.file("textBundle.txt", function(exports, require, module, __filename, __dirname){ 
    module.exports = "hello\nworld"
});
```

