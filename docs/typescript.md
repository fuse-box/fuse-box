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

FuseBox automatically switches to a typescript mode, compiles and bundles your files. Place `tsconfig.json` in your `homeDir`. It will be loaded automatically. For your own convenience add [Typescript helpers](#typescript-helpers) plugin.
