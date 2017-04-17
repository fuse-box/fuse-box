# Code splitting

Code Splitting is required if you want to make your "home" bundle as lightweight as possible. A framework must set up accordingly. FuseBox offers a great functionality to loading split bundles with just a few lines of code.

Splitting is universal, meaning that you can lazy load them on server too.

## Basics

Code splitting in FuseBox is very simple, however before we dive into examples let's clear out some basics.

steps:
    * Master Bundle
    Code splitting happens on a master bundle, so techincally you have only 1 bundle that is going to be split. All split bundles will be generated automatically
    * Configuration is shared
    Split bundles fully depend on a master bundle. They cannot be customised or decorated with additional configuration as they are "branched out"
    * Files piping
    Files are piped out from a master bundle. All external dependencies will be skipped.
    * Information on your bundles
    THe information on your bundles is stored in a master bundle. FuseBox builds a manifest file which could accessed alternatively, however your master bundle WILL know how to resolve them by name without having an extra hustle.

FuseBox does as much as possible to automate the process.

## Setting it up

Let's imagine a project

files:
node_modules
 placeholder.js
src
 app.tsx
 helper.ts
 routes
  about
   AboutHelper.tsx
   AboutComponent.tsx
  contact
   Foo.ts
   Bar.ts
   ContactComponent.tsx


### How we set it up?

steps:
 * Entry point
 We have an application that is pointed to app.tsx
 * Isolate routes
 We isolate our routes, meaning that we can't have any require statements / imports in our main application (app.tsx or its modules). That would defeat the purpose of code splitting. 
 * Cross reference and Shared Scope
 Split bundle CAN reference other modules e.g Helper.ts. The scope is shared and accessible throughout the entire application
 * Master bundle
 Our master bundle should consume split targets in the arithmetic instructions
 
## Instructions

Instructions for code splittings need to be set up to consume split targets, otherwise no plugins will be applied. As mentioned earlier split bundles are taken out entirely from a master bundle, therefore the functionality is limited.

```js
const app = fuse.bundle("app")
    .split("routes/about/**", "about > routes/about/AboutComponent.tsx")
    .split("routes/contact/**", "contact > routes/contact/ContactComponent.tsx")
    .instructions(`> [app.tsx] + [routes/**/**.{ts, tsx}]`)
```

Make sure that your application has no references to the split bundles whatsoever, and modify your instructions to consume them.

```js
.instructions(`> [app.tsx] + [routes/**/**.{ts, tsx}]`)
```

## Split
Once instructions are set and verified, we can define a split config.

```js
split("routes/about/**", "about > routes/about/AboutComponent.tsx")
```
### First Argument: Path matching

First argument `"routes/about/**"` is a simplified RegExp. Each time FuseBox processes files it tests the path against the defined RegExp. These paths have no relation to physical paths, and they all belong to `homeDir` without an opening slash.

Let's break down the logic:

steps:
 * FuseBox tests `app.ts` 
   It does not match any of defined split configs. Simply because `routes\/about/.*?` does not match `app\.ts`
 * FuseBox tests `helper.ts`
   Same result: `routes\/about/.*?` does not match `helper\.ts`
 * FuseBox test `routes/about/AboutHelper.tsx`
   Success, now FuseBox knows that this module needs to be stripped from the main bundle and piped out to a different one
 * Tests continues
   It continues until all files are processed.

FuseBox caches your modules aggressively, and you don't need to worry about performance. It will be stil working at the speed of light.

### Second Argument: Split instructions

Now FuseBox knows which files belong no longer to the master bundle,  let us read instructions:

```
about > routes/about/AboutComponent.tsx
```

`about` in a split bundle name, it's processed through the `output` and respects hashing. For example, having `output : "dist/$name.js"` will result in file `dist/about.js`. Now a tricky part.  Each split bundle may have many files included. 

files:
routes
 about
 AboutHelper.tsx
 AboutComponent.tsx

FuseBox matched 2 of them - `AboutHelper.tsx` and `AboutComponent.tsx`. Which module should be executed once the bundle is lazy loaded? Exactly!

The second part with `>` stands for an entry point, which aligns with FuseBox arithmetics. It is an entry point. One you lazy load, your bundle will have the exports of `AboutComponent.tsx`

## Configuring

You may need to configure how FuseBox resolves your bundles.

`browser` key will help FuseBox to resolve your bundles in browser, and `server` on server accordingly. 
`dest` customises the output, but it's consistent with our `output` configuration:

```js
const fuse = FuseBox.init({
  homeDir: "src",
  output: "dist/$name.js",
})

fuse.bundle("app")
    .splitConfig({ browser: "/static/bundles/", server : "dist/static/bundles/", dest: "bundles/" })
    .split("routes/about/**", "about > routes/about/AboutComponent.tsx")
    .split("routes/contact/**", "contact > routes/contact/ContactComponent.tsx")
    .instructions(`> [app.tsx] + [routes/**/**.{ts, tsx}]`)

fuse.run()
```

With the setup above, we will have:

files:
dist
 bundles
  about.js
  contact.js
 app.js
src
 app.tsx
 helper.ts
 routes
  about
   AboutHelper.tsx
   AboutComponent.tsx
  contact
   Foo.ts
   Bar.ts
   ContactComponent.tsx

## Lazy load

And finally we can lazy load from out master bundle. To make your life easier FuseBox offers a great tool for resolving named bundles.

```js
import { lazyLoad } from "fuse-tools";
lazyLoad("about").then(module => {
  // routes/about/AboutComponent.tsx has arrived
})
```

## Example

See a fully working react application with code splitting [here](https://github.com/fuse-box/fuse-box-examples/tree/master/examples/react-code-splitting)

```
git clone git@github.com:fuse-box/fuse-box-examples.git
npm install
cd examples/react-code-splitting
node fuse.js
```



