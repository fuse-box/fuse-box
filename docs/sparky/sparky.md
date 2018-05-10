# Sparky

`Sparky` is a task runner much like `Gulp` or `Grunt`, but what sets it apart is that it is built on top of `FuseBox` technology. This means `Sparky` has the ability to use `FuseBox` plugins as well as the rest of the API to accomplish any build task you can throw at it. Out of the box, `Sparky` comes with a couple of helper functions for bumping the version number ([bumpVersion](#bumpversion)), running the TypeScript compiler ([tsc](#tsc)), publishing to npm ([npmPublish](#npmpublish)), and much more listed below.

## Benefits

* Simple, intuitive, and familiar API.
* Based on Promises. `ES2017 async/await` syntax fully supported.
* Ability to run tasks in parallel and sequentially (waterfall).
* Nothing to install, `Sparky` comes with every installation of `FuseBox`

## Usage

`Sparky` does not depend on a CLI or global installation, instead just create a javascript file to define your tasks. It is a common convention to name this file `fuse.js`, but the name doesn't matter. Run sparky from your command line by passing the filename and task name in as arguments like so

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

One of the great benefits in `Sparky` is `Context`. Context is an object that is shared between tasks that will be instantiated upon file execution.

Instantiating a class

```js
const { src, context, task } = require('fuse-box/sparky');

context(
  class {
    getConfig() {
      return FuseBox.init({
        homeDir: 'src',
        output: 'dist/$name.js',
        hash: this.isProduction
      });
    }
  }
);

task('default', context => {
  context.isProduction = true;
  const fuse = context.getConfig();
});
```

Passing in a function

```js
context(() => ({ isProduction: true }));
task('default', context => {
  // context.isProduction === true
});
```

Passing in a plain object

```js
context({ isProduction: true });
```

## Task

The first thing you have to do with `Sparky` is to define a Task. A Task takes two parameters, the task's name as a string and a function to be executed when that task runs.

```js
task('foo', () => {
  someSynchronousFunciton();
});
```

You can also use `ES2017` `async/await` syntax.

```js
task('foo', async () => {
  await someAsynchronousFunction();
});
```

To execute the task, run `node fuse.js foo`.

## Waterfall vs Parallel

`Sparky` has two modes for executing tasks, `waterfall` and `parallel`. In `waterfall` mode, tasks are executed sequentially based on the order they are defined within the task array. This is good if you require a task to wait until another task is completed. In `parallel` mode tasks are executed asynchronously, meaning that they will not depend on each other's completion. To run tasks in `waterfall` mode, just prefix the task name with an `&`.

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

// bar task will not run until foo task is done
task('waterfall', ['foo', 'bar'], () => {});

// foo and bar will run immediatly
task('parallel', ['&foo', '&bar'], () => {});
```

## Aggregator task

You can also define a task that combines other tasks but doesn't have any function itself.

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

## Help

You can use the `help` method to add a help message.   You can then run fuse-box with a single
`help` argument to get a list of available tasks and their associated help messages.

For example:

```
task('dev', /* the task implementation */).help("Run a development environment");
```

```
$ node fuse.js help

Usage
  node [TASK] [OPTIONS...]

Available tasks
  dev  Run a development environment
```

## src

This method lets `Sparky` know what files it needs to operate on. This funtionality is built on top of [glob](https://github.com/isaacs/node-glob).

```js
src('src/**/**.*');
```

The above will basically capture all files in your `src` folder.

If you want to capture all `.html` files in your `src` folder:

```js
src('src/**/*.html');
```

If you want to capture all images file formats:

```js
src('src/**/*.(jpg|png|gif)');
```

The `src` method also accepts a second parameter to inject some options.

### options.base

Sets the base path from which the path names will be resolved.

If we have an `asset` folder, and inside that, a file called `logo.png` we could copy that file to our `dist` folder like so:

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

If you want to copy all files from `src` you should do the following:

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

You can manually launch execution of tasks:

```js
task("default", () => {
  await exec("a", "b")
})
```

## bumpVersion

A handy function to bump package.json version:

```js
const { bumpVersion, task } = require('fuse-box/sparky');

task('default', () => {
  bumpVersion('package.json', { type: 'patch' });
});
```

Read up on semver [here](https://semver.org/).

For example:

* `1.1.0` -> `{type : "patch"}` -> `1.1.1`
* `1.1.0` -> `{type : "minor"}` -> `1.2.0`
* `1.1.0` -> `{type : "major"}` -> `2.0.0`
* `1.1.0` -> `{type : "next"}` -> `1.1.0-next.1`
* `1.1.0-next.1` -> `{type : "next"}` -> `1.1.0-next.2`

## npmPublish

Publish to npm by calling `npmPublish` and passing in the path to the directory you wish to publish:

```js
const { task, npmPublish } = require('fuse-box/sparky');

task('publish', async () => {
  await npmPublish({ path: 'dist' });
});
```

## tsc

> Note: TypeScript must be installed globally for this to work.

A handy function if you want to transpile just files using TypeScript and/or generate `typings`:

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

## dest

Set the output directory of a task operating on your project files:

```js
task('default', () => {
  src('**/**.**').dest('dist/');
});
```

## File API

Capture 1 file:

```js
src('files/**/**.*').file('bar.html', file => {});
```

Capture all html files:

```js
src('files/**/**.*').file('*.html', file => {});
```

### json

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

### setContent

```js
file.setContent(file.contents + 'some content');
```

### rename

You can use `rename` function to change the name of a file. Note that its necessary to use the `$name` substitution in order to use this.

```js
Sparky.src('originalFilename.json')
  .file('*', file => file.rename('newFilename.json'))
  .dest('dist/$name');
```

### save

`file.save()` happens automatically on `dest` if not called, but you can override your original files
