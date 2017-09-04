# Contributing

First of all, thanks for chosing FuseBox. Our mission is to deliver the best developer experience for javascript developers. But we need your help. Any contrubution is absolutely valuable, starting from just giving ideas and drafting a PR.

But before you fork and actually starting coding something let's define some rules.

## Guide

### Communication first

The easiest way to start is by creating an issue. If you have something that requires live chatting join our Gitter channel and poke @nchanged. Certainly, if you PR consists of just fixing typos, there is no need in issue.

Having an issue will give the community full transparency on what's happening and who is doing what. Therefore - communication first.

### Mind the formatting

It's easier to review if your changes are readable. Please, respect the formatting and if you see that your editor changes the entire file, please revert and disable auto formatting. 

## No breaking changes

Do not attempt to make breaking changes unless it has been discussed. There is an exception where it's possible to toggle the functionality behind an option, anyway, see [Communication first](#communication-first)

## Workflow

Fork fuse-box repository and checkout `develop` branch. Pull requests on `master` will be rejected, Once you're done, don't forget to run the tests or/and if nessesary create some.


### How to test

Run

```bash
gulp installDevDeps
```

That will install a bunch of super heavy libraries, that's why they are not added to `dev-deps`. Mind `package.json` Your npm shouldn't save them there, if it did - please revert `package.json`

Run all tests
```bash
node test
```

Run one test case
```bash
node test --file=CSSDependencyExtractor.test.ts
```

### Developing

First thing off, run `gulp watch`. That script will watch the changes and re-compile the code.

For you convenience, make `npm link` on fuse-box repository.

* Create `_playground` folder next to fuse-box
* Make a symlink to `fuse-box/_playground` - `ln -s code/_playground code/fuse-box/`
* Link `fuse-box` - `fuse-box/_playground; npm link fuse-box`

You are all set