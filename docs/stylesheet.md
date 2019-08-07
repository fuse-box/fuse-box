# Stylesheet

Most of the CSS extensions are captured automatically, for example, FuseBox takes care of `.less` `.scss` `sass` `css`
and `styl` extensions without questions.

The only conditions to those is having a corresponing CSS preprocessor installed.

## Global configurations

FuseBox has a global concept of `stylesheet` which takes care of a global configuration that is applied to all CSS
preprocessors.

| Property                       | Meaning                                                                                            |
| ------------------------------ | -------------------------------------------------------------------------------------------------- |
| paths                          | Add here a list of directories where FuseBox will search for modules                               |
| macros                         | You can set an object with key value so it will be replaced in user imports and urls               |
| ignoreChecksForCopiedResources | If a resources present in the filesystem FuseBox will not copy it again                            |
| breakDepednantsCache           | If toggled all stylesheet module will break its dependants cache and will be forced to be reloaded |
| groupResourcesFilesByType      | Files will be grouped in folder by type, e.g images will go to /resources/images                   |
| postCSS                        | PostCSS options                                                                                    |

Define those as shown below:

```ts
fusebox({
  stylesheet: {
    paths: [path.join(__dirname, 'src/global')],
    macros: {
      '@': path.resolve(__dirname, '../node_modules/'),
    },
  },
});
```

It's important to understand that most of the configuration in regards to styles should be better defined globally,
since all the css preprocessors will be able to benefit from it.

## Resources

**All** the CSS preprocessors have a handler for resolving and copying static files (e.g images, fonts) For example the
following css snippet:

```css
body {
  background-image: url('./assets/logo.png');
}
```

Will be transformed into:

```css
body {
  background-image: url('/resources/images/03dddba1f.png');
}
```

You can configure the paths by settings this field in FuseBox global configuration

```ts
fusebox({
  resources: {
    resourceFolder: './dist/resources/',
    resourcePublicRoot: '/custom-public',
  },
});
```

## Plugins and configuration integration

Css preprocessors like `Sass`, `Less`, `Stylus` and preconfigured. Every plugin API is exactly the same and can be
defined as shown below:

```ts
pluginName({
  stylesheet: {
    /* global override */
  },
});
```

Alternatively, you can capture specific files

```ts
pluginName('src/something/*.css', {
  stylesheet: {
    /* global override */
  },
});
```

You can use RegExp too:

```ts
pluginName(/components\/.*\.css$/, {
  stylesheet: {
    /* global override */
  },
});
```

Global configuration in the `stylesheet` property can be overriden by the plugin. For example. if your PostCSS modules
require different macros you can define it in the `pluginPostCSS`

## Working with SASS

**IMPORTANT** Sass is already integrated in FuseBox. You **DO NOT NEED** to import the plugin from FuseBox. install
`node-sass` first

```bash
npm install node-sass --save-dev
```

Sass in FuseBox is pre-configured with a custom importer that takes care of resolving the paths and your resources
(fonts, images e.t.c)

### Alternative configuration

If you want to override global configuration you can use the actual plugin

```ts
import { fusebox, pluginSass } from 'fuse-box';
fusebox({
  plugins: [
    pluginSass({
       /* override global configuration here*/
    ]})
  ],
});
```

## Working with PostCSS

PostCSS is the only plugin that isn't included by default, because of it's flexibility to capture any file extension.

```ts
import { fusebox, pluginPostCSS } from 'fuse-box';
import * as precss from 'precss';

fusebox({
  plugins: [
    pluginPostCSS('src/*.css', {
      stylesheet: {
        macros: {
          /* if you want to override global macros configuration */
        },
        postCSS: {
          plugins: [precss(/* options */)],
        },
      },
    }),
  ],
});
```

`pluginPostCSS` is pre-configured with a `atImport` plugin, which is included by default.

**ATTENTION** DO NOT INCLUDE `postcss-import` plugin. Since it's already a part of `pluginPostCSS` which takes care of
resolving and copying resources using the global or local configuration.

## Working with Less

Coming soon

## Working with Stylus

Coming soon
