# Watcher

Watcher watches for projecnt file changes, and will run updates when they occur.  It is based on [the chokidar project](https://github.com/paulmillr/chokidar).

```ts
fusebox({ watch: true });
```

----

## Default Watcher Rules

There are a few rules that FuseBox automatically adds to the watcher. Those rules are based on common conventions
and practices.

### Ignoring the paths

In order to ignore updates to `.hidden_files`, `dist`, and `build` directories, the following ignore rule is added by default:

```ts
['/node_modules/', /(\/|\\)\./, 'dist/', 'build/', YOUR_OUTPUT_DIRECTORY];
```

If you wish to override these rules, you should add the following flag:

```ts
fusebox({
  skipRecommendedIgnoredPaths: true,
  ignored: [/my_own_regex/, 'some_string/'],
});
```

*(note: Strings are automatically converted to regular expressions. FuseBox also takes care of windows/\*nix paths for you. For example`./` is converted into `(\/|\\)\.`)*

### Chokidar options

You can pass chokidar options by using `chokidar` field:

```ts
fusebox({
  watch: {
    chokidar: { usePolling: true },
  },
});
```

*(note: The `ignored` field given to `chokidar` is declared by the `watch` field in FuseBox's configuration.  Do not define the `ignored` field here.)*