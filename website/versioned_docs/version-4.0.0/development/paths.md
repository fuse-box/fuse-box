---
id: version-4.0.0-paths
title: Paths
original_id: paths
---

FuseBox allows you to customize the way you resolve your paths. FuseBox is 100% compliant with the TypeScript
specifications of `paths` in `tsConfig.json`

You can (and likely should)
[read up on Typescript paths here](https://www.typescriptlang.org/docs/handbook/module-resolution.html#path-mapping)

You don't need to be using typescript in order to customize your projects path resolution, FuseBox will read
`tsconfig.json` regardless of the language.

Also, if you'd really rather not have a `tsconfig.json` file, there is a
[`tsconfig` field](./getting-started/full-config) in which you can set these properties

---

## baseUrl

`baseUrl` is the root from which every other path resolves. For example, if you had a set up like this:

```
// Project Folder Setup
- src/
  - components/
    - Foo.ts
  - utilities/
    - fs.js
  - tsconfig.json
```

```js
// tsconfig.json
{
  "compilerOptions": {
    "baseUrl": "."
  }
}
```

The following code would be valid:

```ts
import 'components/foo';
import 'utilities/fs';
```

The reason it works is because `baseUrl` is pointed to `src/` _(it's set to `.` but our `tsconfig.json` is located in
`src/`)_.

---

## paths

`Paths` are a very powerful mechanism to make your URL beautiful. They're especially helpful when dealing with
[monorepos](/docs/monorepo).

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@myorg/*": ["../../projects/*"]
    }
  }
}
```

The example above implies on the given file structure

```bash
projects/
  - world
    - src/
      - index.js
  - hello
    - src/
      - components/
        - Foo.ts
      - utilities/
        - fs.js
      - tsconfig.json
```

Now, let's imaging that we are in `fs.js`

```ts
import '@myorg/world';

// will get resolved to projects/world/
// being located in projects/hello/src/utilities/foo.js
```
