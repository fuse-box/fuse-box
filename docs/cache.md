# Cache

Caching in FuseBox is a powerful mechanism which main goal is to reduce time spent on compiling of modules. It's enabled
by default.

Your cache is located by default in `node_modules/.fusebox`

When running production mode - `runProd()` cache will be ALWAYS disabled and all of its settings will be ignored.

### Setting custom cache folder

Sometimes it's required to set different cache folders in order to avoid cache collision. If you are using multiple
instances of FuseBox (they are both watched) it's always a good idea to split them.

```ts
fusebox({
  cache: { root: path.join(__dirname, '.cache/server') },
});
```

### FTL mode

`FTL` stands for `Fast Than Light` mode where FuseBox doesn't write the changes to the filesystem on an HMR event but
uses memory instead.

```ts
fusebox({
  cache: { FTL: true },
});
```

`FTL` won't work with target `server`. Requirements are below

- webIndex should be enabled
- Target must be `browser` or `electron`
- cache should be enabled
- devServer must be enabled

**How does it work?**

If you have a lot of files in your project (+500) it naturally takes some time to generate a bundle. Even if you have
cache on, it might still take a few seconds to generate it on the fly. With `FTL` on, FuseBox will inject a script
`__ftl` into `webIndex` `(index.html)` which will contain 5 latest modules you are working on.

You will be "dropped" out of FTL if you change file's dependency tree (For example add or remove an import) or exceed a
maximum in-memory amount of stored modules (which is 5)

`FTL` is extremely useful when working on multiple components in a large project. HMR reload time will be reduced from
`2-3 seconds` to `5-10 milliseconds`
