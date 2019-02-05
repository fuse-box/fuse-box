<p align="center">
  <img
    height="151"
    width="468"
    src="https://raw.githubusercontent.com/fuse-box/fuse-box/master/logo.png">
</p>

<h2 align="center">A bundler that does it right</h2>

<p align="center">
  <a href="https://travis-ci.org/fuse-box/fuse-box">
    <img
      alt="Travis CI Build Status"
      src="https://img.shields.io/travis/fuse-box/fuse-box/master.svg?label=Travis+CI">
  </a>
  <a href="https://www.npmjs.com/package/fuse-box">
    <img
      alt="npm version"
      src="https://img.shields.io/npm/v/fuse-box.svg">
  </a>
  <a href="https://www.npmjs.com/package/fuse-box">
    <img
      alt="monthly downloads from npm"
      src="https://img.shields.io/npm/dm/fuse-box.svg">
  </a>
  <a href="https://github.com/prettier/prettier">
    <img
      alt="code style: prettier"
      src="https://img.shields.io/badge/code_style-prettier-ff69b4.svg">
  </a>
  </br>
  <a href="#backers">
    <img
      alt="Backers on Open Collective"
      src="https://opencollective.com/fuse-box/backers/badge.svg">
  </a>
  <a href="#sponsors">
    <img
      alt="Sponsors on Open Collective"
      src="https://opencollective.com/fuse-box/sponsors/badge.svg">
  </a>
  <a href="https://gitter.im/fusebox-bundler/Lobby">
    <img
      alt="Chat on Gitter"
      src="https://img.shields.io/gitter/room/fusebox-bundler/Lobby.svg">
  </a>
  <a href="https://twitter.com/FuseBoxJS">
    <img
      alt="Follow FuseBox on Twitter"
      src="https://img.shields.io/twitter/follow/FuseBoxJS.svg?label=follow+FuseBox">
  </a>
</p>

---

The next version of **FuseBox (4.0)** will feature major improvements to speed
and HMR. See the [changelog](./FuseBox4.0_changelog.md) here.

---

# Introduction

