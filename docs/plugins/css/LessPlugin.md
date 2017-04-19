
# Less Plugin

## Description
Handles Less

## Install

Install [less](http://lesscss.org/) first.

```bash
yarn add less --dev
npm install less --save-dev
```

The less plugin generates CSS, and must be chained prior to the CSSPlugin to be used:

```js
plugins:[
  [LESSPlugin(), CSSPlugin()],
],
```

note: Sourcemaps are not yet properly handled.  Development is ongoing on this feature