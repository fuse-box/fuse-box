# Path resolution

FuseBox allows you to customize the way you resolve your paths. FuseBox is 100% compliant with the TypeScript
specifications of `paths` in `tsConfig.json`

You don't need to be using typescript in order to customise your projects path resolution, FuseBox will read
`tsconfig.json` regardless of the language.

## baseUrl

`baseUrl` is one of the fundamental things you need to understand first. Let's take as an example the following file
structure

```
- src/
  - components/
    - Foo.ts
  - utilities/
    - fs.js
  - tsconfig.json
```

And `tsconfig.json`

```json
{
  "compilerOptions": {
    "baseUrl": "."
  }
}
```

In our case just this setting will allow us to the following imports:

```ts
import 'components/foo';
import 'utilities/fs';
```

Since our baseUrl is pointed to `src/` (it's set to `.` but our `tsconfig.json` is located in `src/`) everything under
will be listed and resolved with ease.

## paths

`Paths` is a very powerful mechanism to make your URL beautiful. It's especially helpful when dealing with
[monorepos](/docs/monorepo.md).

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@myorg/*": ["../../packages/*"]
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
