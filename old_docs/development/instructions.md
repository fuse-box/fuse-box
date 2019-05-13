---
id: instructions
title: Instructions
---

A bundle must have instructions. Instructions tell FuseBox how to deal with your
code,

## Everything related

```js
fuse.bundle("app").instructions("> index.ts");
```

Here we will bundle everything that's related to index.ts and execute it once
the page is loaded

## Isolating dependencies

If you are making vendor bundles, that will be handy. In this case we isolate
our `index.ts` and bundle the actual user code, ignoring external dependencies.

```js
.instructions("> [index.ts]")
```

In the example above we bundle without dependencies and execute on page load.

## Dependencies only

That's useful if you want to make vendors.

We extract only external dependencies, ignoring user code by adding `~` symbol.
For example:

```js
.instructions("~ index.ts")
```

or:

```js
.instructions(`~ **/**.{ts,tsx}`);
```

## Arithmetic symbols

Here is a full list of arithmetic symbols in FuseBox

| Symbol    | Meaning                                                                                                   |
| --------- | --------------------------------------------------------------------------------------------------------- |
| `>`       | Automatically executes a file on load                                                                     |
| `+`       | adds a package / file                                                                                     |
| `-`       | excludes a package / file                                                                                 |
| `!`       | removes the loader API from a bundle                                                                      |
| `^`       | disables cache                                                                                            |
| `~`       | Extract all external dependencies. Ignores the actual project files. Used to create vendors. `~ index.ts` |
| `[ ]`     | matches everything inside without dependencies                                                            |
| `**/*.ts` | matches every file using globs, with dependencies, experiment with [globtester](http://globtester.com)    |
