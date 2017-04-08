# Dev Server and HMR

If you wish to run a development server you need to setup it before defining your bundles

```js
const fuse = FuseBox.init({
    homeDir : "src",
    output : "dist/$name.js"
});

fuse.dev(/* options here*/)

// the rest of the code
```

### Changing the served folder
FuseBox will automatically serve your `build` folder e.g. with `outFile: "build/out.js"` it will serve the folder `build/`.

You can change it by passing in a string value to the `root` option (It can be an absolute path, Or relative to `appRootPath`):

```js
fuse.dev({
    root: 'public/build',
})
```

### Changing the port
By default you will get `express` application running and a `socket` server bound to port `4444`. To change the port provide `port` option.

```js
fuse.dev({
    port : 8080
})
```


## Custom socket URI
You can customize the URI if required.

```js
fuse.dev({
   socketURI: "wss://localhost:3333",
})
```

## Express api
Access express application like so:
```js
fuse.dev({ root: false }, server => {
    const app = server.httpServer.app;
    app.use("/static/", express.static(path.resolve('./dist/static')));
    app.get("*", function(req, res) {
        res.sendFile(path.join(dist, "index.html"));
    });
})
```

## Integrate with existing app

If you have an existing http application (java, python, nodejs - it does not matter), you can easily integrate fusebox with it.
```js
fuse.dev({
   port: 8080,
   httpServer: false,
})
```
In this configuration `port: 8080` corresponds to a socket server port, having `httpServer: false` makes it work only in `socket` mode.  Once you page it loaded, `FuseBox API` will try to connect to `:8080` port an start listening to events.

See the [fuse-box-express-example](https://github.com/fuse-box/fuse-box-express-seed) for a more detailed setup.
