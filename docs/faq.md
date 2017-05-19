# FAQ

Frequently asked questions

## CSS

Questions related to CSS

### Why doesn't my CSSPlugin work?
Your chain is most likely not set up correctly. 

In case of the global config, make sure it looks like this:

```js
plugins : [
    [ SassPlugin(), CSSPlugin() ]
]
```

In case of a bundle specific config:

```js
fuse.bundle("app")
    .plugin(SassPlugin(),CSSPlugin() )
)
```

warning: Please double check the chain! It's very important!!!

note: An array should be inside a plugin array! That's how the chaining in fusebox is achieved.

## Imports / Exports
Questions related to imports/exports

### Default exports do not work

Why my default exports doesn't work? It works with webpack?!

```js
import lodash from "_"
```

That's because typescript is not Babel. If you can configure it by adding a [BabelPlugin](/plugins/babelplugin).  To solve this issue with typescript import your libraries as follows:


```js
import * as lodash from "_"
```

## Bundling

### Why aren't my node modules transpiled?

Because FuseBox does not transpile them. But you can easily do that by setting up the BabelPlugin like so:

```js
plugins : [
    BabelPlugin({limit2project : false})
]
```

You can target the Babel Plugin to resolve a failing library like so:

```js
plugins : [
    [ "node_modules/es6-lib/*", BabelPlugin({limit2project : false}) ]
]
```


FuseBox deliberately limits `Babel` to increase the overal performance. That's why `limit2project` is required 


### Why doesn't HMR work?

[HMR](/page/development#hot-module-reload) doesn't work with disabled cached. Enable it.