FuseBox is a performant bundler/module loader, where you measure you build time
in millseconds. It combines the power of [Webpack](https://webpack.js.org),
[JSPM](https://jspm.io) and [SystemJS](https://github.com/systemjs/systemjs).

### Blazing fast

FuseBox is extremely convenient for developers. Incremental build of an entire
application takes 50 to 100 milliseconds. It requires no configuration to bundle
projects such as `babel-core`.

### TypeScript First

FuseBox loves [TypeScript](https://www.typescriptlang.org), and does not require
any additional configuration to support it. It will compile and bundle your code
within a fraction of a second, yet it offers a comprehensive loader API. It is
packed with features and unfolds limitless possibilities of extending.

### Task Runner

FuseBox features a powerfull
[task runner](https://fuse-box.org/docs/task-runner/getting-started-with-sparky).
It fits perfectly in the modern API of FuseBox while resembling well established
concepts behind [Gulp](https://gulpjs.org).

### Plugins

We maintain all of the most used plugins. You can just pick what you need and
plug it in. If there's anything missing,
[let us know](./CONTRIBUTING.md#feature-requests)!

### Highlights

- No headache, minimal configuration
- First class
  [TypeScript](https://fuse-box.org/docs/getting-started/typescript-project)
  support
- [Tree shaking](https://fuse-box.org/docs/production-builds/quantum#tree-shaking)
- Code Splitting
- [Dynamic imports](https://fuse-box.org/docs/development/dynamic-imports)
- [CSS Code splitting](https://fuse-box.org/docs/getting-started/add-css#production-build)
- Blazing fast bundle time
- [DevServer and HMR](https://fuse-box.org/docs/development/development-server)
  integrate with existing HTTP apps in 1 second!
- Works everywhere for easy universal applications

There is so much more... FuseBox pushes bundling to a whole new level!

# Getting Started

### Installation

FuseBox has many baked in plugins to help you get started. All you need to do is
to install `fuse-box` using npm or yarn.

```sh
npm install fuse-box --save-dev
yarn add fuse-box --dev
```

### Usage

To build a TypeScript application, create a file `fuse.js` in the root directory
of your project:

```js
const { FuseBox } = require("fuse-box");

const fuse = FuseBox.init({
  homeDir: "src",
  output: "dist/$name.js",
});

fuse.bundle("app").instructions(`> index.ts`);

fuse.run();
```

And run it!

```sh
node fuse
```

### Documentation

You can find a more detailed getting started guide on our
[website](https://fuse-box.org/docs/getting-started/setup). It will walk you
through the basics and give you a solid foundation to dig deeper.

### Examples and seeds

You can find many examples and application scaffolds on our
[here](https://github.com/fuse-box/fuse-box-examples). Don't hesitate to reach
out to us on [Gitter](https://gitter.im/fusebox-bundler/Lobby). Please consult
our [Contributing guidelines](https://fuse-box.org/docs/contributing) before
creating an issue, we're trying to keep it nice and tidy.

#### React Example

[React project](https://github.com/fuse-box/fuse-react-demo) using React with
Code Splitting + CSS Splitting

# Open Collective

FuseBox contributors do this open source work in their free time. If you feel
that using FuseBox increases your productivity and you'd like us to invest more
time in it, please back us up.

### Backers

Support us with a monthly donation and help us continue our activities.
[Become a backer](https://opencollective.com/fuse-box#backer).

<a href="https://opencollective.com/fuse-box/backer/0/website" target="_blank"><img src="https://opencollective.com/fuse-box/backer/0/avatar.svg"></a>
<a href="https://opencollective.com/fuse-box/backer/1/website" target="_blank"><img src="https://opencollective.com/fuse-box/backer/1/avatar.svg"></a>
<a href="https://opencollective.com/fuse-box/backer/2/website" target="_blank"><img src="https://opencollective.com/fuse-box/backer/2/avatar.svg"></a>
<a href="https://opencollective.com/fuse-box/backer/3/website" target="_blank"><img src="https://opencollective.com/fuse-box/backer/3/avatar.svg"></a>
<a href="https://opencollective.com/fuse-box/backer/4/website" target="_blank"><img src="https://opencollective.com/fuse-box/backer/4/avatar.svg"></a>
<a href="https://opencollective.com/fuse-box/backer/5/website" target="_blank"><img src="https://opencollective.com/fuse-box/backer/5/avatar.svg"></a>
<a href="https://opencollective.com/fuse-box/backer/6/website" target="_blank"><img src="https://opencollective.com/fuse-box/backer/6/avatar.svg"></a>
<a href="https://opencollective.com/fuse-box/backer/7/website" target="_blank"><img src="https://opencollective.com/fuse-box/backer/7/avatar.svg"></a>
<a href="https://opencollective.com/fuse-box/backer/8/website" target="_blank"><img src="https://opencollective.com/fuse-box/backer/8/avatar.svg"></a>
<a href="https://opencollective.com/fuse-box/backer/9/website" target="_blank"><img src="https://opencollective.com/fuse-box/backer/9/avatar.svg"></a>
<a href="https://opencollective.com/fuse-box/backer/10/website" target="_blank"><img src="https://opencollective.com/fuse-box/backer/10/avatar.svg"></a>
<a href="https://opencollective.com/fuse-box/backer/11/website" target="_blank"><img src="https://opencollective.com/fuse-box/backer/11/avatar.svg"></a>
<a href="https://opencollective.com/fuse-box/backer/12/website" target="_blank"><img src="https://opencollective.com/fuse-box/backer/12/avatar.svg"></a>
<a href="https://opencollective.com/fuse-box/backer/13/website" target="_blank"><img src="https://opencollective.com/fuse-box/backer/13/avatar.svg"></a>
<a href="https://opencollective.com/fuse-box/backer/14/website" target="_blank"><img src="https://opencollective.com/fuse-box/backer/14/avatar.svg"></a>
<a href="https://opencollective.com/fuse-box/backer/15/website" target="_blank"><img src="https://opencollective.com/fuse-box/backer/15/avatar.svg"></a>
<a href="https://opencollective.com/fuse-box/backer/16/website" target="_blank"><img src="https://opencollective.com/fuse-box/backer/16/avatar.svg"></a>
<a href="https://opencollective.com/fuse-box/backer/17/website" target="_blank"><img src="https://opencollective.com/fuse-box/backer/17/avatar.svg"></a>
<a href="https://opencollective.com/fuse-box/backer/18/website" target="_blank"><img src="https://opencollective.com/fuse-box/backer/18/avatar.svg"></a>
<a href="https://opencollective.com/fuse-box/backer/19/website" target="_blank"><img src="https://opencollective.com/fuse-box/backer/19/avatar.svg"></a>
<a href="https://opencollective.com/fuse-box/backer/20/website" target="_blank"><img src="https://opencollective.com/fuse-box/backer/20/avatar.svg"></a>
<a href="https://opencollective.com/fuse-box/backer/21/website" target="_blank"><img src="https://opencollective.com/fuse-box/backer/21/avatar.svg"></a>
<a href="https://opencollective.com/fuse-box/backer/22/website" target="_blank"><img src="https://opencollective.com/fuse-box/backer/22/avatar.svg"></a>
<a href="https://opencollective.com/fuse-box/backer/23/website" target="_blank"><img src="https://opencollective.com/fuse-box/backer/23/avatar.svg"></a>
<a href="https://opencollective.com/fuse-box/backer/24/website" target="_blank"><img src="https://opencollective.com/fuse-box/backer/24/avatar.svg"></a>
<a href="https://opencollective.com/fuse-box/backer/25/website" target="_blank"><img src="https://opencollective.com/fuse-box/backer/25/avatar.svg"></a>
<a href="https://opencollective.com/fuse-box/backer/26/website" target="_blank"><img src="https://opencollective.com/fuse-box/backer/26/avatar.svg"></a>
<a href="https://opencollective.com/fuse-box/backer/27/website" target="_blank"><img src="https://opencollective.com/fuse-box/backer/27/avatar.svg"></a>
<a href="https://opencollective.com/fuse-box/backer/28/website" target="_blank"><img src="https://opencollective.com/fuse-box/backer/28/avatar.svg"></a>
<a href="https://opencollective.com/fuse-box/backer/29/website" target="_blank"><img src="https://opencollective.com/fuse-box/backer/29/avatar.svg"></a>

### Sponsors

Become a sponsor and get your logo on our README on Github with a link to your
site. [Become a sponsor](https://opencollective.com/fuse-box#sponsor)

<a href="https://opencollective.com/fuse-box/sponsor/0/website" target="_blank"><img src="https://opencollective.com/fuse-box/sponsor/0/avatar.svg"></a>
<a href="https://opencollective.com/fuse-box/sponsor/1/website" target="_blank"><img src="https://opencollective.com/fuse-box/sponsor/1/avatar.svg"></a>
<a href="https://opencollective.com/fuse-box/sponsor/2/website" target="_blank"><img src="https://opencollective.com/fuse-box/sponsor/2/avatar.svg"></a>
<a href="https://opencollective.com/fuse-box/sponsor/3/website" target="_blank"><img src="https://opencollective.com/fuse-box/sponsor/3/avatar.svg"></a>
<a href="https://opencollective.com/fuse-box/sponsor/4/website" target="_blank"><img src="https://opencollective.com/fuse-box/sponsor/4/avatar.svg"></a>
<a href="https://opencollective.com/fuse-box/sponsor/5/website" target="_blank"><img src="https://opencollective.com/fuse-box/sponsor/5/avatar.svg"></a>
<a href="https://opencollective.com/fuse-box/sponsor/6/website" target="_blank"><img src="https://opencollective.com/fuse-box/sponsor/6/avatar.svg"></a>
<a href="https://opencollective.com/fuse-box/sponsor/7/website" target="_blank"><img src="https://opencollective.com/fuse-box/sponsor/7/avatar.svg"></a>
<a href="https://opencollective.com/fuse-box/sponsor/8/website" target="_blank"><img src="https://opencollective.com/fuse-box/sponsor/8/avatar.svg"></a>
<a href="https://opencollective.com/fuse-box/sponsor/9/website" target="_blank"><img src="https://opencollective.com/fuse-box/sponsor/9/avatar.svg"></a>

# Contributing

Please consult
[Contributing Guildelines](https://fuse-box.org/docs/contributing) for details.
If you already know it, here's a fastlane to our communication channels:

- [Official Documentation](http://fuse-box.org/)
- [Submit an Issue](https://github.com/fuse-box/fuse-box/issues/new)
- [Make Documentation Better](https://github.com/fuse-box/fuse-box/tree/master/docs)
- [Join Gitter Channel](https://gitter.im/fusebox-bundler/Lobby)

Special thanks to [devmondo](https://github.com/devmondo) for incredible ideas,
giving inspiration and relentless testing/contributing to the project.

If you like the project, don't forget to star it!
