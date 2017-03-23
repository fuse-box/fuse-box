# Sparky

## Source

```
Sparky.src("files/**/**.*")
```

Grabs files using globs

## Dest

Copies files
`.dest("dist/")`

## File api

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