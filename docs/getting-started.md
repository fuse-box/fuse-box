# Getting started

Before we proceed, let's make sure of that we are using NodeJS 6+ installed

## Assumptions
steps:
 * What is bundling?
   You are familiar with the term bundling, and you know why it's required
 * What is npm?
   You know what is NPM and how it works
 
## Your first bundle

FuseBox doesn't require much configuration to bundle heavy projects. In fact, 10 lines of configuration is usually enough to bundle a react project, or angular2. But before we start getting into some real world examples, let's create something simple.

You directory tree:


files:
project
 node_modules
  placeholder.js
 src
  foo.ts
  index.ts
 fuse.js
 package.json

 Imagine having a project folder called `project`. 

Let's initialize our first npm project

 ```bash
 mkdir project
 npm init
 ```

### Home directory

`src` is our home directory. In FuseBox it's not possible to require a file with an absolute path. FuseBox creates a `virtual file structure` that mimics the physical one. So make sure your home directory is clean, doesn't have references or symlinks outside itself.

### Config file

`fuse.js` - this is were keep our configuration, this file along with [Sparky](/page/sparky) test runner (if required) will help you making development and production builds.


```js
const { FuseBox } = require("fuse-box");
const fuse = FuseBox.init({
    homeDir: "src",
    output: "dist/$name.js",
});
fuse.bundle("app")
    .instructions(`>index.ts`);

fuse.run();
```

That's it, our configuration is ready!


| Symbol | Meaning |
| ------------- | ------------- |
| ` homeDir `   | Our [home directory](/page/configuration#home-directory)  |
| ` output `   | [Output](/page/configuration#output) configuration  |
| ` bundle("app") `   | Bundle [name](/page/bundle#creating-a-bundle)  |
| ` instructions(">index.ts") `   | Tell FuseBox what [to do](/page/bundle#arithmetic-instructions) with your source code |


github_example: simple_bundle

 
