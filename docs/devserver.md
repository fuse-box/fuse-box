# Dev Server and HMR

To run a development server all you need is to change `bundle` to `devServer`

## Launch express and socket 
```js
FuseBox.init({
    homeDir: "src",
    outFile: "build/out.js",
}).devServer(">index.ts");
```
the `devServer` function takes an *optional* options parameter as a second argument.

### Changing the served folder
FuseBox will automatically serve your `build` folder e.g. with `outFile : "build/out.js"` it will serve the folder `build/`.

You can change it by passing in a string value to the `root` option (It can be an absolute path, Or relative to `appRootPath`): 

```js
devServer(">index.ts", {
   root: 'public/build'
});
```

### Changing the port
By default you will get `express` application running and a `socket` server bound to port `4444`. To change the port provide `port` option.

```js
devServer(">index.ts", {
   port: 8081
});
```

## Disable HMR
If you not into Hot Reload, you can disable it:


```js
devServer(">index.ts", {
   hmr : false
});
```

## Custom socket URI
You can customize the URI if required.

```js
devServer(">index.ts", {
   socketURI : "wss://localhost:3333" 
});
```

## Express api
Access express application like so:
```js
const self = devServer(">index.ts", {
   port: 8081
});
self.httpServer.app.use(/* your middleware */);
```

You can set `root` to false if you want to manually configure the root path

```js
const self = devServer(">index.ts", {
   port: 8081,
   root: false
});
self.httpServer.serveStatic("*", "build/static");
```

`serveStatic` is convenience method, that looks like this:

```js
this.app.use(userPath, express.static(ensureUserPath(userFolder)));
```

You can also create an SPA server which fallbacks to index.html
```js
var express = require('express');
var path = require('path')
var server = devServer('>index.js', {
    port: 8081,
});
server.httpServer.app.use(express.static(path.join('build','static')));
server.httpServer.app.get('*', function(req, res) {
    res.sendFile(path.join('build', 'index.html'));
});
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

## Integrate with existing app

If you have an existing http application (java, python, nodejs - it does not matter), you can easily integrate fusebox with it.
```js
fuse.devServer(">app.tsx", {
    port: 8080, 
    httpServer: false
});
```
In this configuration `port: 8080` corresponds to a socket server port, having `httpServer:false` makes it work only in `socket` mode.  Once you page it loaded, `FuseBox API` will try to connect to `:8080` port an start listening to events.
