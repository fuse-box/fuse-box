# Bundle

## Arithmetic approach

FuseBox uses arithmetic approach to bundling. 

```
let fuse = FuseBox.init({
    homeDir: "src/",
    globals: { default: "myLib"},
    outFile: "./out.js"
});

fuse.bundle(">index.js");
```

`>` symbols means `entry point`. If you want your bundle to be executed once loaded, just add `>` in front of your main file. 
Make sure you keep an extension as you can point to a typescript file.

With arithmetic instructions, you can explicitly define which files go to the bundle, which files skip external dependencies.

For example.

```js
fuseBox.bundle(">index.ts [lib/**/*.ts]");
```

In this case, you will get everything that is required in the index, as well as everything that lies under lib/ folder with one condition - any external libraries will be ignored. 

### Examples for better understanding

`> index.js [**/*.js]` - Bundle everything without dependencies, and execute index.js

`[lib/*.js] +path +fs` - Bundle all files in lib folder, ignore node modules except for path an fs

`[**/*.js]` - Bundle everything without dependencies

`**/*.js` - Bundle everything with dependencies

`**/*.js -path` - Bundle everything with dependencies except for module path
