---
id: version-4.0.0-devServer
title: DevServer
original_id: devServer
---

## Configuring port

Configure port by adding a `port` field. This port will be used by default to open an HMR server too.

```ts
fusebox({
  port: 3333,
});
```

Default port in FuseBox is `4444` it will be used if your devServer property is simply set to `true`

## Opening default browser

You can open set `open` field if you want to launch your default browser window when FuseBox has finished bundling

```ts
fusebox({
  devServer: {
    open: true,
  },
});
```

## Configuring proxy

Proxy is a very common requirement during the development process. You can configure it by adding a `proxy` field as
follows below:

```ts
fusebox({
  devServer: {
    proxy: [
      {
        path: '/my-path',
        options: {
          target: 'http://localhost:7865',
          changeOrigin: true,
          followRedirects: true,
        },
      },
      {
        path: '/other-path',
        options: {
          target: 'http://localhost:8888',
          changeOrigin: true,
          followRedirects: true,
        },
      },
    ],
  },
});
```

## Individual ports for HMR and server

You can set different ports for HMR **and/or** for devServer in the example below:

```ts
fusebox({
  devServer: {
    httpServer: { port: 3000 },
    hmrServer: { port: 3001 },
  },
});
```

---

## Development server access

There are a few properties that should help you tweaking the server

### Fallback (for single page apps)

Set `fallback` if you want to customize a fallback file (default to `index.html`). If a path is not found, the url will
fallback to this file.

```ts
fusebox({
  devServer: {
    httpServer: {
      fallback: 'index2.html',
    },
  },
});
```

### Express

FuseBox uses Express to host the dev server. You can access the `Express.Application` by providing a callback.

```ts
fusebox({
  devServer: {
    httpServer: {
      express: (app, express) => {
        // example on how you can set something completely custom
        app.use('/assets/', express.static(path.join(__dirname, 'dist/assets')));
      },
    },
  },
});
```

`express` callback gives you an `application` itself where you can override any paths except for `/__ftl`. The second
argument is `express` itself. You can [learn more about express here](https://expressjs.com/en/5x/api.html#app).

---

## HMR server settings

Besides the-above-mentioned `port` you can set the following parameters:

### connectionURL

Set this to completely override the way FuseBox connects to the server on the client side

Note that this string must start with `ws://` or `wss://`

```ts
fusebox({
  devServer: {
    hmrServer: {
      connectionURL: 'wss://fancy-socket.com',
    },
  },
});
```

### useCurrentURL

This property is enabled **by default** if the http port is the same as the HMR's. That means that FuseBox will try to
connect to the same domain and the same port as it was read from the `navigator` object

```ts
fusebox({
  devServer: {
    hmrServer: {
      useCurrentURL: true,
    },
  },
});
```
