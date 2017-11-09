# Version 3 Detailed change log

## Better distribution

Previsouly npm package had all kind of garbage (not related to the runtime), now everything is under the root.
So if you were importing

```js
import("fuse-box/dist/commonjs/File")
```

You need to change it to

```js
import("fuse-box/core/File")
```

This change will barely make break anything, as all necessary modules are exported via index.

## Dynamic imports

Dynamic imports are enabled by default, so if you had 
```js
FuseBox.init({
    experimentalFeatues : true
})
```

You can remove it.

## Rollup support removed

We have quantum now.

## Better development 

You needed to run `gulp watch` and wait forever for you changes. Now, you can use a stable version of `FuseBox` to bundle `FuseBox`
Make a change - get an instant result.