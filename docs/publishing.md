# Publishing to npm
 
Here you will learn the best ways to make an npm package. There are 2 ways of publishing a package that FuseBox will deal with

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