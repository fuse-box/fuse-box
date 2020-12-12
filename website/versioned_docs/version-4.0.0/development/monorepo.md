---
id: version-4.0.0-monorepo
title: Monorepo
original_id: monorepo
---

### What and Why?

A monorepo is a project structure in which many small interconnected projects are all part of a single repo. The more
common alternative is to have every project be its own repo.

The reason for using a monorepo is so that -- whilst working on two projects together -- you never accidentally push a
commit to one but not the other. It's very easy to break a project for others without a monorepo. With a monorepo, all
changes get committed together.

### Understanding the concepts

<!-- Before reading further it's strongly recommended to read thoroughly the following. -->

While monorepos are mostly a version control concept, there are some changes to configuration required to rock one in
FuseBox. This is largely because **you can not access files above your `homeDir`**.

Fortunately, there is an `entry` property, so you can move your `homeDir` to any parent folder and then work your
`entry` property back down.

---

## Example Project

To see an example monorepo project [click here](https://github.com/fuse-box/fuse-mono).

---

## Monorepo Setup Synopsis

The following are explained in detail further down the page.

1. Set `homeDir` field to the root of your repository, and `entry` field to your main project file.
2. Add/set up `tsconfig.json` with `paths` and `baseUrl` fields. FuseBox pulls these values from `tsconfig.json` as part
   of its own configuration _(even if there is no TypeScript involved)_.

3. Every other package you include from the repo should contain `local:main` field in the `package.json` which should
   point to your source _(instead of `dist`)_.

---

## 1. homeDir and entry

You project `homeDir` must be set to the root of the parent repository. For example, if you had this project folder
structure

```
- monorepo
  - packages
    - foo
    - bar
```

`homeDir` should point to `monorepo` folder

```ts
fusebox({
  target: 'browser',
  output: '../../dist/project',
  homeDir: '../../', // we are going all the way up to "monorepo" folder
  entry: 'packages/foo/index.ts', // entry is relative to "monorepo" folder
});
```

---

## 2. Configuring paths

Simply put, your `tsconfig` must have a `baseUrl` field which points to your local src and a `paths` field which routes
to your packages.

All full page on [how to set paths here can be found here](./paths). _(note: aliasing will not work)_

```json
{
  "compilerOptions": {
    "baseUrl": ".", // should point to your local src
    "paths": {
      "@org/*": ["../../packages/*"]
    }
  }
}
```

---

## 3. local:main

All node packages naturally contains `main` or `module` fields by default in their `package.json`. Unfortunately, **both
of these point to the projects `dist` folder**.

It's likely you'll not be compiling these projects, but instead wanting to simply include the source code.

To achieve that, you should add `local:main` field to your `package,json`.

This field will only be used if the folder isn't located in `node_modules`.

```js
// package.json
{
  // settings omitted...
  "main": "index.js",
  "name": "fuse-box",
  "local:main": "./src/index.ts",
}
```
