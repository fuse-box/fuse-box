# FuseBox - A Bundle that does it right

> The library is under heavy development. We are getting there. Documentation is coming soon.
> FuseBox beats any bundler/loader (webpack, jspm) by performance and convenience, and bundles any library on the Internet without additional configuration. So please, be be patient


```js
let fuseBox = new FuseBox({
    homeDir: "test/fixtures/cases/case1"
});
```

### Example
true/false - standalone
```js
fuseBox.bundle("[**/*.js]", true).then(content => {

})
```

## Using with virtual file structure
You can provide a virtual structure, in this case `homeDir` will be ignored, and a collection will be used. Due to the library node-glob limitations, FuseBox creates a corresponding structure in the file system (in .tmp) folder. It goes with absolutely the same approach as `homeDir` (it's just shifted)

You can use it to with gulp, or any other build systems, where files are ephemeral e.g streams.
```js
let fuseBox = new FuseBox({
    fileCollection: {
        "index.js": "require('./foo/bar.js')",
        "foo/bar.js": "require('../hello.js')",
        "hello.js": "",
    }
});
fuseBox.bundle("> index.js **/*.js", true).then(content => {
    fs.writeFileSync("./out.js", content);
})
```

### Cases


`> index.js [**/*.js]` - Bundle everything without dependencies, and execute index.js

`[**/*.js]` - Bundle everything without dependencies

`**/*.js` - Bundle everything with dependencies

`**/*.js -path` - Bundle everything with dependencies except for path
