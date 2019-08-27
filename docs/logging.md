# Logging

Logging in FuseBox can switched from `succinct` to `verbose` mode

```ts
fusebox({
  logging: { level: 'verbose' },
});
```

## Tweak logging messages

Some old style packages might use something like this:

```ts
try {
  var indexof = require('./indexof');
} catch (e) {
  var indexof = require('./indexof-something');
}
```

This is a very extreme example, however, it's noticed to be present in one of the dependencies of `antd`. FuseBox will
spit an error message. That doesn't mean that the bundle won't work. It only means that:

- You should contact the developer and ask them to fix this issue

In order to fix the logging and ignore that error, you could add the following flag:

```ts
fusebox({
  logging: {
    ignoreStatementErrors: ['indexof'],
  },
});
```

That will make your build green.
