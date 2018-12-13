---
id: version-3.6.0-styled-components-plugin
title: CSSModules
original_id: styled-components-plugin
---

## Description

StyledComponentsPlugin improves development experience of `styled-components` via transformer/plugin `typescript-plugin-styled-components`. Which main purpose is to provide compile-time information of creates styled components, such as names of these components, for the run-time, allowing to operate with proper names of such the components.

## Install

Using the StyledComponentsPlugin requires `styled-components` and `typescript-plugin-styled-components` to transform  styled components to reactive components.

```bash
yarn add styled-components --dev
yarn add typescript-plugin-styled-components --dev

// OR

npm install styled-components --save-dev
npm install typescript-plugin-styled-components --save-dev
```

## Usage

After that you can use the `StyledComponentsPlugin` in your configuration.

```js
Fusebox.init({
  homeDir: "src",
  output: "dist/$name.js",
  plugins: [StyledComponentsPlugin()],
})
  .bundle("app")
  .instructions(">index.js");
```

This will create styled components with `bundleName` variable. For example if you have `header.tsx` file:

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

you will get rendered header like this:

```html
<header class="MyHeader-hkmgDS fuUxah">This is my styled header</header>
```

## Options

### getDisplayName

By default, `StyledComponentsPlugin` uses `bundleName` variable, but you can change it by using `getDisplayName` function:

```js
StyledComponentsPlugin({
  getDisplayName: (filename, bindingName) => {
    // typescript-plugin-styled-components gives path to a filename variable
    // we change a path to a real filename in PascalCase
    filename = filename.replace(/^.*[\\\/]/, '').match(/[a-z]+/gi).map(function (word) {
        return word.charAt(0).toUpperCase() + word.substr(1).toLowerCase()
      }).join('').replace('Tsx', '').replace('Ts', '');
    return filename + '_' + bindingName
  }
});
```

You can do whatever you like with filename or bindingName variables or return other string if you like. The result of previous `header.tsx` file would look like this:

```html
<header class="Header_MyHeader-hkmgDS fuUxah">This is my styled header</header>
```

`StyledComponentsPlugin` just passes options straight to the `typescript-plugin-styled-components` transformer as object and without any additional check. It will allow to use modified transformer in the future without changing `StyledComponentsPlugin`. For more how to use the `typescript-plugin-styled-components` transformer read [here](https://github.com/Igorbek/typescript-plugin-styled-components#options)