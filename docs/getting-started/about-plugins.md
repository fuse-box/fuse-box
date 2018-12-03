---
id: about-plugins
title: About plugins
---

Plugins in FuseBox are very easy to use. In fact, we have a bunch of them
prepared and maintained by FuseBox community. You won't need to google, the most
important ones are in the Plugin section.

## Simple use case

```js
FuseBox.init({
  homeDir: "src",
  output: "dist/$name.js",
  plugins: [CSSPlugin()],
});
```

The example above enables bundling `.css` files. (How simple was that?!).
However, if you want to specify the exact path (for example you would want to
get some CSS files as string), you can chain them

```js
plugins: [["mypath/**.css", CSSPlugin()]];
```

Note, that it's been wrapped in `[]` that is an indicator for plugin chain. You
can chain as many plugins as you like, as long as they support chaining of
course.

First item on the list is actually a `RegExp`. We cook RegExp from a string to
make it look nicer visually.

For example, the code snippet above is equivalent to:

```js
plugins: [[/mypath\/**.css/, CSSPlugin()]];
```

## Chaining

FuseBox plugins support chaining.

```js
plugins: [
  [SassPlugin(), CSSResourcePlugin(), CSSPlugin()], // make sure you've got an array here
];
```

Here we start off by taking any `.sass` file, piping the contents into
`CSSResourcePlugin` which extracts the resources and copies them into your dist
folder, and finally `CSSPlugin` takes care of loading them, re-loading on HMR
and much more. If you work with CSS, make sure that `CSSPlugin()` is the last
one on the list.

Certainly, you can specify a mask to capture required files.

```js
plugins: [
  ["sass_files/*.scss", SassPlugin(), CSSResourcePlugin(), CSSPlugin()],
];
```
