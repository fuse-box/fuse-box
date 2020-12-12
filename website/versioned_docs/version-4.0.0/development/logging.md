---
id: version-4.0.0-logging
title: Logging
original_id: logging
---

Logging in FuseBox can switched between `'succinct'`, `'verbose'`, and `'disabled'` modes.

```ts
fusebox({
  logging: { level: 'verbose' },
});
```

## Tweak logging messages

Sometimes you'd like to ignore specific logs. For instance, one of the dependencies of `antd` has code like this:

```ts
try {
  var indexof = require('./indexof');
} catch (e) {
  var indexof = require('./indexof-something');
}
```

For reasons, FuseBox will spit an error message even though the bundle still works. While it is best habit to put in an
issue with the package developer, it's not generally very timely.

In order to have the logging ignore errors from something like this, you could add the following flag:

```ts
fusebox({
  logging: {
    ignoreStatementErrors: ['indexof'],
  },
});
```

That will make your build green.
