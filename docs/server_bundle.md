# Bundling for server

When it gets to making server bundles FuseBox can help you achive a super fast development process

## Default setup

Let's take a look at this example

```ts
const { fusebox } = require('fuse-box');
const fuse = fusebox({
  target: 'server',
  entry: 'src/index.ts',
  watch: true,
  cache: true,
});
fuse.runDev();
```

After executing this script, you will notice a `dist` folder with the following contents

```
_server_entry.js
app.js
dev.js
```

`_server_entry.js` is generated automatically which includes all bundles produced by FuseBox in the process, for
example:

```js
require('./dev.js');
require('./vendor.js');
require('./app.js');
```

## Starting the process

During the development FuseBox automatically launch and restart your process. So you can sit and enjoy developing
instead of configuring. However, if you wish to launch the process yourself, you should tell FuseBox to stop the
auto-start/restart:

Add the following field to the configuration:

```ts
autoStartServerEntry: false;
```

Now it's all yours!

## Bundling vendors

FuseBox manages bundles automatically and for the best performance all vendors are ignored.

However, in some cases you would want the vendors to be bundled. (For example when uploading to lamdba services). It's a
good idea to enable vendors and test how it all works during the development.

Let's reset the default settings:

```ts
dependencies: {
  ignoreAllExternal: false
},
```

Now you will see the following in your dist folder:

```
_server_entry.js
app.js
dev.js
vendor.js
```
