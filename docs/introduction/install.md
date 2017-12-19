# Installation

## Add to project
You can install FuseBox from `npm`.

```
npm install fuse-box typescript --save-dev
```

You should install `uglify-es` and `uglify-js` too. FuseBox will decide which one to use, dependending on a selected target.

## Requirements

FuseBox will work on node.js 8.2+ because of `async` `await` usage. It's better to take the advantage of the latest features - its much faster than then polyfill. If you are unable to upgrade your servers for some reason - no worries, we now have `es6` dist for you.

```js
import { FuseBox } from "fuse-box/es6"
```
