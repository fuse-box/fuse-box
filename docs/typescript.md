# Typescript

Typescript works out of the box, additional configuration is not required. Make sure you have the typescript compiler installed.

```bash
yarn add typescript --dev
npm install typescript --save-dev
```

Now let's define a simple configuration

```js
const fuse = FuseBox.init({
    homeDir: "src/",
    output: "dist/$name",
});

fuse.bundle("app").instructions(">index.ts");
fuse.run()
```

FuseBox automatically switches to typescript mode by detecting the extension `.ts` / `.tsx`. FuseBox compiles and bundles your files.

note: For your own convenience you can also add the [Typescript helpers plugin](/plugins/typescript-helpers-plugin).

## tsConfig

FuseBox comes with default ts options so you don't *need* a tsconfig.

If you have a tsconfig file in your `homeDir` or any directory up the file tree (e.g. `appRootPath`), it will be picked up automatically.

Alternatively you can use the tsconfig option to customize the path to tsconfig.json (It can be an absolute path, Or relative to the project's folder).

```js
FuseBox.init({
    tsConfig: "tsconfig.json",
})
```

Irrespective of the settings in `tsconfig.json`:

* We automatically set the `module` to `commonjs`.
* If you set `sourceMaps` in your `FuseBox` options, we automatically setup the sourcemap settings for TypeScript `compilerOptions`.
