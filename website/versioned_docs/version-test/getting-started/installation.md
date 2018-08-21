---
id: version-test-installation
title: Installation
original_id: installation
---

## Add to project

You can install FuseBox from `npm`.

```
npm install fuse-box typescript uglify-es uglify-js --save-dev
```

You should install `uglify-es` and `uglify-js` too. FuseBox will decide which
one to use, dependending on a selected target.

## Why TypeScript

Why do you need to install typescript even if you don't use it?

Because FuseBox uses typescript to transpile node_modules to a required user
target. Read up [here](/page/getting-started#choosing-correct-target)

## Requirements

FuseBox will work on node.js 8.2+ because of `async` `await` usage. It's better
to take the advantage of the latest features - its much faster than polyfill. If
you are unable to upgrade your servers for some reason - no worries, we now have
`es6` dist for you.

```js
import { FuseBox } from "fuse-box/es6";
```
