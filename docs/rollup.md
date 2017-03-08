# Rollup

For those how are into minimalist bundles, FuseBox offers a built-in `Rollup` support.

At the moment it works only on typescript projects, therefore requires typescript. 

## Installation

Typescript is required due to the magic integration with Rollup. It will be used to transpile your code from es6 to es5.

```
npm install rollup typescript
```

After you have set it up, there are few things you need to consider, before jumping it

* All your modules need to be using es6 imports
* Use external library that support ONLY "jsnext:main", Look it up [here](https://github.com/jsforum/jsforum/issues/5)
* Read thoroughly the Rollup [documentation](rollupjs.org)
* FuseBox API will NOT be included. You won't be able to use ANY of the FuseBox features.

If you know what you are doing, you can procceed by checking an [example](https://github.com/fuse-box/fuse-box-rollup-example):

```bash
git clone git@github.com:fuse-box/fuse-box-rollup-example.git
npm install
node fuse
```

## How it works 
In progress


## Configuration

```js
rollup: {
    bundle: {
        moduleName: "Fuse4ever"
    },
    entry: `index.js`,
    treeshake: true
}
```

`Bundle` contains configuration that happen at the latest stage of rollup. Everything is a primary configuration. You will not be able to use Rollup plugins (for now), as FuseBox injects it's own plugin for resolving modules. Moreover, FuseBox has plenty to offer, for example [aliases](#alias)


