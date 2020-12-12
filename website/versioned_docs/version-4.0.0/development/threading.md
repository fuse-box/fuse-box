---
id: version-4.0.0-threading
title: Threading
original_id: threading
---

FuseBox is capable of running some of its processes in `worker_threads`. But before enabling it, you should understand
the following:

- Icreasing the amount of threads could degrade the performance and not improve it
- You should enable threads if you build time exceeds 6-7 seconds

If you have a large application `threading` would come in handy.

```ts
fusebox({
  threading: { threadAmount: 1, minFileSize: 5000 },
});
```

!!! Do not increase the amount of `threads` if you don't know what you are doing. !!!

Do not enable threading on a small scale applications, since that will lead to performance degradation. This happens
because `worker_threads` need to "warmup"

Additionally, setting `minFileSize` will help FuseBox to understand which files need to be piped to the worker. In some
cases small files are faster to compile synchronously

You can enabled threading via setting an argument in the process as follows

```shell
ts-node -T fuse.ts --threading
```
