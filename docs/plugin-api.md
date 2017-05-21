# Plugin API

Plugin API has a very powerful mechanism of manipulating the output.



Let's take a look a plugin's interface first

```typescript
interface Plugin {
    test?: RegExp;
    opts?: any;
    init?: { (context: WorkFlowContext) };

    transform: { (file: File, ast?: any) };
    transformGroup?(file: File): any;
    onTypescriptTransform?: { (file: File) };

    dependencies?: string[];

    preBundle?(context: WorkFlowContext);
    bundleStart?(context: WorkFlowContext);
    bundleEnd?(context: WorkFlowContext);
    postBundle?(context: WorkFlowContext);

    // available, but not implemented yet
    preBuild?(context: WorkFlowContext);
    postBuild?(context: WorkFlowContext);
}

```
## Spec

### test [RegExp]

Defining `test` will filter files into your plugin. For example `\.js$`
If specified you plugin's `transform` will get triggered upon transformation. It's optional. Experiment with [regex101](http://regex101.com/) to see it will match.

### dependencies

`dependencies` a list of npm dependencies your plugin might require. If provided, then the dependencies are loaded on the client before the plugin is invoked. For example [this case](https://github.com/fuse-box/fuse-box/blob/master/src/plugins/stylesheet/CSSplugin.ts#L23)

### init

Happens when a plugin is initialized. It is common practice to reset your plugin state in this method.

### transform

`transform` if your plugin has a `test` property, fusebox will trigger transform method sending [file][src-file] as a first argument.

### triggers

#### bundleStart
Happens on bundle start. A good place to inject your custom code here. For example [here](https://github.com/fuse-box/fuse-box/blob/master/src/plugins/HotReloadPlugin.ts#L14)

#### bundleEnd
All files are bundled. But it has not been finalized and written to a file.

#### preBundle
Triggered after adding shims.

#### postBundle
Triggered after the bundle source has been finalized, but before it is written to file.
[UglifyPlugin](#UglifyJSPlugin) uses this trigger.

[see the source code that triggers these plugin methods](https://github.com/fuse-box/fuse-box/blob/master/src/core/FuseBox.ts#L179)


## Alternative content

If for some reason we want to preserve file contents for a later reuse and override the output, we can use
`file.alternativeContent` which affects directly bundling process over [here](https://github.com/fuse-box/fuse-box/blob/96b646a632f886f296a533ccf4c45f436cf443f3/src/BundleSource.ts#L133)

It can be use for the [concat](#concat-files) technique for example

If an array of plugins is passed, those plugins will be chained

```js
FuseBox.init({
    plugins: [
        fsbx.JSONPlugin(),
        [fsbx.LESSPlugin(), fsbx.CSSPlugin()],
    ],
})
```

## Transform

### Helpers

#### File
- `file.contents`: can rewrite the output of a particular chunk, it is a simple string
- `file.info`: information about the file, such as `file.info.absPath` and `file.info.fuseBoxPath`
- `file.analysis.dependencies`: can clear/flush dependencies of a file by setting it to an empty array.
- [read the File source for more](https://github.com/fuse-box/fuse-box/blob/master/src/analysis/FileAnalysis.ts#L28)

### AST
To use the AST, you need to know if the AST has been loaded already. You can do this by checking whether `file.analysis.ast` is not `undefined`.

If it has not been loaded, it can be loaded by doing:
```js
file.loadContents()
file.analysis.parseUsingAcorn()
file.analysis.analyze()
```

If the babel plugin has been used, the AST will be loaded using [babel babylon](https://github.com/babel/babylon).

You can load any ast parser you'd like by
```js
if (!file.analysis.ast) {
  const result = YourAST(file.contents)
  file.analysis.loadAst(result.ast)
  file.analysis.analyze()
}
```

[read the FileAnalysis source for more](https://github.com/fuse-box/fuse-box/blob/master/src/core/File.ts)


## Transforming typescript

You can tranform typescript code before it actually gets to transpiling

```js
const MySuperTranformation = {
    onTypescriptTransform: (file) => {
        file.contents += "\n console.log('I am here')";
    }
}
FuseBox.init({
    plugins: [MySuperTranformation],
})
```

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

We need to alter the output as well using [alternative content](#Alternative content). Original contents will be ignored by the Source bundler.

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


### Things to experiment with
- try changing the contents of a file
- try logging the contents of the file in the transformation file
- try logging the ast once it has been loading

### Plugin API source code
- [babel plugin](https://github.com/fuse-box/fuse-box/blob/v1.3.23/src/plugins/BabelPlugin.ts#L14)
- [bundle source code](https://github.com/fuse-box/fuse-box/blob/96b646a632f886f296a533ccf4c45f436cf443f3/src/BundleSource.ts#L133)
- [read the FileAnalysis code](https://github.com/fuse-box/fuse-box/blob/master/src/analysis/FileAnalysis.ts#L28)
- [css plugin tests](https://github.com/fuse-box/fuse-box/blob/master/src/tests/CSSPlugin.test.ts)
- [code for all built in plugins](https://github.com/fuse-box/fuse-box/tree/master/src/plugins)
