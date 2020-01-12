# Code splitting in production
The desired structure after CodeSplittingPhase of the productionContext

## Example source code

```js
index.ts
  import a;
  import b;

a.ts
  await import("./foo")

b.ts
  await import("./foo")

foo.ts:
   import "./bar"

bar.ts:
    ...
```

```js
IProductionContext: {
  ctx: Context,
  modules: Array<Module>,
  splitEntries: SplitEntries<{
    entries: Array<SplitEntry?>,
    register: function() {}
  }>
}
```

```js
ModuleTypes: {
  SPLIT_MODULE,
  MAIN_MODULE
}
```

```js
splitEntries: {
  entries: [{
    entry: { // FooModule:
      moduleTree: {
        ...,
        moduleType: SPLIT_MODULE
      }
    },
    references: [
      dynamicImportFromA,
      dynamicImportFromB
    ],
    modules: [
      FooModule,
      BarModule
    ]
  }]
}
```
