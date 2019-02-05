---
id: version-3.7.0-styled-components-plugin
title: Styled Components
original_id: styled-components-plugin
---

## Description

StyledComponentsPlugin improves development experience of `styled-components`
using the transformer/plugin `typescript-plugin-styled-components`.

## Install

The plugin requires `styled-components` and
`typescript-plugin-styled-components` to transform styled components into the
reactive ones.

```bash
yarn add styled-components --dev
yarn add typescript-plugin-styled-components --dev

// OR

npm install styled-components --save-dev
npm install typescript-plugin-styled-components --save-dev
```

## Usage

Add `StyledComponentsPlugin` into your configuration

```js
Fusebox.init({
  homeDir: "src",
  output: "dist/$name.js",
  plugins: [StyledComponentsPlugin()],
})
  .bundle("app")
  .instructions(">index.js");
```

This will create styled components with `bundleName` postfix. For example if you
have `header.tsx` file:

```tsx
const MyHeader = styled.header`
  background: red;
`
render {
  <MyHeader>
    This is my styled header
  </MyHeader>
}
```

you will get it rendered as follows below:

```html
<header class="MyHeader-hkmgDS fuUxah">This is my styled header</header>
```

## Options

### getDisplayName

By default, `StyledComponentsPlugin` uses `bundleName` variable, but you can
customise the postfix by implementing `getDisplayName` function:

```js
StyledComponentsPlugin({
  getDisplayName: (filename, bindingName) => {
    filename = filename
      .replace(/^.*[\\\/]/, "")
      .match(/[a-z]+/gi)
      .map(function(word) {
        return word.charAt(0).toUpperCase() + word.substr(1).toLowerCase();
      })
      .join("")
      .replace("Tsx", "")
      .replace("Ts", "");
    return filename + "_" + bindingName;
  },
});
```

```html
<header class="Header_MyHeader-hkmgDS fuUxah">This is my styled header</header>
```

`StyledComponentsPlugin` passes options directly to the
`typescript-plugin-styled-components` transformer as object without any
modifications. For more information read
[here](https://github.com/Igorbek/typescript-plugin-styled-components#options)
