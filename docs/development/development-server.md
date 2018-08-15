---
id: development-server
title: Development server
---

## Setup

FuseBox utilises `express.js` to launch a web server. To create it, define
`fuse.dev` function right after your initialisation

```js
const fuse = FuseBox.init({
  homeDir: "src",
  output: "dist/$name.js",
});
fuse.dev(/* options here*/);
// Bundle configuration
fuse.run();
```

```
To avoid problems with HMR settings (bellow) set your development server config before you define further bundle configuration
```

## Served root

FuseBox will automatically serve your `build` folder e.g. with
`output: "build/$name.js"` it will serve the folder `build/`.

You can change it by passing in a string value to the `root` option (It can be
an absolute path, Or relative to [homeDir](/page/configuration#home-directory)

```js
fuse.dev({
  root: "public/build",
});
```

## Fallback

If you develop a SPA app you can set a fallback. All 404's will return the
fallback file you specify. The file path is relative to your served root.

```js
fuse.dev({
  root: "public/build",
  fallback: "index.html",
});
```

## Port

By default you will get `express` application running and a `socket` server (if
[HMR](#hot-module-reload) is enabled) bound to port `4444`. To change the port
provide `port` option.

```js
fuse.dev({
  port: 8080,
});
```

## Https

You can enable https by providing `https` options _(takes `https.ServerOptions`,
see
https://nodejs.org/api/https.html#https_https_createserver_options_requestlistener)_

```js
fuse.dev({
  https: {
    key: fs.readFileSync("./cert/app.key", "utf8"),
    cert: fs.readFileSync("./cert/app.crt", "utf8"),
  },
});
```

## Opening in browser

Specify `open` option to open the url in your default browser

```js
fuse.dev({
  open: true, // Boolean (false is default) | String: open specifc url like 'http://dev-server:8080'
  port: 8080,
});
```

note: You need opn package to be installed.

## Proxy

You can proxy requests from your localhost to any other server by adding an
option `proxy`

You need to install
[http-proxy-middleware](https://github.com/chimurai/http-proxy-middleware) in
order to do that:

```js
fuse.dev({
  proxy: {
    "/api": {
      target: "https://jsonplaceholder.typicode.com",
      changeOrigin: true,
      pathRewrite: {
        "^/api": "/",
      },
    },
  },
});
```

Whereas key is a path and options are passed directly to
[http-proxy-middleware](https://github.com/chimurai/http-proxy-middleware)
module

note: run "npm install http-proxy-middleware"

## Express application access

You can access `express()` application once initialised like so:

```js
fuse.dev({ root: false }, server => {
  const dist = path.resolve("./dist");
  const app = server.httpServer.app;
  app.use("/static/", express.static(path.join(dist, "static")));
  app.get("*", function(req, res) {
    res.sendFile(path.join(dist, "index.html"));
  });
});
```

The example above will server static files under the current build folder. To
make sure FuseBox does not automatically add routes for you, set
`{root : false}`

## Send events

You can send events from your `fuse.js` to the application by calling:

```
// for the whole page reload
fuse.sendPageReload()

// for the HMR event
fuse.sendPageHMR();
```

You can check the functionality in
[this](https://github.com/fuse-box/fuse-box-examples/tree/master/examples/manual-page-reload)
example

```js
task("default", ["clean"], async context => {
  const fuse = context.getConfig();
  fuse.dev();

  setInterval(() => {
    fuse.sendPageReload(); // will reload every second
  }, 1000);

  context.createBundle(fuse);
  await fuse.run();
});
```
