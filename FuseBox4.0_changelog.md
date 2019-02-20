# FuseBox 4.0

# Improvements

## HMR

We all know this annoying moment when you create a **new file** and you need to
refresh the page in order to make it work? Well. guess what - it has been fixed

- Automatic Vendor hydration. If you add a new module it will be recognised and
  automatically loaded into the browser.
- 100% properly mapped source maps are sent along with the update (!!!)
- Automatic dependency hydration. So you've modified a module, added a few
  components - Voilà! you have it updated with working source maps within a
  fraction of a second

Say no more to page refreshing!

## Source maps

Source maps handling has been revisited and fixed

- Properly generated vendor source maps with cache (!!!)
- Properly generated source maps paths for CSS
- Fixed sourceRoot. CSS and JS files are properly handled and respect the option

Vendor source maps are always generated under `node_modules`. They are cached
too, so now, you can restart the process and get them as fast and your SSD
allows. But bear in mind, that the process of generating/retrieving/injecting is
very greedy on RAM and can and will degrade the performance.

## Workers are comign next!

I am expecting a 10x-20x increase in performance. Stay tuned! it's comming soon!

# Breaking changes

## Deleted

- `Own bundle` - removed due to the presense of Quantum. OwnBundle check was
  used to check if user requires a development Fuse bundle.
- Test runner Unfortunately the test runner had to be removed. There are great
  alternatives like `jest`. We will focus on bundling.
- CSSPlugin no longer accepts any options. Since the production output is
  handled entirely by Quantum
- polyfillNonStandardDefaultUsage has been removed in favour of
  [allowSyntheticDefaultImports](#allowSyntheticDefaultImports)
- Removed `CSSModules` exports in favour of conventional `CSSModulesPlugin`
- Removed `VuePlugin` in favour of `VueComponentPlugin`
- Removed `Uglify-es` plugin in favour of `TerserPlugin`
