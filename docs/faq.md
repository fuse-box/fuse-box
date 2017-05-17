# FAQ

Frequently asked questions

## CSS

Questions related to CSS

### Why my CSS plugin does not work?
You chain is most likely not set up correctly. 

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

note: An array should be inside a plugin array! That's how the chaining in fusebox is achived.

### Default exports do not work

Why my default exports doesn't work? It works with webpack?!

```js
import lodash from "_"
```

That's because typescript is not Babel. If you can configure it by adding a [BabelPlugin](/plugins/babelplugin).  To solve this issue with typescript import a library like that:


```js
import * as lodash from "_"
```

