# Monorepo

## Understanding the concepts

Before reading further it's strongly recommended to read thoroughly the following.

Unlike other bundlers, FuseBox has a concept of `homeDir` where it sets the root of your project. You cannot require
files outside of your home directory. By default, FuseBox sets `homeDir` to your project root, however, in case of a
monorepo that's not the case, since every sub project has it's own `fuse.ts`

In order to achieve smooth development we should set the `homeDir` to the root of your repository, regardless of where
you `fuse.ts` is and set `entry` relative to the project root instead (which should match your `homeDir`)

Here are the highlights

- Always set `homeDir` to the root of your repository
- Add `tsconfig.json` with `paths` and `baseUrl` field even if you are not using TypeScript. FuseBox respects
  `tsconfig.json` even if there is no TypeScript involved.
- Learn how to set `paths` correctly. Do not try aliasing it.
- Set different `output` folders.
- Each package for development purposes should contain `local:main` field in the `package.json` which should point to
  your source. That will help a lot during development. (You won't need to build each project)

## Configuring project

You project `homeDir` must be set to the root of the parent repository. For example having the file structure

```
- monorepo
  - packages
    - foo
    - bar
```

`homeDir` Should point to `monorepo` folder

```ts
fusebox({
  target: 'browser',
  output: '../../dist/project',
  homeDir: '../../', // we are going all the way up to "monorepo" folder
  entry: 'packages/foo/index.ts', // entry is relative to "monorepo" folder
});
```

## Setting up packages for development

Each packages naturally contains `main` or `module` fields, however, that's not convenient during development, since you
would want to pick up the sources of the package.

In order to achieve that, you can add `local:main` field to your `package,json`.

This field will be read if:

- The folder isn't located in `node_modules`
- You are running `runDev` (development mode)

`local:main` will be ignored otherwise if the above conditions aren't met

### But why really?

FuseBox treats your **scoped** packages as actual directories, not packages. Since every single package contains
`package.json` with `main` or `module` fields pointed to the dist - that will prevent FuseBox from picking up the
changes and getting the correct entry points during development. We fix it by making it believe that we are dealing with a
project.

All is left is to configure `paths`

## Configuring paths

Regardless of TypeScript or JavaScript, you will have to create `tsconfig.json` and give it `baseUrl` and paths, in
order for FuseBox to understand how to resolve your scoped repository for development. For example:

```json
{
  "compilerOptions": {
    "baseUrl": ".", // should point to the path "monorepo"
    "paths": {
      "@org/*": ["./*"]
    }
  }
}
```

Whenever FuseBox resolves meets `import "@org/foo"` it will go through the rules defined in `paths` and resolve your
package during the development. All the packages will be treated as a part of your project without any "side effects".
It will be possible to HMR them too, with working source maps.

If you are not familiar with TypeScript paths, you should read up
[here](https://www.typescriptlang.org/docs/handbook/module-resolution.html#path-mapping) even if you are not using
TypeScript. FuseBox takes this as a base for resolving paths, and has a 100% compliant implementation
