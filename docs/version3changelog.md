# Version 3 Detailed change log

## Target node >= 8

FuseBox will work on node.js 8+ because of `async` `await` usage. It's better to take advantage of the latest features - its much faster than then polyfill. If you are unable to upgrade your servers for some reason - no worries, we now have `es5` dist for you.

```js
import {FuseBox} from "fuse-box/es5"
```


## Smart Code Splitting

Terrific news!

It's finally here! No need to configure anything. And of course, now packages will be automatically shifted to split bundles if they are used only within a single split bundle. 

No configuration required, just use the `import` statement.
```ts
const about = await import("./components/AboutComponent");
new about.AboutComponent();
```

Development version will be left untouched, however, when you will run it againts Quantum, it will create a file `167ae727.js` which will contain all dependencies that do not cross with the project and/or other bundles. e.g if you are using `moment` library only in `that` bundle the entire module will be moved to `167ae727.js`

You can find an example project [here](https://github.com/fuse-box/fuse-box-3-preview/tree/master/smart-splitting)

Let's start testing!
Enjoy!


## Better distribution

Previsouly npm package had all kind of files (not related to runtime)
 
Now everything is under the `root`, no more unnecessary and distracting folders
So if you were importing

```js
import("fuse-box/dist/commonjs/File")
```

You will need to change it to

```js
import("fuse-box/core/File")
```

This change will barely break anything, as all necessary modules are exported via index.

## Dynamic imports

Dynamic imports are enabled by default, so if you had 
```js
FuseBox.init({
    experimentalFeatures : true
})
```

You can now remove it.

## Rollup support removed

We have quantum now.

## Better development 

You needed to run `gulp watch` and wait forever for you changes. Now, you can use a stable version of `FuseBox` to bundle `FuseBox`
Make a change - get an instant result.

## Configuration

### TsConfig

TsConfig can be overridden now. For example you have a `tsconfig.json` which FuseBox picks up automatically, but you want to make a slighly different configuration (for example change the target).

You can achieve that by providing an array with an object.
```js
FuseBox.init({
    tsConfig : [{
        target : "es5" // will override existing `tsconfig.json` target
    }]
})
```