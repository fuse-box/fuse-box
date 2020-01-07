# Code splitting in production

This is a write up while making code splitting into production.

Desired structure

```js
IProductionContext: {
  ctx: Context,
  modules: Array<Module>,
  splitReferences: {
    references,
    register: function() {
    }
  }
}
```

```js
references: [
  
]
```
