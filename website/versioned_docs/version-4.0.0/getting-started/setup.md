---
id: version-4.0.0-setup
title: Getting started
original_id: setup
---

## Core Concepts

FuseBox is highly configurable, but also starts with smart defaults. This gives it a great learning curve; easy at first
while great for super users. Here are a few conceptual highlights to understand:

- `fuse.ts` - There is always a main configuration script typically called `fuse.ts` or `fuse.js`. To see the full
  extent of configuration, [click here](../development/full-config).

- `.cache/` - This is where all of the caching is stored. **If anything ever goes wrong, try deleting this folder.**

- `tsconfig.json` - Optionally, the `tsconfig.json` file is also sourced for
  [some parts of configuration](../development/monorepo).

- bundles and/or the "dist" folder - By default, everything is bundled into a `/dist` folder. Optionally, you can
  [specify any bundle names or logic you want.](../development/bundling)

- css/sass/less - By default, imports of stylesheet files in your code will be automatically caught and (for sass or
  less) transpiled before being added to the bundle. You can read more about that [here](../development/stylesheet)

- svg/img/other assets - By default, imports of common asset types will result in the file being copied over to the dist
  folder.

- dev vs production builds - During development, fuse-box aims to be very, very fast. But for production builds fuse-box
  runs much slower and utilizes a lot of RAM to create hyper-dense bundles instead.

---

## Making Your First Bundle

_Prerequisites: You must have nodejs and npm installed on your device with an "npm init" project_

**Step 1. Install Fuse-Box**

To begin, install fuse-box and it's required dependencies:

```bash
npm install fuse-box --save-dev
```

<!-- TODO:  Can the order of this be changed to put "fuse-box" first? -->

TEMPORARY EDIT: For those wanting to use 4.0, install `npm i fuse-box@next --save-dev` instead

**Step 2. Create fuse file**

Create a `fuse.ts` or `fuse.js` file (whichever makes you comfortable) at the root of your project. Add the following
contents to your fuse file:

```ts
import { fusebox } from 'fuse-box';
const fuse = fusebox({
  entry: 'src/index.ts',
  target: 'browser',
  devServer: true,
  webIndex: true,
});

fuse.runDev();
```

_What do these configs do?_

- `entry` - defines the main root file of your project
- `devServer` - runs a local live server for viewing your site as you update the codebase
- `webIndex` - creates a default index.html file (this can be a supplied file as well)
- `target` - chooses a target type (ie browser, server, electron)
- `fuse.runDev()` - starts fuse bundling in "dev mode," which emphasizes bundling speed over bundling density

<!-- TODO: - You can see much more details on configuration in ADD LINK -->

**Step 3. Create your entry file**

Create a `src/index.ts` or `src/index.js` file to act as your main project entry point. If you intend to use a
framework, this is where you will later tell your framework to add content to the page. But for simplicity's sake, just
copy the following:

```js
document.addEventListener('DOMContentLoaded', () => {
  document.body.innerHTML += `
		A random number: ${Math.random()}<br>
		(refresh to update)
	`;
});
```

**Step 4. Run your project**

If you chose `fuse.js` (javascript) as your fuse file:

1. simply run `node fuse.js` to start your project

If you chose `fuse.ts` (typescript) as your fuse file:

1. first install ts-node (`npm i ts-node --save-dev`)
2. then run `./node_modules/.bin/ts-node fuse.ts`

This should start a local web server which you can open in your browser. Try messing with the innerHTML of document.body
to see how quickly it updates.

---

## Making Your First Bundle More Interesting

The minimal project above is taking advantage of as many defaults as possible. One of these defaults is the `index.html`
file that anchors your project. There's a good chance you'll want to use something other than the default for this, so
follow these steps to get it setup:

**Step 1. Specify the index.html in your fuse file**

You must tell fuse where to find your index.html file. Modify your functioning fuse file (from above) to include a
webIndex prop.

```ts
const fuse = fusebox({
  // full config ommitted...
  webIndex: {
    template: 'src/index.html',
  },
});
```

To read more about webIndex [click here](../development/webIndex)

**Step 2. Create the index.html**

Create a `src/index.html` file with the following contents:

```html
<!DOCTYPE html>
<html>
  <head>
    <title></title>
    $css
  </head>

  <body>
    <div id="root"></div>
    $bundles
  </body>
</html>
```

**_What are $css and $bundles?_** These two keywords are used for templating. After fuse has bundled together all of the
styling and and scripting, it will inject the links toward these bundle files in `$css` for styles and `$bundles` for
scripts.

---

## **Recommended Reading**

1. To see the entire configuration set for FuseBox, [click here](../development/full-config).

2. To get an overview of the various plugins which FuseBox has, [click here](../plugins/about).

---

## Example Projects

Try [react-example](https://github.com/fuse-box/react-example)

---

## Other Important Introductory Configs

### **Targets**

```ts
fusebox({
  // full config ommitted...
  target: 'browser',
});
```

Possible values are: `browser`, `server`, `electron`;

FuseBox behaves differently when processing modules using those targets. For `example` a `server` target won't touch
`process` variables, as opposed to `browser` target, where it's being polyfilled.

### **Dependencies**

It's possible to ignore/include/ignore all dependencies in your bundle.

When target is set to `server` FuseBox toggle `ignoreAllExternal` mode automatically, since that's a recommended way of
bundling server (at least for development). You can tweak it like so:

```ts
fusebox({
  // full config ommitted...
  target: 'server',
  dependencies: {
    ignoreAllExternal: isProduction,
  },
});
```

In most cases that should be fine. However, FuseBox won't be able to bundle native modules, you can ignore them by using
`ignorePackages` field

```ts
fusebox({
  // full config ommitted...
  target: 'server',
  dependencies: {
    ignoreAllExternal: true,
    ignorePackages: ['some-package'],
  },
});
```

You can also include packages or modules by using `include` field:

```ts
fusebox({
  // full config ommitted...
  target: 'server',
  dependencies: {
    include: ['tslib', './someModuleRelativeToTheEntry'],
  },
});
```

`include` works relatively to the entry point, In fact all the strings are being resolved as a dependency of your entry
point. You can add modules there too.

### **Caching**

```ts
fusebox({
  // full config ommitted...
  cache: false,
});
```

Caching in FuseBox is enabled automatically.

Default cache folder is located under `node_modules/.fusebox`.

`runProd()` disable caching automatically since we shouldn't use caching for production builds. More information about
caching is [here](../development/cache)
