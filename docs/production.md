# Production builds

To run FuseBox in production call `runProd` instead of `runDev` in your `fuse.ts` file.

-------

## Setting up cleanCSS

```ts
await fuse.runProd({
  cleanCSS: {
    compatibility: {
      properties: { urlQuotes: true },
    },
  },
});
```

Read up on properties [here](https://github.com/jakubpawlowicz/clean-css)
