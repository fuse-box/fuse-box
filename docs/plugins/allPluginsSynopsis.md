# Plugins

### [Consolidate](./pluginConsolidate.md)

"Consolidate" is a template engine which allows for injecting arbritary text to an html template.  This plugin interfaces with it.

<br>

### [Custom Transform](./pluginTransform.md)

"Transformations" are a part of TypeScript's compilation to Javascript.  This plugin allows you to add custom transformations.

<br>

### [JSON](./pluginJSON.md)

Enabled by default, this plugin catches the importing of json files and converts them to json objects.

<br>

### [Minify Html Literals](./pluginMinifyHtmlLiterals.md)

Only used for minification, typically only in production builds.  This plugin will find any `html` or `css` string literals in your project and minify them.


<br>

### [Replace](./pluginReplace.md)

Replace any arbritrary string, in any specified files, with any other string.

<br>

---------



*The following items are not plugins, but handle what used to be plugin jobs in earlier versions of FuseBox.*

<br>

### [Resource Links](../resource_links.md)

While not actually a plugin, resource links act very similar to plugins.  They will automatically copy asset file types (ie `.ttf`, `.png`, `.svg`) to the `dist` folder when imported.

<br>

### [Style Sheets](../stylesheet.md)

Similar to Resource Links, Style Sheets are not an actual plugin, but they will handle the importing of `.less`, `.scss`, `.sass`, `.css`, and `.styl`.