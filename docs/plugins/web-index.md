---
id: web-index-plugin
title: WebIndexPlugin
---

## Description

Generates a HTML file once a producer's job is completed

## Usage

### Setup

Import from FuseBox

```js
const { WebIndexPlugin } = require("fuse-box");
```

Inject into a chain

```js
fuse.plugin(WebIndexPlugin());
```

Include in the `plugins` array property in the `init` configuration

```js
fuse.init({
  homeDir: "src",
  output: "build/$name.js",
  target: "browser",
  plugins: [WebIndexPlugin()],
});
```

## Options

> Note: If a `template` and `templateString` option are both specified, then the
> `template` will take precedent. If no default value is specified below, the
> option will not be applied.

| Name             | Type                                          | Description                                                                                                                                                                                                                                                                                                                                                  | Default      |
| ---------------- | --------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------ |
| `appendBundles`  | `boolean`                                     | Append the $bundles to provided template                                                                                                                                                                                                                                                                                                                     | `true`       |
| `async`          | `boolean`                                     | Adds the `async` attribute to the `<script />` tags that link the output javascript bundles                                                                                                                                                                                                                                                                  | `false`      |
| `author`         | `string`                                      | Set the the `content` attribute of a `<meta name="author"` tag                                                                                                                                                                                                                                                                                               |
| `bundles`        | `string[]`                                    | Provide a list of bundle names. (if not set all registered bundles are through)                                                                                                                                                                                                                                                                              |
| `charset`        | `string`                                      | Set the the `charset` attribute of a `<meta />` tag                                                                                                                                                                                                                                                                                                          |
| `description`    | `string`                                      | Set the the `content` attribute of a `<meta name="description" />` tag                                                                                                                                                                                                                                                                                       |
| `emitBundles`    | `(bundles: string[]) => string`               | Function that returns the list of paths to each output bundle                                                                                                                                                                                                                                                                                                |
| `engine`         | `string`                                      | You can use conslidate plugin by providing an engine name                                                                                                                                                                                                                                                                                                    |
| `keywords`       | `string`                                      | Set the the `content` attribute of a `<meta name="keywords" />` tag                                                                                                                                                                                                                                                                                          |
| `locals`         | `{ [key: string]: any }`                      | Pass variable to consolidate module                                                                                                                                                                                                                                                                                                                          |
| `path`           | `string`                                      | The relative url that bundles are served from. Empty is set with `"."`                                                                                                                                                                                                                                                                                       | `"/"`        |
| `pre`            | `string` or `{ relType: "fetch" | "load" }`   | Must be specified using either `'fetch'` or `'load'` as the value for the `relType` key, if using the object configuration or as a plain string. Adds `<link />` tags with `preload` or `prefetch` attributes for each of the output javascript bundles. The tags will be injected into the head of the html document or where specified by the `$pre` macro |
| `resolve`        | `resolve ?: {(output : UserOutput) : string}` | Function that allows to completely override the output                                                                                                                                                                                                                                                                                                       |
| `target`         | `string`                                      | The name of the output `.html` file                                                                                                                                                                                                                                                                                                                          | `index.html` |
| `template`       | `string`                                      | Provide a path to your own template                                                                                                                                                                                                                                                                                                                          |
| `templateString` | `string`                                      | Provide your own template                                                                                                                                                                                                                                                                                                                                    |
| `title`          | `string`                                      | Sets the title of the generated HTML document                                                                                                                                                                                                                                                                                                                |

### Resolve example

The `resolve` option allows you to completely override the path.

```js
WebIndexPlugin({
  resolve: output => output.lastPrimaryOutput.filename,
});
```

## Custom template

A custom template has the following macros available:

| Macro          | Meaning                                                                             |
| -------------- | ----------------------------------------------------------------------------------- |
| `$author`      | Define where the author meta tags will be injected into the html document           |
| `$bundles`     | A list of script tags                                                               |
| `$charset`     | Define where the charset meta tags will be injected into the html document          |
| `$css`         | A list of styles tags                                                               |
| `$description` | Define where the description meta tags will be injected into the html document      |
| `$keywords`    | Define where the keywords meta tags will be injected into the html document         |
| `$pre`         | Define where the prefetch/preload link tags will be injected into the html document |
| `$title`       | Html Title                                                                          |
