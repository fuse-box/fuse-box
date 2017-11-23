# Understanding targets and script levels

Regardless of the output (esnext or es5) module resolution must be set to commonjs. It's not because FuseBox cannot handle `imports` it's because FuseBox mimics `require` statements in development (that's why FuseBox is so fast - it's not altering the code).

## Working targets

As FuseBox is tightly coupled with TypeScript, there are a few tricks you can apply to make your life easier.
If you are using Babel - you shoulds still install TypeScript as it will be used to transpile npm modules. More about it [here](#working-with-babel)


`tsconfig.json` is being scanned from the current `homeDir` and higher up, if it's not found, FuseBox generates in-memory configuration, which looks like this:

```json
{
    "compilerOptions": {
        "module": "commonjs",
        "target": "es6"
    }
}
```

Once the config is created, you cannot override `"module": "commonjs"` it will always be set to use `commonjs`.

Take a look a [target](/page/configuration#target) option.

```js
FuseBox.init({
    target : "browser@es5"
})
```

If the above configuration is set, FuseBox will override `compilerOptions.target` in your `tsconfig.json` making it easier to control the output. It will also take care of all npm modules. For example if you are importing a library and the script target is not `es5` FuseBox will transpile it down.

An alternative way of overriding `tsconfig.json` is using [tsConfig](/page/configuration#tsconfig) option


```js
FuseBox.init({
    tsConfig : [{ target : `es5` }]
})
```

## Uglifying

Make sure you have `uglify-js` and/or `uglify-es` installed. If your target is higher than `es5`, Quantum will use `uglify-es`. More about it [here](/page/quantum#uglify) You can control that manually too.


## Working with Babel

So you use `Babel` instead of `TypeScript` but you still should install it. Don't worry you don't need to do anything, FuseBox will use TypeScript under the hood to help matching your script target.

For example if you are importing a library and the script target is not `es5` FuseBox will transpile it down. If you target is `es6`, FuseBox won't touch it (unless `import` statements are used - it will transpile it using `es6` target - respecting your script level choice)

### Why can't we use Babel to transpile npm modules?

Because `TypeScript` is much much faster and it's easy to change the script target. By the way, if you are interested, FuseBox can transpile javascript using TypeScript. Read up on [useTypescriptCompiler](/page/configuration#usetypescriptcompiler) option


# Publishing to npm

Here you will learn the best ways to make an npm package. There are 2 ways of publishing a package that FuseBox will deal with.

[npm package seed](https://github.com/fuse-box/fuse-box-npm-package-seed))

## Publish raw typescript package (recommended)

It's highly encouraged not to make a bundle of your library for multiple reasons

* You will kill all the chances to tree shake it (whether it's FuseBox or WebPack)
* Typings may go wrong
* You need to make an extra effort to generate those ;-)

What is proposed instead - is pointing `ts:main` (which FuseBox will understand) in package.json to a typescript source entry point.

This is how your `package.json` should look like in a perfectly composed npm library:

```json
{
    "main": "dist/es5-bundle.js",
    "ts:main": "src/index.ts",
    "typings": "src/index.ts",
}
```

If you are not interested (nor your users) in using it outside of FuseBox, or any bundles that supports bundling typescript code, you could do something like this:

```json
{
    "main": "src/index.ts",
    "typings": "src/index.ts",
}
```

## What is the actual benefit of having typescript source exposed?

* FuseBox will be able to convert it to any script level (es6/es5/esnext) you desire. You can read up more on this [here](/page/configuration#target)
* Tree Shaking will be done just right
* You can do code splitting of external packages using `import()` statement

For example in this [repository](https://github.com/fuse-box/fuse-ts-raw-package)

```ts
// zxcvbn will be split lazy loaded in the final FuseBox build
export async function checkPassword(pwd : string, opts ?: any){
    const  zxcvbn = import("zxcvbn");
    return zxcvbn(pwd, opts)
}
```

Once this library is bundled, FuseBox will automatically split `zxcvbn` library (which is heavy) to a separate bundle without you even knowing it (you will certainly notice it). Worth a mention - the actual splitting will happen when making a produdction build, using [Quantum](/page/quantum)


## Publish a contained bundle

As said earlier, you would want to make a bundle anyway, whether it's a nodejs library (without using FuseBox) or simply other cases that involve other bundlers.

You can follow the seed [here](https://github.com/fuse-box/fuse-box-npm-package-seed) to create an isolated bundle.

It all comes down to two options - [containedAPI](/page/quantum#containedapi) and [bakeApiIntoBundle](/page/quantum#bakeapiintobundle)
It's important to understand what these options actually do, so go ahead and read up on those.