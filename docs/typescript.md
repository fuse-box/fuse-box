# Typescript

Typescript works out of the box, additional configuration is not required. Make sure you have the typescript compiler installed.

```bash
npm install typescript --save-dev
```

Now let's define a simple configuration

```js
FuseBox.init({
    homeDir: "src/",
    sourceMap: {
         bundleReference: "./sourcemaps.js.map",
         outFile: "sourcemaps.js.map",
    },
    outFile: "./out.js"
}).bundle(">index.ts");
```

FuseBox automatically switches to typescript mode by detecting the extension `.ts` / `.tsx`. FuseBox compiles and bundles your files.

> For your own convenience you can also add the [Typescript helpers plugin](#typescript-helpers).

## tsConfig

FuseBox comes with default ts options. You can customize the ts options by placing `tsconfig.json` in your `homeDir` and it will be picked up automatically. Alternatively you can use the tsconfig option to customize the path to tsconfig.json (It can be an absolute path, Or relative to `appRootPath`).

```js
FuseBox.init({
    tsConfig : "tsconfig.json"
})
```

* We automatically set the `module` to `commonjs`.
* If you set `sourceMap` in your `FuseBox` options, we automatically setup the sourcemap settings for TypeScript `compilerOptions`.
