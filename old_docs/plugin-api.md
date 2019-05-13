# Plugin API

The FuseBox Plugin API is a powerful, chainable mechanism for customizing your
build.

When designing a plugin, keep in mind that plugins in arrays will be chained, so
that, for example, LESS can be transformed to CSS before being made available to
JS as possible `import` sources:

```js
FuseBox.init({
  plugins: [JSONPlugin(), [LESSPlugin(), CSSPlugin()]],
});
```

Therefore, if your plugin has a few stages of transformations, consider breaking
it into reusable sub-plugins with standard output formats, and/or even chaining
in existing plugins to achieve your desired behavior. Like building blocks, the
possibilities are endless!

## Transforming individual files

Let's take a look at a plugin's interface first.

```typescript
interface Plugin {
  test?: RegExp;
  options?: any;

  dependencies?: string[];

  transform?(file: File, ast?: any): any;
  transformGroup?(file: File): any;
  onTypescriptTransform?(file: File): any;

  init?(context: WorkFlowContext): any;
  preBundle?(context: WorkFlowContext);
  bundleStart?(context: WorkFlowContext);
  bundleEnd?(context: WorkFlowContext);
  postBundle?(context: WorkFlowContext);
  producerEnd?(producer: BundleProducer): any;
}
```

### test [RegExp]

