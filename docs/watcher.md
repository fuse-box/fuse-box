# Watcher

Watcher in FuseBox helps you develop with ease without bothering yourself with restarting the process each time. It's
enabled by default during development.

```ts
fusebox({ watch: true });
```

The watcher is based on [chokidar](https://github.com/paulmillr/chokidar)

There are a few rules that FuseBox is automatically adding to the watcher. Those rules are based on common conventions
and practices.

## Ignoring the paths

By default, FuseBox is adding the following ignore rules.

```ts
['/node_modules/', /(\/|\\)\./, 'dist/', 'build/', YOUR_OUTPUT_DIRECTORY];
```

We don't want `.hidden_files` `dist` nor `build` directories to be watched, including node_modules and your projects'
output directory. If you wish to take control of those rules and override them you should add the following flag:

```ts
fusebox({
  skipRecommendedIgnoredPaths: true,
  ignored: [/my_own_regex/, 'some_string/'],
});
```

Please note, that FuseBox converts strings to regular expressions. It also takes care of windows/\*nix paths for you.
For example`./` is converted into `(\/|\\)\.`

## Chokidar options

You can pass chokidar options by using `chokidar` field:

```ts
fusebox({
  watch: {
    chokidar: { usePolling: true },
  },
});
```

Note that `ignored` paths is declared at the `watch` level, as it's being handled and tweaked by FuseBox
