# Sparky

Sparky is a task runner much like `Gulp` or `Grunt`, but what sets it apart is that it is built on top of `FuseBox` technology. This means Sparky has the ability to use `FuseBox` plugins as well as the rest of the API to accomplish any build task you can throw at it. Out of the box, Sparky comes with a couple of helper functions for bumping the version number ([bumpVersion](#bumpVersion)), running the TypeScript compiler ([tsc](#tsc)), publishing to npm ([npmPublish](#npmPublish)), and much more listed below.

## Benefits

* Simple, intuitive, and familiar API.
* Based on Promises. `ES2017 async/await` syntax fully supported.
* Ability to run tasks in parallel and sequentially (waterfall).
* Nothing to install, Sparky comes with every installation of `FuseBox`

## Usage

Sparky does not depend on a CLI or global installation, instead just create a javascript file to define your tasks. It is a common convention to name this file `fuse.js`, but the name doesn't matter. Run sparky from your command line by passing the filename and task name in as arguments like so

```bash
$ node fuse.js task
```

Example:

```js
// build.js

const { src, task } = require('fuse-box/sparky');

task('clean', async context => {
  await src('./dist')
    .clean('dist/')
    .exec();
});
```

To run the above task the command would be:

```bash
$ node build.js clean
```

## Context

One of the great benifits in Sparky is `Context`. Context is a shared object between tasks that will be constructed/executed upon execution

A class will be instantiated

```js
const { src, context, task } = require('fuse-box/sparky');
context(
  class {
    getConfig() {
      return FuseBox.init({
        homeDir: 'src',
        output: 'dist/$name.js',
        hash: this.production
      });
    }
  }
);
task('default', context => {
  context.production = true;
  const fuse = context.getConfig();
});
```

Function evaluated

```js
context(() => ({ isProduction: true }));
task('default', context => {
  // context.isProduction === true
});
```

Plain Object passed

```js
context({ isProduction: true });
```

## Task

First thing you have to do with `Sparky` is to define a Task, A Task takes two parameters, Task's name and a Function.

```js
task('foo', () => {});
```

You can also use `ES2017` `async/await` syntax.

```js
task('foo', async () => {
  await someAsynchronousFunction();
});
```

to execute the task, run `node fuse foo` and enjoy :)

## Waterfall vs Parallel

`Sparky` has two modes for executing tasks, `waterfall` and `parallel`. in `waterfall` mode, tasks are executed sequentially based on the order they are defined. This is good if you require a task to wait until another task is completed. In `parallel` mode tasks are executed asynchronously, meaning they will not depend on each other's completion.

```js
task('foo', () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      return resolve();
    }, 1000);
  });
});

task('bar', () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      return resolve();
    }, 1000);
  });
});

// bar task wont run until foo task is done
task('waterfall', ['foo', 'bar'], () => {});

// foo and bar will run immediatly
task('parallel', ['&foo', '&bar'], () => {});
```

## Aggregator task

You can also create a task that combines other tasks but doesn't have any function itself.
For example:

```js
task('copy-assets', [
  '&copy:pdf', // parallel task mode
  '&copy:text-files' // parallel task mode
]);
task('copy:pdf', async context => {
  // copy pdf files here
});

task('copy:text-files', async context => {
  // copy text files here
});
task('default', ['copy-assets'], async context => {
  // or exec(['copy-assets'])
});
```

## src

This method tells `Sparky` what files it needs to operate on.

```js
src('src/**/**.*');
```

The above will basically capture all files in your `src` folder.

Say you want to capture all `HTML` files in your `src` folder, do the following:

```js
src('src/**/*.html');
```

or you want to capture all images file formats

```js
src('src/**/*.(jpg|png|gif)');
```

Source method also accepts a second parameter to inject some options:

### options.base

Sets the base path from which the path names will be resolved.

For example: If we have an `asset` folder, and inside that, a file called `logo.png`...

```js
src('./src/assets/*.png')
  .dest('./dist')
  .exec();
// Result: dist/src/assets/logo.png

src('./assets/*.png', { base: './src' })
  .dest('./dist')
  .exec();
// Result: dist/assets/logo.png
```

For example if you want to copy all files from `src` you should do the following

```js
task('default', async () => {
  await src('**/**.**', { base: 'src' })
    .dest('dist/')
    .exec();
});
```

## watch

Same as `src` above, the only difference is that it is a daemon so it will always run whenever a file in the captured globing changes.

## exec

You can manually launch execution of tasks

```js
task("default", () => {
    await exec("a", "b")
})
```

## bumpVersion

A handy function to bump package.json version

```js
const { bumpVersion, task } = require('fuse-box/sparky');
task('default', () => {
  bumpVersion('package.json', { type: 'patch' });
});
```

Read up on semver [here](https://semver.org/)

For example:

* `1.1.0` -> `{type : "patch"}` -> `1.1.1`
* `1.1.0` -> `{type : "minor"}` -> `1.2.0`
* `1.1.0` -> `{type : "major"}` -> `2.0.0`
* `1.1.0` -> `{type : "next"}` -> `1.1.0-next.1`
* `1.1.0-next.1` -> `{type : "next"}` -> `1.1.0-next.2`

## npmPublish

Publish to npm by calling `npmPublish`

```js
const { task, npmPublish } = require('fuse-box/sparky');
task('publish', async () => {
  await npmPublish({ path: 'dist' });
});
```

## tsc

A handy function if you want to transpile just files using TypeScript and/or generate `typings`.

> Note: TypeScript must be installed globally for this to work.

```js
const { task, tsc } = require('fuse-box/sparky');
task('tsc', async () => {
  await tsc('src', {
    target: 'esnext',
    declaration: true,
    outDir: 'dist/'
  });
});
```

## Dest

Copies files
`.dest("dist/")`

## File API

Capture 1 file

```js
src('files/**/**.*').file('bar.html', file => {});
```

Capture all html files (using simplified regexp)

```js
src('files/**/**.*').file('*.html', file => {});
```

### JSON

Modify

```js
file.json(json => {
  json.version++;
});
```

Override

```js
file.json(json => {
  return { a: 1 };
});
```

### Content

```
file.setContent(file.contents + "some content")
```

### Rename

You can use `rename` function to change the name of a file. Note that its necessary to use the `$name` substitution in order to use this.

```
Sparky
    .src("originalFilename.json")
    .file("*", file => file.rename("newFilename.json"))
    .dest("dist/$name");
```

### Saving

`file.save()` happens automatically on `dest` if not called, but you can override your original files
