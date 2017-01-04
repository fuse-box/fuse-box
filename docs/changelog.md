# Changelog


| Version         | Changes                 |
| ---------------------- |:-----------------------------| 
| 1.1.41            | Fixed a bug related to the ast traversing and babel. Added a new plugin api
| 1.1.40            | Fixing small bugs (uglify-js + peer deps)
| 1.1.39            | Added net, querystring and some other node modules
| 1.1.38            | Critical bug related to windows slashes
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

