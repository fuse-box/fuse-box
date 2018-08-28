---
id: dynamic-imports
title: Dynamic imports
---

In compliance with
[es6 proposal-dynamic-import](https://github.com/tc39/proposal-dynamic-import)
and
[Typescript 2.4 dynamic imports](https://github.com/Microsoft/TypeScript/wiki/Roadmap#24-june-2017)
FuseBox supports `import` statement.

On of the standard functionality, FuseBox offers much more.
[Quantum](/page/quantum) supports all the features listed below.

## Loading JSON

JSON files can be loaded asynchronously

```js
import("./target.json").then(target => {
  console.log(target);
});
```

### Loading support

| API Type         | Target                | Support |
| ---------------- | --------------------- | ------- |
| FuseBox Original | universal (always on) | yes     |
| Quantum          | browser               | yes     |
| Quantum          | universal             | yes     |
| Quantum          | server                | yes     |

### Working example

Clone the repository

```bash
git clone https://github.com/fuse-box/fuse-box-examples
cd examples/dynamic_import_json
```

Run with Original API

```bash
node fuse
```

Try with Quantum

```bash
node fuse dist
```

Tests are available
[here](https://github.com/fuse-box/fuse-box/blob/master/src/tests/dynamic_imports_test/ImportDynamicJSON.test.ts)

## Loading CSS

CSS files can be loaded asynchronously

```js
import("./target.css");
```

### Loading support

| API Type         | Target    | Support                |
| ---------------- | --------- | ---------------------- |
| FuseBox Original | browser   | yes                    |
| FuseBox Original | server    | yes (resolves nothing) |
| Quantum          | browser   | yes                    |
| Quantum          | universal | yes                    |
| Quantum          | server    | yes (resolves nothing) |

Tests are available
[here](https://github.com/fuse-box/fuse-box/blob/master/src/tests/dynamic_imports_test/ImportDynamicCSS.test.ts)

### Working example

Clone the repository

```bash
git clone https://github.com/fuse-box/fuse-box-examples
cd examples/dynamic_import_css
```

Run with Original API

```bash
node fuse
```

Try with Quantum

```bash
node fuse dist
```

## Loading anything else

Any other files can be loaded asynchronously too

```js
import("./target.txt").then(() => {});
```

### Loading support

| API Type         | Target    | Support                                                  |
| ---------------- | --------- | -------------------------------------------------------- |
| FuseBox Original | browser   | yes                                                      |
| FuseBox Original | server    | yes (with {extendServerImport : true})                   |
| Quantum          | browser   | yes                                                      |
| Quantum          | universal | yes                                                      |
| Quantum          | server    | yes (resolves a string with {extendServerImport : true}) |

## Loading remote javascript file (from CDN)

You can load a remote javascript file from CDN (it must support CORS if you want
to load it in the browser), for example

```js
import("https://unpkg.com/moment@2.19.1/moment.js").then(moment => {
  console.log(moment().format("LLLL"));
});
```

### Loading support

| API Type         | Target    | Support                                |
| ---------------- | --------- | -------------------------------------- |
| FuseBox Original | browser   | yes                                    |
| FuseBox Original | server    | yes                                    |
| Quantum          | browser   | yes                                    |
| Quantum          | universal | yes                                    |
| Quantum          | server    | yes (with {extendServerImport : true}) |

### Working example

Clone the repository

```bash
git clone https://github.com/fuse-box/fuse-box-examples
cd examples/dynamic_import_any
```

Run with Original API

```bash
node fuse
```

Try with Quantum

```bash
node fuse dist
```

Tests are available
[here](https://github.com/fuse-box/fuse-box/blob/master/src/tests/dynamic_imports_test/ImportDynamicAnythingElse.test.ts)

## Loading split bundle

Split bundles can be retrieved by name or by referencing an actual module

note: Physical code splitting (when the bundles are actually created) works ONLY
in Quantum. For development purposes your split bundles will be present in the
master bundle BY DESIGN

```js
const aboutModule = await import("./routes/about/AboutComponent");
console.log(new aboutModule.AboutComponent());
```

### Loading support

| API Type         | Target    | Support                             |
| ---------------- | --------- | ----------------------------------- |
| FuseBox Original | browser   | yes (faked - no physical splitting) |
| FuseBox Original | server    | yes (faked - no physical splitting) |
| Quantum          | browser   | yes                                 |
| Quantum          | universal | yes                                 |
| Quantum          | server    | yes                                 |

More information on code splitting is available [here](/page/code-splitting)

### Working example

Clone the repository

```bash
git clone https://github.com/fuse-box/fuse-box-examples
cd examples/code-splitting
```

Run with Original API

```bash
node fuse
```

Try with Quantum

```bash
node fuse dist
```

Tests are available
[here](https://github.com/fuse-box/fuse-box/blob/master/src/tests/dynamic_imports_test/ImportDynamicSplitBundles.test.ts)
