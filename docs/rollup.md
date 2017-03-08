# Rollup

For those how are into minimalist bundles, FuseBox offers a built-in `Rollup` support.

At the moment it works only on typescript projects, therefore requires typescript. 

### Get started

Typescript is required due to the magic integration with Rollup. It will be used to transpile your code from es6 to es5.

```
npm install rollup typescript
```

After you have set it up, there are few things you need to consider, before jumping it

* All your modules need to be using es6 imports
* Use external library that support ONLY "jsnext:main", Look it up [here](https://github.com/jsforum/jsforum/issues/5)
* Read thoroughly the Rollup [documentation](rollupjs.org)
* FuseBox API will NOT be included. You won't be able to use ANY of the FuseBox features.

