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

