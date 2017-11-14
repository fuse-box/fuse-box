# Code splitting

Code Splitting is required if you want to make your "home" bundle as lightweight as possible. A framework must set up accordingly. FuseBox offers great functionality to loading split bundles without any configuration or/nor magical commments

Splitting is universal, meaning that you can lazy load them on a server (nodejs) as well.

## Basics


FuseBox does as much as possible to automate the process.

note: Physical code splitting (when the bundles are actually created) works ONLY in Quantum. For development purposes your split bundles will be present in the master bundle BY DESIGN


### How?

Just use dynamic `import` statement! It's that simple, FuseBox will do the heavy lifting for you

```js
import("./routes/about/AboutComponent")
```

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
