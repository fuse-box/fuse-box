---
id: development-with-docker
title: Development with Docker
---

There is a trick on how to make docker listen to file changes. Based on the
[issue](https://github.com/fuse-box/fuse-box/issues/1041)

## Configuring

Working task:

```js
task("start:dev", async ctx => {
  const fuseConfig = ctx.getConfig();

  fuseConfig
    .bundle("app")
    .instructions("> client.tsx")
    .watch()
    .hmr();

  fuseConfig.dev({
    port: 4444,
    httpServer: true,
    root: "public",
  });

  return await fuseConfig.run({
    chokidar: {
      usePolling: true,
    },
  });
});
```

docker-compose.yml:

```
version: "3"
services:
  gridplus-takehome-web:
    restart: always
    container_name: gridplus-takehome
    build:
      context: .
      dockerfile: ./Dockerfile.dev
    ports:
     - 4444:4444
    volumes:
     - .:/usr/app
```

For anyone else that uses bot docker and non-docker environments, here are the
task that I made so that I can still take advantage of non-polling environments:

```js
task("init:dev", async ctx => {
  const fuseConfig = ctx.getConfig();

  fuseConfig
    .bundle("app")
    .instructions("> client.tsx")
    .watch()
    .hmr();

  fuseConfig.dev({
    port: 4444,
    httpServer: true,
    root: "public",
  });
});

task("start:dev", ["init:dev"], async ctx => {
  const fuseConfig = ctx.getConfig();

  return await fuseConfig.run();
});

task("start-docker:dev", ["init:dev"], async ctx => {
  const fuseConfig = ctx.getConfig();

  return await fuseConfig.run({
    // https://github.com/paulmillr/chokidar
    chokidar: {
      persistent: true,

      ignored: "*.txt",
      ignoreInitial: false,
      followSymlinks: true,
      cwd: ".",
      disableGlobbing: false,

      usePolling: true,
      interval: 75,
      binaryInterval: 300,
      alwaysStat: false,
      depth: 99,
      awaitWriteFinish: false,

      ignorePermissionErrors: false,
      atomic: true,
    },
  });
});
```
