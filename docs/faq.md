# FAQ

### Why my CSS plugin doesn't work?

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

