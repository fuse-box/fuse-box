# Readme
```js
let fuseBox = new FuseBox({
    homeDir: "test/fixtures/cases/case1"
});
```

### Example
true/false - standalone
```js
fuseBox.bundle("[**/*.js]", true).then(content => {

})
```


### Cases


`> index.js [**/*.js]` - Bundle everything without dependencies, and execute index.js

`[**/*.js]` - Bundle everything without dependencies

`**/*.js` - Bundle everything with dependencies

`**/*.js -path` - Bundle everything with dependencies except for path
