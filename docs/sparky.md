# Sparky

Sparky is a Task-Runner like `Gulp` or `Grunt`, but what sets it apart is that it is built on top of `FuseBox` technology. This means that it takes benefit of the whole architecture behind, This includes an ability to use `FuseBox` plugins and many other things.

## Benefits

steps:
    * Unlike `gulp` Sparky utilizes `FuseBox` power, for example, you don't need to create tasks to transpile `TypeScript`, `FuseBox` will do that for you. instead use `Sparky` to do common tasks like copying, moving, deleting files, etc. Of course, that does not prevent you from doing that if you don't want to utilize `FuseBox` awesomeness.
    * Simple intuitive API.
    * Based on Promises, this means it is super fast and allows you to use `ES2017` `async/await` syntax.
    * Ability to run tasks in parallel and sequentially (waterfall).

## Installation
This is one of the best parts about `Sparky`, it comes built in `FuseBox` so if you install `FuseBox` this means you already have it.

# Usage
`Sparky` does not require `CLI` or global installation. just create a file called `fuse.js` in your app root (it does not have to be called `fuse.js`, you can name it anything and put it anywhere, it is just a `JavaScript` file), then from your command line just type `node fuse [task name]`. for example, say you have a task called build, you can simply run it using `node fuse build`.

`c:/myProject/fuse.js`
```js
const { Sparky } = require("fsbx");

Sparky.task("foo", () => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            return resolve();
        }, 1000)
    });
});
```
To run the above do `node fuse foo`

# API

## Task
First thing you have to do with `Sparky` is to define a Task, A Task takes two parameters, Task's name and a Function.
```js
Sparky.task("foo", () => {
});
```
The Function returns a promise
```js
Sparky.task("foo", () => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            return resolve();
        }, 1000)
    });
});
```
You can also use `ES2017` `async/await` syntax.
```js
Sparky.task("foo", async () => {
    return await someAsynchronousFunction();
});
```
to execute the task, run `node fuse foo` and enjoy :)

## Execution-flow
`Sparky` has two modes for executing tasks, `waterfall` and `parallel`. in `waterfall` mode, tasks are executed sequentially based on the order they are defined. This is good if you require a task to wait until another task is completed. In `parallel` mode tasks are executed asynchronously, meaning they will not depend on each other's completion.

```js
Sparky.task("foo", () => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            return resolve();
        }, 1000)
    });
});

Sparky.task("bar", () => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            return resolve();
        }, 1000)
    });
});

// bar task wont run until foo task is done
Sparky.task("waterfall", ["foo", "bar"], () => {

});

// foo and bar will run immediatly
Sparky.task("parallel", ["&foo", "&bar"], () => {

});
```

## Source
This method tells `Sparky` what files it needs to operate on.
 ```js
 Sparky.src("src/**/**.*")
 ```
The above will basically capture all files in your `src` folder.

Say you want to capture all `HTML` files in your `src` folder, do the following:
 ```js
 Sparky.src("src/**/*.html")
 ```
or you want to capture all images file formats
 ```js
 Sparky.src("src/**/*.(jpg|png|gif))")
 ```

Source method also accepts a second parameter to inject some options:

### options.base

Sets the base path from which the path names will be resolved.

For example: If we have an `asset` folder, and inside that, a file called `logo.png`...

```js
Sparky.src("./src/assets/*.png").dest('./dist')
// Result: dist/src/assets/logo.png

Sparky.src("./assets/*.png", { base: './src' }).dest('./dist')
// Result: dist/assets/logo.png
```

## watch
Same as `source` above, the only difference is that it is a daemon so it will always run whenever a file in the captured globing changes.
## Dest

Copies files
`.dest("dist/")`


## Launching tasks manually

You can launch a task manually:

```js
Sparky.task("bar", () => {})
Sparky.start("bar")
```
## File API

Capture 1 file
```
Sparky.src("files/**/**.*").file("bar.html", file => {
   
})
```

Capture all html files (using simplified regexp)
```
Sparky.src("files/**/**.*").file("*.html", file => {
   
})
```

### JSON

Modify
```
 file.json(json => {
    json.version++
})
```

Override

```
 file.json(json => {
    return { a : 1}
})
```

### Content

```
file.setContent(file.contents + "some content")
```

### Saving

`file.save()` happens automatically on `dest` if not called, but you can override your original files
