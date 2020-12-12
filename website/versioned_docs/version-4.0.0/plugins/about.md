---
id: version-4.0.0-about
title: About
original_id: about
---

Small overview of all plugins and what they do

### [Replace](./pluginReplace)

Replace any arbitrary string, in any specified files, with any other string. _This Plugin can be a life saver if you
need target and replace a bad path or minor bundling error_.

<br>

### [Consolidate](./pluginConsolidate)

"Consolidate" is a template engine which allows for injecting arbitrary text to an html template. This plugin interfaces
with it.

<br>

### [Custom Transform](./pluginTransform)

"Transformations" are a part of TypeScript's compilation to Javascript. This plugin allows you to add custom
transformations.

<br>

### [JSON](./pluginJSON)

Enabled by default, this plugin catches the importing of json files and converts them to json objects.

<br>

### [Minify Html Literals](./pluginMinifyHtmlLiterals)

Only used for minification, typically only in production builds. This plugin will find any `html` or `css` string
literals in your project and minify them.

<br>

---

_The following items are not plugins, but handle what used to be plugin jobs in earlier versions of FuseBox._

<br>

### [Resource Links](../resource_links)

While not actually a plugin, resource links act very similar to plugins. They will automatically copy asset file types
(ie `.ttf`, `.png`, `.svg`) to the `dist` folder when imported.

<br>

### [Style Sheets](../stylesheet)

Similar to Resource Links, Style Sheets are not an actual plugin, but they will handle the importing of `.less`,
`.scss`, `.sass`, `.css`, and `.styl`.
