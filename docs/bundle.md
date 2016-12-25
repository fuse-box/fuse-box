# Bundle

## Arithmetic instructions

FuseBox uses arithmetic approach to bundling. We don't support anything else, as this approach is the most simple and flexible.

```
let fuse = FuseBox.init({
    homeDir: "src/",
    globals: { default: "myLib"},
    outFile: "./out.js"
});

fuse.bundle(">index.js");
```

If you want a bundle to be executed on load, add `>` in front of your entry file. 
Make sure to keep the extension as you can point to a typescript file. In case your bundle serves as an individual library, you would not want to make an automatic execution.

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

## Bundle in a bundle

Super powers of FuseBox allow doing that without code redundancy. An API of a second bundle will be removed, and 2 bundles will be fused together, keeping only one shared Fusebox API.

Only one thing you need to consider before that - packaging.

Your current project is called "default" This is by design. All dynamic modules will register themselves into it automatically. 

If you want to require a bundle it must have a different namespace. Unless you want to keep it shared. Read up on [package naming](#package-name) for better understanding

Bundle your first package, then make sure you master bundle does not have the same name (otherwise they will share filename scopes) and require it like any other file

```
import * as myLib from "./bundles/myLib.js"
```

FuseBox sniffs its own creations and restructures the code accordingly.
