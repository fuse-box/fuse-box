# Configuration

The concept of FuseBox is simple. Bundle anything for frontend and server without a headache. Simply put, you can copy paste a simple config down below and bundle some heavy module like `babel-core` or `babel-generator`. But let's get started and break down all available options in fusebox.

## Initialisation

Initialize a fuse-box instance like so. Each instance will handle 1 bundle.
```js
FuseBox.init({ /* you config is here */ })
```

## Home directory

That's your source folder, you don't need to provide an absolute path it will check it automatically and concat with your project folder.

```js
FuseBox.init({ 
  homeDir : "./src"
})
```

## Out file

That's your bundle file. It is relative to your project directory, but you can give it an absolute path as well

```js
FuseBox.init({ 
  homeDir : "./src",
  outFile : "./build/bundle.js"
})
```

## Cache

You can turn off caching if you like. By default caching is on. FuseBox will create a folder `.fuse-box` in your project path, and store related files. Don't forget to add it to .gitgnore.

```js
FuseBox.init({ 
  homeDir : "./src",
  outFile : "./build/bundle.js",
  cache : true
})
```

## Custom modules folder

You probably would want to test a package some day, or just have an abstraction on top of your code. For that, you can use `modulesFolder` property. It behaves exactly the same like another npm module, just in a custom folder. 

```
FuseBox.init({
    modulesFolder: "src/modules"
})
```

You local `npm` will have the highest priority. In essence, you can override fusebox's [path](https://github.com/fuse-box/fuse-box/blob/master/assets/libs/path/index.js) of [fs](https://github.com/fuse-box/fuse-box/blob/master/assets/libs/fs/index.js) module if you like. Customize you packages in your own manner!

> test

