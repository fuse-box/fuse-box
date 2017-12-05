# Code splitting
## > 3.0


Code Splitting is required if you want to make your "home" bundle as lightweight as possible. A framework must set up accordingly. FuseBox offers great functionality to loading split bundles without any configuration or/nor magical commments

Splitting is universal, meaning that you can lazy load them on a server (nodejs) as well.

You can find an example project [here](https://github.com/fuse-box/fuse-box-3-preview/tree/master/smart-splitting)

## Basics


FuseBox does as much as possible to automate the process.

note: Physical code splitting (when the bundles are actually created) works ONLY in Quantum. For development purposes your split bundles will be present in the master bundle BY DESIGN


### How?

Just use dynamic `import` statement! It's that simple, FuseBox will do the heavy lifting for you

```js
import("./routes/about/AboutComponent")
```

Development version will be left untouched, however, when you will run it against Quantum, it will create a file `167ae727.js` which will contain all dependencies that do not cross with the project and/or other bundles. e.g if you are using `moment` library only in that bundle the entire module will be moved to `167ae727.js`


FuseBox will detect which modules and files are shared and which belong only to this specific bundle. Long story short - let FuseBox take care of that.

## Named bundles

Instead of importing by path, you can import by path for your convenience.

```js
fuse.bundle("app")
  .split("named_bundle", "routes/entryPointWithoutOpeningDot.tsx")
```


```js
const namedBundle = await import("named_bundle");
```

## Configuring

You may need to configure how FuseBox resolves your bundles.

`browser` key will help FuseBox to resolve your bundles in browser, and `server` on server accordingly.
`dest` customises the output: it's consistent with our `output` configuration:

```js
const fuse = FuseBox.init({
  homeDir: "src",
  output: "dist/$name.js",
})

fuse.bundle("app")
    .splitConfig({ browser: "/static/bundles/", server : "dist/static/bundles/", dest: "bundles/" })
    .instructions(`> [app.tsx]`)

fuse.run()
```

github_example: react-code-splitting
