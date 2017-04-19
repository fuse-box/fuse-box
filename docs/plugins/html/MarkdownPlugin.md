# MarkdownPlugin

## Description
Markdown Plugin generates HTML from Markdown files.

## Usage

```js
const {MarkdownPlugin} = require("fuse-box");
plugins: [
  MarkdownPlugin({
    useDefault: false,
    /* marked options */
  }),
]
```

It depends on [marked](https://github.com/chjj/marked) library, so it must be installed first :

```bash
yarn add marked --dev
npm install marked --save-dev
```

Toggle `useDefault` to make Markdown files export strings as `default` property.
For example with `useDefault: true` you will be able to import Markdown files like so:

```js
import tpl from "~/views/file.md"
```

With `useDefault: true`, is as if the html file contains this:
```jsx
export default `
  <!DOCTYPE html>
  <title>eh</title>
`
```

For other options, see https://github.com/chjj/marked.