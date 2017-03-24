# Sparky

Sparky is a Task-Runner like `Gulp` or `Grunt`, but what sets it apart is that it is built on top of `FuseBox` technology. This means that it takes benefit of the whole architecture behind, This includes an ability to use `FuseBox` plugins and many other things.

## benefits
* Unlike `gulp` Sparky utilizes `FuseBox` power, so you don't need to create tasks to transpile `TypeScript`, `FuseBox` will do that for you. instead use `Sparky to do common tasks like copying, moving, deleting files, etc.
* simple intuitive API.
* based on Promises, this means it is super fast and allows you to use `ES6` `async/await` syntax.
* Ability to run tasks in parallel and sequentially (waterfall).

## installation
This is one of the best parts about `Sparky` it comes built in `FuseBox` so if you install `FuseBox` this means you already have it.

# usage
`Sparky` does not require `CLI` or global installation. from your command line  just type `node fuse [task name]`. for example, say you have a task called build, you can simply run it using `node fuse build`.

# API

## Source

```
Sparky.src("files/**/**.*")
```

Grabs files using globs

## Dest

Copies files
`.dest("dist/")`

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