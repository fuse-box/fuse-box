# HMR


`HMR` or Hot Module Replacement allows users to receive event on file change and update modules in memory (in browser)

note: HMR works ONLY with enabled cache

To enable HMR, simple add `hmr()` to your bundle chain

```js
const app = fuse.bundle("app")
    .instructions(`> app.tsx`)
    .hmr()
```

You can add `hmr()` options to all of your bundles, however only the first defined will actually receive an `HMRPlugin` (FuseBox injects it automatically). It's important when dealing with [vendor bundles](/page/bundle#creating-vendors)

`HMRPlugin()` is an internal plugin which is being injected by FuseBox [Producer](/page/bundle#producer). You will have  corresponding modules bundled along with your project. Make sure to disable it when doing production builds, for example with vendor:

```js
const vendor = fuse.bundle("vendor")
        .instructions(`~ **/**.{ts,tsx}`)
    if (!production) { vendor.hmr(); }
```

### Auto reload page
You can change the behaviour of HMR and reload the entire page (like browser sync) 
```js
.hmr({reload : true});
```

## Custom HMR

You can tell which files FuseBox needs to reload. In fact you implement the entire logic yourself. In order to do that, place `hmr.ts` somewhere in your project, and put these contents:

```js

const customizedHMRPlugin = {
    hmrUpdate: ({ type, path, content, dependants }) => { // Dependants only available when emitHMRDependencies = true
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
if (!window.hmrRegistered) {
    window.hmrRegistered = true;
    FuseBox.addPlugin(customizedHMRPlugin);
}
```

note: This is a RUNTIME plugin, don't attempt to add addPlugin to your configuration

Import that file in your entry point:

```js
if( process.env.NODE_ENV !== "production"){
    require("./hmr")
}
```

It's important to have it wrapped in `process.env.NODE_ENV` condition. Because you won't be needing this code in production, and [Quantum](/page/quantum) will remove that block using [dead code elimination](/page/quantum#dead-code-elimination)

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
In this configuration `port: 8080` corresponds to a socket server port, having `httpServer: false` makes it work only in `socket` mode.  Once page is loaded, `FuseBox API` will try to connect to `:8080` port an start listening to events.
