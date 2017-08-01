# Development flow

FuseBox offers a very convenient fully customisable development server and a Hot Module Reload module, which is flexible and can support any project needs

## Development Server

FuseBox utilises `express.js` to launch a web server. To create it, define `fuse.dev` function right after your initilisation

```js
const fuse = FuseBox.init({
    homeDir : "src",
    output : "dist/$name.js"
});
fuse.dev(/* options here*/)
// Bundle configuration
fuse.run()
```

note: To avoid problems with HMR settings (bellow) set your development server config before you define further bundle configuration

## Served root

FuseBox will automatically serve your `build` folder e.g. with `output: "build/$name.js"` it will serve the folder `build/`.

You can change it by passing in a string value to the `root` option (It can be an absolute path, 
Or relative to [homeDir](/page/configuration#home-directory)

```js
fuse.dev({
    root: 'public/build',
})
```

## Port
By default you will get `express` application running and a `socket` server (if [HMR](#hot-module-reload) is enabled) bound to port `4444`. To change the port provide `port` option.

```js
fuse.dev({
    port : 8080
})
```


## Opening in browser

Specify `open` option to open the url in your default browser


```js
fuse.dev({
    open : true
    port : 8080
})
```
note: You need opn package to be installed.

## Proxy

You can proxy requests from your localhost to any other server by adding an option `proxy`

You need to install [http-proxy-middleware](https://github.com/chimurai/http-proxy-middleware) in order to do that:

```js
fuse.dev({
    proxy: {
        '/api': {
            target: 'https://jsonplaceholder.typicode.com', 
            changeOrigin: true,
            pathRewrite: {
                '^/api': '/', 
            },
        }
    }
});
```

Whereas key is a path and options are passed directly to [http-proxy-middleware](https://github.com/chimurai/http-proxy-middleware) module

note: run "npm install http-proxy-middleware"


## Express application access

You can access `express()` application once initialised like so:

```js
fuse.dev({ root: false }, server => {
    const dist = path.resolve("./dist");
    const app = server.httpServer.app;
    app.use("/static/", express.static(path.join(dist, 'static')));
    app.get("*", function(req, res) {
        res.sendFile(path.join(dist, "index.html"));
    });
})
```

The example above will server static files under the current build folder. To make sure FuseBox does not automatically add routes for you, set `{root : false}`


## Watching for changes

FuseBox can automatically re-bundle your bundles on file change. FuseBox Producer makes sure that only 1 wather is bound (chokidar).

```js
const app = fuse.bundle("app")
    .instructions(`> app.tsx`)
    .watch()
```

`watch()` accepts a simplified regex (if you want to customise watched folder). Let's watch server and client bundle at the same time.

```js
fuse.bundle("client/app")
    .instructions(`> app.tsx`)
    .watch("client/**")

fuse.bundle("server/app")
    .instructions(`> index.ts`)
    .watch("server/**")
```

In this example whenever a change happen in `homeDir` FuseBox will figure out which bundle requires re-triggering. It's implemented in order to save up your resources as physically only 1 watcher is defined.

A typical configuration for production builds would look like:

```js
if (!production) { app.hmr().watch() }
```
### Chokidar options

Additionally, you can provide [chokidar](https://github.com/paulmillr/chokidar) options to producers' `run()` 

```js
fuse.run({chokidar : {ignored: /(^|[\/\\])\../} })
```

## Hot Module Reload

`HMR` or Hot Module Reload, allows users to receive event on file change and update modules in memory (in browser)

note: HMR works ONLY with enabled cache

To enable HMR, simple add `hmr()` to your bundle chain

```js
const app = fuse.bundle("app")
    .instructions(`> app.tsx`)
    .hmr()
```

You can add `hmr()` options to all of your bundles, however only the first defined will actually recevie an `HMRPlugin` (FuseBox injects it automatically). It's important when dealing with [vendor bundles](/page/bundle#creating-vendors)

`HMRPlugin()` is an internal plugin which is being injected by FuseBox [Producer](/page/bundle#producer). You will have  corresponding modules bundled along with your project. Make sure to disable it when doing production builds, for example with vendor:

```js
const vendor = fuse.bundle("vendor")
        .instructions(`~ **/**.{ts,tsx}`)
    if (!production) { vendor.hmr(); }
```

## Custom HMR

You can tell which files FuseBox needs to reload. In fact you implement the entire logic yourself. In order to do that, place `hmr.ts` somewhere in your project, and put these contents:

```js

const customizedHMRPlugin = {
    hmrUpdate: ({ type, path, content }) => {
        if (type === "js") {
            FuseBox.flush();
            FuseBox.dynamic(path, content);
            if (FuseBox.mainFile) {
                FuseBox.import(FuseBox.mainFile)
            }
            return true;
        }
    }
}

let alreadyRegistered = false;
if (!process.env.hmrRegistered) {
    process.env.hmrRegistered = false;
    FuseBox.addPlugin(customizedHMRPlugin);
}
```

note: This a RUNTIME plugin, don't attempt on adding addPlugin to your configuration

Import that file in your entry point:

```js
import "./hmr"
// code below
```
| Name  | Description |
| ------------- | ------------- |
| ` FuseBox.flush() ` | Removes files from memory  |
| ` FuseBox.dynamic(path, content) `  | Registers a new module dynamically |
| ` FuseBox.import(FuseBox.mainFile) `| Imports an entry point|


You can flush files selectively by providing a callback to the `flush` function

```js
FuseBox.flush(file => {
    if( /store/.test(file)){
        return false;
    }
    return true;
})
```

## Custom socket URI
Sometimes, especially when dealing with `HTTPS` on a localhost, it is required to modify the socket URI to work with `ws` instead of `wss://`

```js
fuse.dev({
   socketURI: "ws://localhost:3333",
})
```

## Existing server

If you have an existing http application (java, python, nodejs - it does not matter), you can easily integrate `HMR` with it.
```js
fuse.dev({
   port: 8080,
   httpServer: false,
})
```
In this configuration `port: 8080` corresponds to a socket server port, having `httpServer: false` makes it work only in `socket` mode.  Once you page it loaded, `FuseBox API` will try to connect to `:8080` port an start listening to events.


