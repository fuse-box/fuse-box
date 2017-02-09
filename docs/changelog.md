# Changelog


| Version         | Changes                 |
| ---------------------- |:-----------------------------| 
| 1.3.304             | Fixed errors related to Buffer. It is properly shimmed now, and fuse is serving a native "buffer" on server
| 1.3.303             | Added object-assign-polyfill to `process`
| 1.3.302             | PR [101](https://github.com/fuse-box/fuse-box/pull/101) merged 
| 1.3.301             | Quick fix in the API
| 1.3.97-300          | Preparing test runner
| 1.3.96              | Many bundles at once
| 1.3.95              | SVG Support in CSSResourcePlugin
| 1.3.90-94           | Tweaking CSSResourcePlugin
| 1.3.85-90           | Plugins added [CSSResourcePlugin](http://fuse-box.org/#cssresourceplugin) and [ImageBase64Plugin](http://fuse-box.org/#imagebase64plugin)
| 1.3.85            | Fixed caching (finally)
| 1.3.78            | Significant performance boost to the loader 
| 1.3.77            | Improved dynamic modules
| 1.3.71-76         | Test suit runner
| 1.3.68 - 1.3.70   | Hot reload fixes, various tweaks
| 1.3.67            | Proper [shimming](http://fuse-box.org/#shimming) 
| 1.3.63-66         | devServer fixes
| 1.3.54-63         | Cache improvements and devServer tweaks
| 1.3.51-54         | Introducing devServer
| 1.3.50            | Fixed caching issue
| 1.3.49            | Added [EnvPlugin](#envplugin)
| 1.3.48            | Added `FuseBox.packages` to the client API
| 1.3.47            | Fixed a critical bug related to circual dep resolution on cache
| 1.3.45-46         | Added few missing nodejs libs
| 1.3.44            | Fixed an issue related to typescript helpers (typo)
| 1.3.43            | Fixed [75](https://github.com/fuse-box/fuse-box/issues/75) Typescript helpers
| 1.3.42            | Fixed [#67](https://github.com/fuse-box/fuse-box/issues/67) + 71 and some other small fixes
| 1.3.41            | Fixed a bug related to the ast traversing and babel. Added a new plugin api
| 1.3.40            | Fixing small bugs (uglify-js + peer deps)
| 1.3.39            | Added net, querystring and some other node modules
| 1.3.38            | Critical bug related to windows slashes
| 1.3.37            | Fixed [57](https://github.com/fuse-box/fuse-box/issues/57)
| 1.3.36            | Fixed #56, less and stylus emit sourcemaps
| 1.3.34-35            | TSX [issue](https://github.com/fuse-box/fuse-box/issues/46) fixed
| 1.3.33            | Various fixes from PRs, few new plugins added
| 1.3.32            | Added [UglifyJsPlugin](#uglifyjsplugin)
| 1.3.28-31         | CSSPlugin supports sourcemaps and writing
| 1.3.27            | SassPlugin added (__kai__)
| 1.3.27            | Removed options from files (aaa.js?foo)
| 1.3.25            | Fixed a critical bug with native dependencies. Added RawPlugin + tests (thanks __kai__) |
| 1.3.21 - 23         | Require options introduced. Added [StylusPlugin](#stylusplugin), Raw style options for CSSPlugin (big thanks to _kai_ and _shepless_) |
| 1.3.18 - 1.3.21     | PluginChains introduced! Added [PostCSSPlugin](#postcssplugin) [LESSPlugin](#lessplugin) (thanks shepless) |
| 1.3.17            | Added [wildcard import](#wildcard-import) support |
| 1.3.16            |Prints a pretty stacktrace instead of unreadable acorn exceptions.|

