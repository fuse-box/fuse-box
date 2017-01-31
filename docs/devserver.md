# Dev Server and HMR

Run a development server all you need is to change `bundle` to `devServer`


## Launch express and socket 
```
FuseBox.init({
    homeDir: "src",
    outFile : "build/out.js",
}).devServer(">index.ts")
```

You don't need to specify any parameters if you don't like. FuseBox will automatically serve your `build` folder, which is `build/` (in the case above)

You will get `express` application running and a `socket` server bound to the same port. To change the port provide `port` option.

```
devServer(">index.ts", {
   port : 8081
})
```

## Express api

Access express application like so:
```
const self = devServer(">index.ts", {
   port : 8081
})
self.httpServer.app.use(/* your middleware */)
```

You can set `root` to false if you want to manually configure the root path

```
const self = devServer(">index.ts", {
   port : 8081,
   root : false
})
self.httpServer.serveStatic("*", "build/static")
```

`serveStatic` is convenience method, that looks like this:

```
this.app.use(userPath, express.static(ensureUserPath(userFolder)));
```

## Custom emitter

You can manually sent events on file change like so:

```js
fuseBox.devServer(">index.ts", {
    emitter: (self, fileInfo) => {
        self.socketServer.send("source-changed", fileInfo);
    }
});
```

## Intergate with existing app

If you have an existing http application (java, python, nodejs - it does not matter), you can easiliy intergate fusebox with it.
```
fuse.devServer(">app.tsx", {
    port: 8080, 
    httpServer: false
})
```
In this configuration `port: 8080` corresponds to a socket server port, having `httpServer:false` makes it work only in `socket` mode.  Once you page it loaded, `FuseBox API` will try to connect to `:8080` port an start listening to events.