Defining an optional `test` Regex will filter the files sent to your plugin. For
example, `\.js$` will only send your plugin files ending with the `.js`
extension. If `test` matches, FuseBox will call your plugin's `transform` method
to process the file. Experiment with [regex101](http://regex101.com/) to see
what it will match.

### dependencies

`dependencies` is an optional list of npm packages your plugin might require. If
provided, FuseBox will load the listed dependencies on the client before the
plugin is invoked. For an example, see the
[CSSPlugin source](https://github.com/fuse-box/fuse-box/blob/master/src/plugins/stylesheet/CSSplugin.ts)

### transform

The `transform` method will be called on any file that matches your plugin's
`test` property. The first argument will be the
[`File`](https://github.com/fuse-box/fuse-box/blob/master/src/core/File.ts)
object.

### Hooks

FuseBox gives you hooks that let your plugin respond to different lifecycle
events in the build before the bundle gets written to a file. In order, it calls

1. `init` (called by
   [ModuleCollection](https://github.com/fuse-box/fuse-box/blob/master/src/core/ModuleCollection.ts).initPlugins)
2. `preBundle`
   ([FuseBox](https://github.com/fuse-box/fuse-box/blob/master/src/core/FuseBox.ts).triggerPre)
3. `bundleStart`
   ([FuseBox](https://github.com/fuse-box/fuse-box/blob/master/src/core/FuseBox.ts).triggerStart)
4. `bundleEnd`
   ([FuseBox](https://github.com/fuse-box/fuse-box/blob/master/src/core/FuseBox.ts).triggerEnd)
5. `postBundle`
   ([FuseBox](https://github.com/fuse-box/fuse-box/blob/master/src/core/FuseBox.ts).triggerPost)
6. `producerEnd` (after all bundles are finished,
   [BundleProducer](https://github.com/fuse-box/fuse-box/blob/master/src/core/BundleProducer.ts).run)

Each of the trigger handlers 1-5 is passed a WorkFlowContext as the argument,
which tracks build data for the bundle under construction.

To have your plugin add code to the bundle, you define one of these supported
trigger handlers 2-5, and have your handler call `context.source.addContent`
with a string. This will tell FuseBox to append that string to whatever has been
added to the bundle so far. `init` and `producerEnd` are special and will be
discussed in their own sections below.

In order of execution:

#### init

`init` is called to initialize a plugin. Here, you can process your `options`
and setup your plugin state. A return value is not required.

#### preBundle

`preBundle` is called before anything has been added to the bundle at all. If
something needs to be set up in global scope before the rest of a bundle
executes, it can be added here.

#### bundleStart

The `bundleStart` method gets called after FuseBox has already added two things:

1. The start of the function which wraps your bundle and hides it from global
   scope. This also provides access to the `FuseBox` object. See
   [BundleSource](https://github.com/fuse-box/fuse-box/blob/master/src/BundleSource.ts).init.
2. The shims from the `shim` object in your FuseBox config.

Code added here will be wrapped in the same block of scope as your other bundled
code, and also be hidden from global scope like they are. Variables set here
will be accessible to the bundle.

#### bundleEnd

The `bundleEnd` method gets called after all files have been packed into the
bundle, but before FuseBox's scope wrapping function is closed around your app's
code.

Code appended at this point will live in the same scope as your other bundled
code and also have access to the `FuseBox` object. This is useful if your plugin
needs access to bundle variables, and bundles don't need access to this part of
your plugin. The
[HotReloadPlugin](https://github.com/fuse-box/fuse-box/blob/master/src/plugins/HotReloadPlugin.ts)
uses this to its advantage so that it can change variables in the bundle without
reloading the page in the browser.

#### postBundle

`postBundle` is the last thing that happens before the bundle gets written to a
file.
[UglifyPlugin](https://github.com/fuse-box/fuse-box/blob/master/src/plugins/UglifyJSPlugin.ts)
uses this trigger so that it can completely replace `context.source` with
minified JS.

#### producerEnd

`producerEnd` is a special handler that gets called after all the bundles have
been generated. This is a good place for functionality affecting the entire
project, or many bundles at once. Unlike the other trigger handlers, which get
the WorkflowContext object, this handler gets passed the BundleProducer object
as its argument, and you can access all the bundles from `producer.bundles`.
Even better, you can register your plugin to be notified for file changes like
this:

```typescript
producer.sharedEvents.on("file-changed", (bundle: Bundle, path: string) => {
  /* your handler */
});
```

You can inject additional CSS files with `producer.injectedCSSFiles.add(fname)`.
You can also add warnings by modifying `producer.warnings`, which is a
`Map<string, []string>` so that you can group your warnings by key.

For example usages, look at the `producerEnd` methods in

- [QuantumPlugin](https://github.com/fuse-box/fuse-box/blob/master/src/quantum/plugin/QuantumPlugin.ts),
  which goes over and tree-shakes all the bundles
- [WebIndexPlugin](https://github.com/fuse-box/fuse-box/blob/master/src/plugins/WebIndexPlugin.ts),
  which rebuilds index.html, rewriting the CSS and JS dependencies there

### File

The File object contains the contents of a file as they have been transformed so
far, its relative and absolute paths, and lists of other resources it depends
on. Here are some of the most important fields of the File object:

- `contents` - a string which we can edit to change the output of a particular
  chunk
- `info: {}` - path information about the file, such as
  - `info.absPath`
  - `info.fuseBoxPath`
- `analysis.dependencies`: an array of strings populated during
  [file](https://github.com/fuse-box/fuse-box/blob/master/src/core/File.ts).analysis.analyze.
  The dependencies can be erased by setting this to an empty array.

Read the sources for more:

- [File](https://github.com/fuse-box/fuse-box/blob/master/src/core/File.ts)
- [FileAnalysis](https://github.com/fuse-box/fuse-box/blob/master/src/analysis/FileAnalysis.ts)

#### AST

To use the AST of a file, we need to know if the AST has been loaded already. We
can do this by checking whether `file.analysis.ast` is `undefined`. If the AST
has not been loaded yet, we can load it like this:

```js
// sets file.contents
file.loadContents();
// build the AST from file.contents
file.analysis.parseUsingAcorn();
// transform the AST with built-in FuseBox analysis plugins, and record deps
file.analysis.analyze();
```

If BabelPlugin has been used, [Babel](https://github.com/babel/babylon) will
build the AST instead of acorn.

You can actually load any AST parser you'd like with this:

```js
if (!file.analysis.ast) {
  const result = YourAST(file.contents);
  file.analysis.loadAst(result.ast);
  file.analysis.analyze();
}
```

For more examples, see the other
[JS transpiler plugins](https://github.com/fuse-box/fuse-box/tree/master/src/plugins/js-transpilers)
included with FuseBox.

To see how you can transform an AST, check out the
[Analysis plugins folder](https://github.com/fuse-box/fuse-box/tree/master/src/analysis/plugins).
These plugins are called during `file.analysis.analyze()`.

### Transforming TypeScript

You can transform TypeScript code before it gets transpiled to JS by defining an
`onTypescriptTransform` method in your plugin:

```js
const MySuperTranformation = {
  onTypescriptTransform: file => {
    file.contents += "\n console.log('I am here')";
  },
};
FuseBox.init({
  plugins: [MySuperTranformation],
});
```

To transform other sources, consider using one of the triggers described above.

## Combining files

Sometimes, it's enough to transform files so that there is just one product for
each input. That is a common thing to do at the beginning of a plugin chain. At
the end of a plugin chain, though, we often want to combine everything into one
build product. FuseBox provides several tools our plugins can use to do that.

### Alternative content

For more advanced loading behavior, sometimes we want more indirection. That is,
maybe we want to leverage the browser-side cache for future page loads, and have
`require()` provide an über-module containing a bunch of little modules, instead
of just one tiny module alone can use the browser-side cache. Maybe we want to
lazily load certain bundles via AJAX if and only if needed.

Whatever the reason, if we want to preserve `file.contents` for later use (e.g.
in `transformGroup`, or even `bundleEnd` or `postBundle`), but make other code
depending on this one see something different when they load it, we can set
`file.alternativeContent` to a string. This tells BundleSource to insert
`file.alternativeContent` instead of `file.contents` like normal. By default,
`file.alternativeContent` is `undefined`.

The ConcatPlugin described in the next section uses `alternativeContent` to make
importers of little files get a larger file containing all the little files
instead.

### Concat files

It is possible to string files together using the plugin API. We'll explore
[ConcatPlugin](https://github.com/fuse-box/fuse-box/blob/master/src/plugins/ConcatPlugin.ts)
to show how.

Imagine a plugin chain:

```js
[/\.txt$/, ConcatPlugin({ ext: ".txt", name: "txtBundle.txt" })],
```

We have 2 files, `a.txt` and `b.txt` which are captured by the plugin API, and
each of them is routed into the ConcatPlugin's `transform` method, which looks
like this:

```typescript
public transform(file: File) {
    // Loading the contents of file a.txt or b.txt
    file.loadContents();

    let context = file.context;

    // If this file is already part of a file group, reuse the group, and add
    // another copy of the file.
    let fileGroup = context.getFileGroup(this.bundleName);
    if (!fileGroup) {
        // Create a file group, named after the bundle which you have defined in
        // your FuseBox config. (A file group is actually just a File object,
        // but we are creating it in memory. This lets us require() it later.)
        fileGroup = context.createFileGroup(this.bundleName, file.collection, this);
    }
    // Adding current file (say a.txt) as a subFile
    fileGroup.addSubFile(file);

    // Anytime someone requires this subfile, require the group instead
    file.alternativeContent = `module.exports = require("./${this.bundleName}")`;
}
```

When we register a new file group
`context.createFileGroup("txtBundle.txt", ...)` FuseBox creates a **fake** or a
virtual file which is now available to be `require()`-ed or `import`-ed.

We need to alter the output as well using
[alternative content](#alternative-content). This way, the original contents of
the file will not be copied into bundles depending on this file. Instead, they
will get a bite-sized `require` statement referring to our file group. (This is
useful if, for example, you want a shared CSS file common to all pages in your
site. Bonus: you don't have to modify imports in your sources! You can toggle it
right from your FuseBox config!)

After FuseBox has bundled all files related to your current project,
[ModuleCollection](https://github.com/fuse-box/fuse-box/blob/master/src/core/ModuleCollection.ts).transformGroups
will iterate over all the groups in `context.fileGroups`. FuseBox will know
which plugin's `transformGroup` should handle this group by checking the
imaginitively-named `group.groupHandler`. We already set this to an instance of
ConcatPlugin earlier in `transform`, when we passed `this` in the call to
`createFileGroup`. Now, FuseBox checks to make sure the `transformGroup` method
is defined in ConcatPlugin, and calls it, providing the group as an argument.

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

Again, the `group` here is just a File object, so we can `require()` it like any
other file. It just also happens to be listed in `context.fileGroups` so that it
gets processed after the individual files (including the ones making up this
group) have been processed.

Now, if `a.txt` contained "hello" and `b.txt` contained "world", our bundle will
have a virtual file which looks like this:

```js
___scope___.file("txtBundle.txt", function(
  exports,
  require,
  module,
  __filename,
  __dirname,
) {
  module.exports = "hello\nworld";
});
```

#### Things to experiment with

- Try logging the contents of the virtual file
- Try changing the contents of a file
- Try logging the AST once it has been loaded

## Plugin API source code

- [BabelPlugin](https://github.com/fuse-box/fuse-box/blob/master/src/plugins/BabelPlugin.ts)
- [BundleSource](https://github.com/fuse-box/fuse-box/blob/master/src/BundleSource.ts)
- [File](https://github.com/fuse-box/fuse-box/blob/master/src/core/File.ts)
- [FileAnalysis](https://github.com/fuse-box/fuse-box/blob/master/src/analysis/FileAnalysis.ts)
- [FileAnalysis plugins](https://github.com/fuse-box/fuse-box/tree/master/src/analysis/plugins) -
  separate from regular plugins, these walk and transform a JS AST
- [FuseBox](https://github.com/fuse-box/fuse-box/blob/master/src/core/FuseBox.ts)
- [WorkflowContext](https://github.com/fuse-box/fuse-box/blob/master/src/core/WorkflowContext.ts)
- [CSSPlugin tests](https://github.com/fuse-box/fuse-box/blob/master/src/tests/CSSPlugin.test.ts)
- [All built-in plugins](https://github.com/fuse-box/fuse-box/tree/master/src/plugins) -
  check out the folders, too!
