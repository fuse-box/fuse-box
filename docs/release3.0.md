# FuseBox 3.0 - faster than ever

FuseBox 3.0 has been finally released, it’s 20% faster and lighter. Did you know
that it takes 50–100ms to re-bundle a heavy project?

Let’s break it down and see what are the new features.

## Code splitting without configuration

It’s finally here. No magical comments, no configs. FuseBox builds a dependency
tree automatically and generates according bundles. You can split a package for
example just by defining a dynamic import.

```js
await import("moment");
```

Isn’t that great? Moreover, FuseBox does what none of the bundlers can — you can
publish a typescript source and once the latter one installed, FuseBox will make
a split it automatically (if defined). Say, you are relying on a library but you
know that it’s heavy, so you could publish a source that contains dynamic
imports. It will be split without user even knowing it. Check the example here

And most certainly, you are able to create split bundles that contain project
files

```js
import("./components/AboutComponent");
```

FuseBox will traverse the tree and detect which files and packages belong only
to that split package. Shared packages will not be bundled and stay within the
master bundle.

## Updated task runner

Our task runner “Sparky” has been greatly simplified, we’ve added new helpers
like npmPublish and some others, to help you deal with your everyday tasks.

It looks much nicer, and finally each task can receive a context

Context function accepts classes, functions and objects and passed into each
task.

# Typescript packages

Now you can publish a typescript package to npm!

```js
{
   "ts:main" : "index.ts",
   "main" : "index.js"
}
```

Just modify package.json and off you go. If you are planning to use with FuseBox
you can set main option to point to a typescript file. And again — no
configuration required.

The actual benefits are:

You are in control of script targets. Tree shaking will work 100% No brainer
with typings (you don’t need to generate ones) You can use async await syntax to
split packages within an NPM library! (unique FuseBox feature) Speed and
stability improvements FuseBox is now 20–30% faster thanks to the latest NodeJS.
We’ve refactored the code to use async await instead of Promises.

For those who aren’t ready to switch to the latest NodeJS, there is a bundle
with es6 target that you can use

import { FuseBox } from “fuse-box/es6

## Brand new website

And finally we have a fresh new look

If you like the project, don’t forget to star the github repository, and follow
us on twitter

Stay fused.
