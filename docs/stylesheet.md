# Stylesheet

Most of the CSS extensions are captured automatically, for example, FuseBox takes care of `.less` `.scss` `sass` `css`
and `styl` extensions without questions.

The only conditions to those is having a corresponing CSS preprocessor installed.

Before continuing, let's break down the basics:

- All plugins listen to the global configuration first
- All CSS preprocessors have a unified configuration like `paths` and `macros`
- Every CSS preprocessor is being matched againts their default extensions
- Every CSS preprocessor can have a custom configuration and be matched againts specific paths

## Global configurations

FuseBox has a global concept of `stylesheet` which takes care of a global configuration that is applied to all CSS
preprocessors.

| Property                       | Meaning                                                                                            |
| ------------------------------ | -------------------------------------------------------------------------------------------------- |
| paths                          | Add here a list of directories where FuseBox will search for modules                               |
| macros                         | You can set an object with key value so it will be replaced in user imports and urls               |
| ignoreChecksForCopiedResources | If a resource present in the filesystem FuseBox will not copy it again                             |
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

## Using macros

Macros is a powerful mechanism that is applied to all CSS preprocessors respectfully.

```ts
fusebox({
  stylesheet: {
    macros: {
      $something: path.resolve(__dirname, '../node_modules/'),
    },
  },
});
```

Macros represents and object with key value, all `@import` and `url()` is going be to filtered through the macros
configuration once defined

Using with `@import` syntax

```scss
@import '$something/foobar';
```

Using with `url` syntax

```scss
.foo {
  background-image: url('$something/assets/logo.png');
}
```

**IMPORTANT** Resource resolution (unlike other bundlers) works very well, try avoiding settings macros parameters in
your urls

## Resources

**Every single** CSS preprocessor is configured with a custom importer which takes care of resolving and overriding the
paths even in nested imports. FuseBox supports it by default

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

**IMPORTANT** you should avoid using `macros` in the `urls`, since that reduces the readbility, not to mentioned the
transparency of your project. Your resources will be handled gracefully even with **deep nested** imports

## Intergation with HMR

HMR is pre-configured with all CSS preprocessors. Sit sit back and relax. Your browser view will be updated accordingly
on every `save`

Additionally, FuseBox maps a;; dependencies (`import` syntax) and will re-trigger the actual origin of the file to be
updated

## Plugins and configuration integration

CSS preprocessors like `Sass`, `Less`, `Stylus` and preconfigured. Every plugin API is exactly the same and can be
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

You can use a RegExp too:

```ts
pluginName(/components\/.*\.css$/, {
  stylesheet: {
    /* global override */
  },
});
```

Global configuration in the `stylesheet` property can be overriden by the plugin. For example. if your PostCSS modules
require different macros you can define it in the `pluginPostCSS`

## Importing as text

Additionally you can import a css file as text. In this case FuseBox will not add it to `head`.

You will have to add a specific plugin:

```ts
import { fusebox, pluginLess } from 'fuse-box';
fusebox({
  plugins: [pluginLess('*.less', { asText: true })],
});
```

Now you can use as follows:

```ts
import * as text from './index.less';
```

If you feel like having a `default` export instead you can add an extra field to support that:

```ts
fusebox({
  plugins: [pluginLess('*.less', { asText: true, useDefault: true })],
});
```

You can import the string as follows below:

```ts
import text from './index.less';
```

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

Less plugin is included by default, and captured automatically all files with extension `.less`

Less plugin has a special handler like all other plugins, that takes care of paths and resources resolution.

If you need to tweak the global configuration work with the plugin as follows:

**IMPORTANT** do not add the plugin if not needed!

```ts
import { fusebox, pluginLess } from 'fuse-box';
fusebox({
  plugins: [pluginLess('*.less')],
});
```

**IMPORTANT** do not add the plugin if not needed!

You can tweak the configuration in the `stylesheet` field

### Adding plugins

You add plugins to `Less` in 2 ways:

The most recommended one (without a plugin)

```ts
fusebox({
  stylesheet: {
    less: { plugins: [] },
  },
});
```

Through a plugin (if needed to override your global configuration)

```ts
import { fusebox, pluginLess } from 'fuse-box';
fusebox({
  plugins: [
    pluginLess('*.less', {
      stylesheet: {
        less: { plugins: [] },
      },
    }),
  ],
});
```

## Working with Stylus

Coming soon
