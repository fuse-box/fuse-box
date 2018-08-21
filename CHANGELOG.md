<a name="3.5.0-next.11"></a>

# [3.5.0-next.11](https://github.com/fuse-box/fuse-box/compare/v3.4.0...v3.5.0-next.11) (2018-08-28)

### Bug Fixes

- cleanup, added favicon. removed unused blocks
  ([d2b6ba1](https://github.com/fuse-box/fuse-box/commit/d2b6ba1))
- CSS better styles on landing
  ([35c55e1](https://github.com/fuse-box/fuse-box/commit/35c55e1))
- **Quantum:** Quantum CSS splitting loads sourcemaps on production
  ([3e548cc](https://github.com/fuse-box/fuse-box/commit/3e548cc))
- don't throw asset reference error on wildcard imports
  ([d594e65](https://github.com/fuse-box/fuse-box/commit/d594e65))
- footer styles ([a0afc35](https://github.com/fuse-box/fuse-box/commit/a0afc35))
- HMR event and sourcemaps reload
  ([86d9811](https://github.com/fuse-box/fuse-box/commit/86d9811)), closes
  [#1324](https://github.com/fuse-box/fuse-box/issues/1324)
- log.showBundledFiles ignored when log.enabled value missing
  ([b1d1b17](https://github.com/fuse-box/fuse-box/commit/b1d1b17))
- match against valid npm namespace + package name
  ([3e2bf8e](https://github.com/fuse-box/fuse-box/commit/3e2bf8e))
- **Quantum:** Quantum file resolution of conflicting libraries
  ([9cea9e5](https://github.com/fuse-box/fuse-box/commit/9cea9e5))
- md, css - links, added resources, other small fixes
  ([2aa7768](https://github.com/fuse-box/fuse-box/commit/2aa7768))
- minor changes to layout
  ([c13c6f7](https://github.com/fuse-box/fuse-box/commit/c13c6f7))
- more content ([b99f424](https://github.com/fuse-box/fuse-box/commit/b99f424))
- typescript section
  ([aa91528](https://github.com/fuse-box/fuse-box/commit/aa91528))
- Update typescript version to fix a problem with build
  [#1339](https://github.com/fuse-box/fuse-box/issues/1339)
  ([17594a4](https://github.com/fuse-box/fuse-box/commit/17594a4))
- Upgrade fs-extra to remove fs.promises API warning
  ([#1341](https://github.com/fuse-box/fuse-box/issues/1341))
  ([e37caef](https://github.com/fuse-box/fuse-box/commit/e37caef))
- watcher can't resume if queue contains a rejecting promise
  ([84dd0f0](https://github.com/fuse-box/fuse-box/commit/84dd0f0)), closes
  [#1335](https://github.com/fuse-box/fuse-box/issues/1335)
- **docs:** colors
  ([96b1d18](https://github.com/fuse-box/fuse-box/commit/96b1d18))
- **quantum:** Ignoring Dynamic imports when mixed with sync imports
  ([dd664d5](https://github.com/fuse-box/fuse-box/commit/dd664d5))
- **Quantum:** fix Quantum CSS paths without splitConfig
  ([0ec4058](https://github.com/fuse-box/fuse-box/commit/0ec4058))
- **Quantum:** Prevent Quantum from creating empty chunks
  ([24f5915](https://github.com/fuse-box/fuse-box/commit/24f5915)), closes
  [#1297](https://github.com/fuse-box/fuse-box/issues/1297)
  [#1184](https://github.com/fuse-box/fuse-box/issues/1184)
- **Quantum:** Quantum CSS splitting respects hashing
  ([eafee77](https://github.com/fuse-box/fuse-box/commit/eafee77))
- **Quantum:** VUE modules ignored dynamic imports
  ([d4be225](https://github.com/fuse-box/fuse-box/commit/d4be225)), closes
  [#1360](https://github.com/fuse-box/fuse-box/issues/1360)

### Features

- add test for scope packages with valid name
  ([d4f26fd](https://github.com/fuse-box/fuse-box/commit/d4f26fd))
- Automatic css splitting and lazy load with dynamic imports
  ([e600da7](https://github.com/fuse-box/fuse-box/commit/e600da7))
- **Quantum:** Loading CSS chunks before split bundles are loaded and executed
  ([#1355](https://github.com/fuse-box/fuse-box/issues/1355))
  ([89800ef](https://github.com/fuse-box/fuse-box/commit/89800ef))
- **website:** A new website based on Docosaurus
  ([c4cbea9](https://github.com/fuse-box/fuse-box/commit/c4cbea9))
- feature list ([a3c4d08](https://github.com/fuse-box/fuse-box/commit/a3c4d08))
- Initial docs styles, fonts and logos
  ([77dadd0](https://github.com/fuse-box/fuse-box/commit/77dadd0))
- moving to sass
  ([5990f30](https://github.com/fuse-box/fuse-box/commit/5990f30))
- New Quantum target - browser/server/universal
  ([#1323](https://github.com/fuse-box/fuse-box/issues/1323))
  ([b77400e](https://github.com/fuse-box/fuse-box/commit/b77400e))
- TypeScript section
  ([5dc3814](https://github.com/fuse-box/fuse-box/commit/5dc3814))

### Performance Improvements

- swap minimist for getopts
  ([eb48f84](https://github.com/fuse-box/fuse-box/commit/eb48f84))

<a name="3.4.0"></a>

# [3.4.0](https://github.com/fuse-box/fuse-box/compare/v3.3.0...v3.4.0) (2018-07-13)

### Bug Fixes

- add error handling, add backward compatability, update docs.
  ([49ebf45](https://github.com/fuse-box/fuse-box/commit/49ebf45))
- Global keys order is respected in config, fixes
  [#1304](https://github.com/fuse-box/fuse-box/issues/1304)
  ([#1305](https://github.com/fuse-box/fuse-box/issues/1305))
  ([722c501](https://github.com/fuse-box/fuse-box/commit/722c501))
- move devServer fallback after proxy
  ([163ef97](https://github.com/fuse-box/fuse-box/commit/163ef97))
- Quantum CSS now respects tree shaking
  ([52637a5](https://github.com/fuse-box/fuse-box/commit/52637a5))
- remove node-sass from deps
  ([bf305e2](https://github.com/fuse-box/fuse-box/commit/bf305e2))

### Features

- adjust `pre` option in webindex to a string instead of an object and update
  docs. ([8d13bd9](https://github.com/fuse-box/fuse-box/commit/8d13bd9))

<a name="3.3.0"></a>

# [3.3.0](https://github.com/fuse-box/fuse-box/compare/v3.2.2...v3.3.0) (2018-06-20)

### Bug Fixes

- ConsolidatePlugin- Template engine takes basedir not baseDir
  ([#1236](https://github.com/fuse-box/fuse-box/issues/1236))
  ([0d3dbc2](https://github.com/fuse-box/fuse-box/commit/0d3dbc2))
- Copy readme so it's included in npm
  ([836ff48](https://github.com/fuse-box/fuse-box/commit/836ff48))
- cssFiles keys now use the {packageName}/{pattern} format
  ([3459180](https://github.com/fuse-box/fuse-box/commit/3459180))
- **tests:** Remove message from error object to make test compatible with
  Node 9. ([c36ac01](https://github.com/fuse-box/fuse-box/commit/c36ac01))
- CSSResource parse error
  ([#1213](https://github.com/fuse-box/fuse-box/issues/1213))
  ([cc4d42c](https://github.com/fuse-box/fuse-box/commit/cc4d42c))
- Error propagation bug.
  ([#1216](https://github.com/fuse-box/fuse-box/issues/1216))
  ([1ad7c71](https://github.com/fuse-box/fuse-box/commit/1ad7c71))
- Fixed a critical bug with CSSPlugin and path overrides
  ([b129f2d](https://github.com/fuse-box/fuse-box/commit/b129f2d))
- keep original source file extensions when using useTypeScriptCompiler option.
  ([#1278](https://github.com/fuse-box/fuse-box/issues/1278))
  ([5c39c94](https://github.com/fuse-box/fuse-box/commit/5c39c94))
- Made error message clearer, and included HTML Template file not found error
  check. ([#1207](https://github.com/fuse-box/fuse-box/issues/1207))
  ([66f06bb](https://github.com/fuse-box/fuse-box/commit/66f06bb))
- Quantum breaks on more than one configured globals
  ([#1223](https://github.com/fuse-box/fuse-box/issues/1223))
  ([f509d19](https://github.com/fuse-box/fuse-box/commit/f509d19))
- Remove debug console.log
  ([1d3172c](https://github.com/fuse-box/fuse-box/commit/1d3172c))
- renaming generated files to allow several vue files in a folder
  ([fcfbfa0](https://github.com/fuse-box/fuse-box/commit/fcfbfa0))
- require statements ignored if not 'true' requires. fixes
  [#1142](https://github.com/fuse-box/fuse-box/issues/1142)
  ([#1229](https://github.com/fuse-box/fuse-box/issues/1229))
  ([0b138f2](https://github.com/fuse-box/fuse-box/commit/0b138f2))
- syntheticDefaultExportPolyfill Check if frozen before attempting to
  defineProperty. ([#1235](https://github.com/fuse-box/fuse-box/issues/1235))
  ([2c971e7](https://github.com/fuse-box/fuse-box/commit/2c971e7))

### Features

- Add css splitting with cssFiles quantum config
  ([d3f5491](https://github.com/fuse-box/fuse-box/commit/d3f5491))
- added support for arrays in modulesFolder
  ([#1293](https://github.com/fuse-box/fuse-box/issues/1293))
  ([73e2f73](https://github.com/fuse-box/fuse-box/commit/73e2f73))
- Automatic alias mapping based on baseDir in tsconfig.json (ts)
  ([8f11040](https://github.com/fuse-box/fuse-box/commit/8f11040))
- Consolidate Plugin - Pass baseDir & includeDir as options
  ([#1225](https://github.com/fuse-box/fuse-box/issues/1225))
  ([26e7ebe](https://github.com/fuse-box/fuse-box/commit/26e7ebe))
- devServer fallback ([#1265](https://github.com/fuse-box/fuse-box/issues/1265))
  ([1f5bbe3](https://github.com/fuse-box/fuse-box/commit/1f5bbe3))
- filesMapping option to CSSResourcePlugin
  ([#1281](https://github.com/fuse-box/fuse-box/issues/1281))
  ([8cd39db](https://github.com/fuse-box/fuse-box/commit/8cd39db))
- HTTPS devServer option
  ([#1255](https://github.com/fuse-box/fuse-box/issues/1255))
  ([0715cc3](https://github.com/fuse-box/fuse-box/commit/0715cc3))
- Use cssFiles name as key for manifest
  ([fb107ef](https://github.com/fuse-box/fuse-box/commit/fb107ef))
- WebIndexPlugin accepts engine option
  ([e0cba10](https://github.com/fuse-box/fuse-box/commit/e0cba10))
- WebIndexPlugin additional attributes support in script tags
  ([#1246](https://github.com/fuse-box/fuse-box/issues/1246))
  ([f790bfb](https://github.com/fuse-box/fuse-box/commit/f790bfb))
- Working CLI (install skeletons)
  ([87df46a](https://github.com/fuse-box/fuse-box/commit/87df46a))

<a name="3.2.2"></a>

## [3.2.2](https://github.com/fuse-box/fuse-box/compare/v3.2.1...v3.2.2) (2018-04-17)

### Bug Fixes

- CSSResourcePlugin backslashes fixes on Windows 10
  ([c34c637](https://github.com/fuse-box/fuse-box/commit/c34c637))
- Update vue plugin to accept 'stylus' and 'sass' lang types by default.
  ([ef7e577](https://github.com/fuse-box/fuse-box/commit/ef7e577))

### Features

- SassPlugin header option
  ([e9f8409](https://github.com/fuse-box/fuse-box/commit/e9f8409))

<a name="3.2.1"></a>

## [3.2.1](https://github.com/fuse-box/fuse-box/compare/v3.2.0...v3.2.1) (2018-04-10)

### Bug Fixes

- typescript errors ([#1185](https://github.com/fuse-box/fuse-box/issues/1185))
  ([79e9dc5](https://github.com/fuse-box/fuse-box/commit/79e9dc5))
- Missing semicolon messed up with UMD init
  ([9fbbb56](https://github.com/fuse-box/fuse-box/commit/9fbbb56))
- Replace troublesome uws with standard ws
  ([0ebfcc2](https://github.com/fuse-box/fuse-box/commit/0ebfcc2)), closes
  [#1189](https://github.com/fuse-box/fuse-box/issues/1189)

<a name="3.2.0"></a>

# [3.2.0](https://github.com/fuse-box/fuse-box/compare/v3.1.3...v3.2.0) (2018-04-06)

### Bug Fixes

- [#1101](https://github.com/fuse-box/fuse-box/issues/1101) types missing
  because of using bind
  ([#1104](https://github.com/fuse-box/fuse-box/issues/1104))
  ([76e6600](https://github.com/fuse-box/fuse-box/commit/76e6600))
- Add very small memory save
  ([699979e](https://github.com/fuse-box/fuse-box/commit/699979e))
- Added react and react-dom to devDependencies
  ([#1111](https://github.com/fuse-box/fuse-box/issues/1111))
  ([320522f](https://github.com/fuse-box/fuse-box/commit/320522f))
- Allow postcss `to` to be overridden by options given to the plugin
  ([8dcbc3d](https://github.com/fuse-box/fuse-box/commit/8dcbc3d))
- browser nested routes bug with Quantum
  ([#1168](https://github.com/fuse-box/fuse-box/issues/1168))
  ([dda92bb](https://github.com/fuse-box/fuse-box/commit/dda92bb))
- Catching typescript transpilation errors
  ([#1103](https://github.com/fuse-box/fuse-box/issues/1103))
  ([8c0122a](https://github.com/fuse-box/fuse-box/commit/8c0122a))
- data URLs handling in CSSResourcePlugin
  ([#1098](https://github.com/fuse-box/fuse-box/issues/1098))
  ([e44448e](https://github.com/fuse-box/fuse-box/commit/e44448e))
- Fix and optimize component HMR
  ([adf5223](https://github.com/fuse-box/fuse-box/commit/adf5223))
- Fix bugs when using VueComponentPlugin in development.
  ([b32016d](https://github.com/fuse-box/fuse-box/commit/b32016d))
- Fix postCSS error "without 'from' option"
  ([#1118](https://github.com/fuse-box/fuse-box/issues/1118))
  ([0ee1cc7](https://github.com/fuse-box/fuse-box/commit/0ee1cc7))
- Fix scoped selector in VuePlugin.
  ([#1117](https://github.com/fuse-box/fuse-box/issues/1117))
  ([8d8ef5a](https://github.com/fuse-box/fuse-box/commit/8d8ef5a))
- LoaderAPI typeof fix
  ([#1109](https://github.com/fuse-box/fuse-box/issues/1109))
  ([4f5d253](https://github.com/fuse-box/fuse-box/commit/4f5d253))
- Optimize EnvPlugin when running on electron
  ([a81448c](https://github.com/fuse-box/fuse-box/commit/a81448c))
- Optimize VuePlugin when is running on electron
  ([7a5aa0b](https://github.com/fuse-box/fuse-box/commit/7a5aa0b))
- PathResolver and browser overrides should respect a module override
  ([2ecd663](https://github.com/fuse-box/fuse-box/commit/2ecd663))
- Quantum typeof require should not be replaced with replaceTypeOf
  ([d2df9ba](https://github.com/fuse-box/fuse-box/commit/d2df9ba)), closes
  [#1133](https://github.com/fuse-box/fuse-box/issues/1133)
- Replace arrow functions with function in imports for development
  ([02f2b77](https://github.com/fuse-box/fuse-box/commit/02f2b77))
- sourcemaps path and windows slashes
  ([14ea0be](https://github.com/fuse-box/fuse-box/commit/14ea0be)), closes
  [#1143](https://github.com/fuse-box/fuse-box/issues/1143)
- Stream polyfill returns an empty function
  ([95868e3](https://github.com/fuse-box/fuse-box/commit/95868e3)), closes
  [#1162](https://github.com/fuse-box/fuse-box/issues/1162)
- **tslint:** fixed all auto-fixable errors in core/FuseBox.ts
  ([a16ab51](https://github.com/fuse-box/fuse-box/commit/a16ab51))
- **tslint:** fixed all auto-fixable errors in Log.ts
  ([78594b9](https://github.com/fuse-box/fuse-box/commit/78594b9))
- Support tsconfig.json with comments
  ([#1129](https://github.com/fuse-box/fuse-box/issues/1129))
  ([d3e9a8a](https://github.com/fuse-box/fuse-box/commit/d3e9a8a))
- Suppress warnings for electron builds
  ([1cf3638](https://github.com/fuse-box/fuse-box/commit/1cf3638)), closes
  [#1160](https://github.com/fuse-box/fuse-box/issues/1160)
- Typing error in source map generators
  ([3331cab](https://github.com/fuse-box/fuse-box/commit/3331cab))
- typings plugins can consists of strings
  ([3c13991](https://github.com/fuse-box/fuse-box/commit/3c13991)), closes
  [#1169](https://github.com/fuse-box/fuse-box/issues/1169)
- Update the condition for vue HMR
  ([#1120](https://github.com/fuse-box/fuse-box/issues/1120))
  ([83c44ab](https://github.com/fuse-box/fuse-box/commit/83c44ab))
- use typescript api to parse tsconfig.json
  ([4236a32](https://github.com/fuse-box/fuse-box/commit/4236a32))

### Features

- **languagelevel:** adds template literal as identifier of ES2015
  ([a99e155](https://github.com/fuse-box/fuse-box/commit/a99e155))
- Added `ServiceWorker` case
  ([1b77d27](https://github.com/fuse-box/fuse-box/commit/1b77d27)), closes
  [#1163](https://github.com/fuse-box/fuse-box/issues/1163)
- Add a useOriginalFilenames option to CSSResourcePlugin
  ([78d31a9](https://github.com/fuse-box/fuse-box/commit/78d31a9))
- Add help messages to Sparky tasks
  ([f68993c](https://github.com/fuse-box/fuse-box/commit/f68993c))
- log option now takes an object (enabled, showBundledFiles &
  clearTerminalOnBundle)
  ([#1136](https://github.com/fuse-box/fuse-box/issues/1136))
  ([600b204](https://github.com/fuse-box/fuse-box/commit/600b204))
- Quantum definedExpressions option
  ([#1105](https://github.com/fuse-box/fuse-box/issues/1105))
  ([4d846d2](https://github.com/fuse-box/fuse-box/commit/4d846d2))
- sorted bundle sources
  ([c1ba79f](https://github.com/fuse-box/fuse-box/commit/c1ba79f))
- stdin option ([#1121](https://github.com/fuse-box/fuse-box/issues/1121))
  ([cf975ad](https://github.com/fuse-box/fuse-box/commit/cf975ad))
- WebIndexPlugin - Possibility to shape how bundles are emitted
  ([#1144](https://github.com/fuse-box/fuse-box/issues/1144))
  ([f1ac7d5](https://github.com/fuse-box/fuse-box/commit/f1ac7d5))

<a name="3.1.3"></a>

## [3.1.3](https://github.com/fuse-box/fuse-box/compare/v3.1.2...v3.1.3) (2018-02-07)

### Bug Fixes

- ImageBase64Plugin regression - fails to load images into bundle
  ([a144558](https://github.com/fuse-box/fuse-box/commit/a144558)), closes
  [#1095](https://github.com/fuse-box/fuse-box/issues/1095)

<a name="3.1.2"></a>

## [3.1.2](https://github.com/fuse-box/fuse-box/compare/v3.1.1...v3.1.2) (2018-02-07)

### Bug Fixes

- Quantum - replaces property require with fsx
  ([71ba880](https://github.com/fuse-box/fuse-box/commit/71ba880))

<a name="3.1.1"></a>

## [3.1.1](https://github.com/fuse-box/fuse-box/compare/v3.1.0...v3.1.1) (2018-02-06)

### Bug Fixes

- Require.main.filename is replaced partially by Quantum
  ([673338b](https://github.com/fuse-box/fuse-box/commit/673338b)), closes
  [#1088](https://github.com/fuse-box/fuse-box/issues/1088)

<a name="3.1.0"></a>

# [3.1.0](https://github.com/fuse-box/fuse-box/compare/v3.0.2...v3.1.0) (2018-02-05)

### Bug Fixes

- Some modules cannot be imported because `this !== module.exports`
  ([#1030](https://github.com/fuse-box/fuse-box/issues/1030))
  ([#1032](https://github.com/fuse-box/fuse-box/issues/1032))
  ([4400985](https://github.com/fuse-box/fuse-box/commit/4400985))
- allowSyntheticDefaultImports is broken
  ([#1063](https://github.com/fuse-box/fuse-box/issues/1063))
  ([a7ed207](https://github.com/fuse-box/fuse-box/commit/a7ed207))
- Corrects updates for HMR updates by pointing to the correct map file
  ([#1037](https://github.com/fuse-box/fuse-box/issues/1037))
  ([e299205](https://github.com/fuse-box/fuse-box/commit/e299205))
- CSS grouping must use require on explicit user package
  ([#1019](https://github.com/fuse-box/fuse-box/issues/1019))
  ([625c2d9](https://github.com/fuse-box/fuse-box/commit/625c2d9))
- CSSDependencyExtractor undefined path check
  ([e4c2096](https://github.com/fuse-box/fuse-box/commit/e4c2096))
- CSSModules fails to retrieve data from cache
  ([#1008](https://github.com/fuse-box/fuse-box/issues/1008))
  ([fee5386](https://github.com/fuse-box/fuse-box/commit/fee5386))
- CSSResourcePlugin breaks source maps
  ([#1058](https://github.com/fuse-box/fuse-box/issues/1058))
  ([ddb70eb](https://github.com/fuse-box/fuse-box/commit/ddb70eb))
- CSSResourcePlugin crashes with "TypeError: Cannot read property 'startsWith'
  of undefined"
  ([edda590](https://github.com/fuse-box/fuse-box/commit/edda590)), closes
  [#1084](https://github.com/fuse-box/fuse-box/issues/1084)
- definition of TSC options
  ([#1065](https://github.com/fuse-box/fuse-box/issues/1065))
  ([4529845](https://github.com/fuse-box/fuse-box/commit/4529845))
- Duplicate slashes cause quantum to fail when resolving modules
  ([f45bf5a](https://github.com/fuse-box/fuse-box/commit/f45bf5a)), closes
  [#1007](https://github.com/fuse-box/fuse-box/issues/1007)
- Electron environment polyfills fs and other server modules
  ([57add76](https://github.com/fuse-box/fuse-box/commit/57add76))
- EnvPlugin doesn't work with target server on development (fixes
  [#1033](https://github.com/fuse-box/fuse-box/issues/1033))
  ([9711567](https://github.com/fuse-box/fuse-box/commit/9711567))
- Fix [#1030](https://github.com/fuse-box/fuse-box/issues/1030)
  (`this !== module.exports`) for Quantum
  ([#1036](https://github.com/fuse-box/fuse-box/issues/1036))
  ([b1c3f1e](https://github.com/fuse-box/fuse-box/commit/b1c3f1e))
- Fix a type in Bundle runner
  ([#1051](https://github.com/fuse-box/fuse-box/issues/1051))
  ([95a1eb0](https://github.com/fuse-box/fuse-box/commit/95a1eb0))
- Fix PostCSSPlugin warning and make it emit sourcemaps
  ([d03a392](https://github.com/fuse-box/fuse-box/commit/d03a392))
- Fixes paths on windows
  ([#1059](https://github.com/fuse-box/fuse-box/issues/1059))
  ([9ee5e86](https://github.com/fuse-box/fuse-box/commit/9ee5e86))
- ImageBase64Plugin spits an error when cache is OFF
  ([#1034](https://github.com/fuse-box/fuse-box/issues/1034))
  ([89c7958](https://github.com/fuse-box/fuse-box/commit/89c7958))
- Maximum call stack when importing with LESS
  ([#1023](https://github.com/fuse-box/fuse-box/issues/1023))
  ([cf55c4c](https://github.com/fuse-box/fuse-box/commit/cf55c4c))
- Quantum is running only once, ignoring watch option
  ([f4d8f5f](https://github.com/fuse-box/fuse-box/commit/f4d8f5f))
- Quantum treeshaking respect double imports of the same file
  ([#1064](https://github.com/fuse-box/fuse-box/issues/1064))
  ([3dfcb1a](https://github.com/fuse-box/fuse-box/commit/3dfcb1a))
- RawPlugin respects CSS dependencies for HMR
  ([#1020](https://github.com/fuse-box/fuse-box/issues/1020))
  ([4f4e367](https://github.com/fuse-box/fuse-box/commit/4f4e367))
- replaced concat-with-sourcemaps to a fixed version
  ([f1cad3f](https://github.com/fuse-box/fuse-box/commit/f1cad3f))
- replaces require variable without arguments
  ([#1047](https://github.com/fuse-box/fuse-box/issues/1047))
  ([7254820](https://github.com/fuse-box/fuse-box/commit/7254820))
- Target electron must include events polyfill
  ([#1038](https://github.com/fuse-box/fuse-box/issues/1038))
  ([83f0058](https://github.com/fuse-box/fuse-box/commit/83f0058))
- tsc function fix on windows
  ([#1061](https://github.com/fuse-box/fuse-box/issues/1061))
  ([c7a7982](https://github.com/fuse-box/fuse-box/commit/c7a7982))
- Typeof null in syntheticDefaultExportPolyfill
  ([610efbb](https://github.com/fuse-box/fuse-box/commit/610efbb))
- WebIndex does not update the bundle hashes on watch mode
  ([9cce9f3](https://github.com/fuse-box/fuse-box/commit/9cce9f3)), closes
  [#1013](https://github.com/fuse-box/fuse-box/issues/1013)

### Features

- allowSyntheticDefaultImports
  ([#1042](https://github.com/fuse-box/fuse-box/issues/1042))
  ([5748434](https://github.com/fuse-box/fuse-box/commit/5748434))
- bake quantum api into multiple bundles
  ([#1086](https://github.com/fuse-box/fuse-box/issues/1086))
  ([c83012f](https://github.com/fuse-box/fuse-box/commit/c83012f))
- Callback function for Sparky.watch
  ([#1056](https://github.com/fuse-box/fuse-box/issues/1056))
  ([fc42064](https://github.com/fuse-box/fuse-box/commit/fc42064))
- Clean CSS optimizer for Quantum
  ([#1054](https://github.com/fuse-box/fuse-box/issues/1054))
  ([1ed2402](https://github.com/fuse-box/fuse-box/commit/1ed2402))
- Inlined CSS source maps and Quantum CSS
  ([#1054](https://github.com/fuse-box/fuse-box/issues/1054))
  ([d36fb71](https://github.com/fuse-box/fuse-box/commit/d36fb71))
- Quantum manifest writes entry points
  ([66b21e4](https://github.com/fuse-box/fuse-box/commit/66b21e4))

<a name="3.0.2"></a>

## [3.0.2](https://github.com/fuse-box/fuse-box/compare/3.0.2...v3.0.2) (2018-01-05)

### Bug Fixes

- Aliasing goes wrong with package.json in folder
  ([#992](https://github.com/fuse-box/fuse-box/issues/992))
  ([0bb44d9](https://github.com/fuse-box/fuse-box/commit/0bb44d9))
- add type to FuseBoxOptions.package
  ([#951](https://github.com/fuse-box/fuse-box/issues/951))
  ([f53bbff](https://github.com/fuse-box/fuse-box/commit/f53bbff))
- Aliases broke Source Maps
  ([#978](https://github.com/fuse-box/fuse-box/issues/978))
  ([ea79910](https://github.com/fuse-box/fuse-box/commit/ea79910))
- BundleProducer overrides NODE_ENV to production
  ([#950](https://github.com/fuse-box/fuse-box/issues/950))
  ([39fc7f8](https://github.com/fuse-box/fuse-box/commit/39fc7f8))
- Bust css cached with PostCSSPlugin
  ([#965](https://github.com/fuse-box/fuse-box/issues/965))
  ([95b9edd](https://github.com/fuse-box/fuse-box/commit/95b9edd))
- Code spliting file integrity tests
  ([3362861](https://github.com/fuse-box/fuse-box/commit/3362861))
- CSSResourcePlugin should not rewrite absolute urls
  ([#975](https://github.com/fuse-box/fuse-box/issues/975))
  ([fcf4f17](https://github.com/fuse-box/fuse-box/commit/fcf4f17))
- Ensure .babelrc options and direct BabelPlugin options are merged together
  ([#920](https://github.com/fuse-box/fuse-box/issues/920))
  ([7aa77f8](https://github.com/fuse-box/fuse-box/commit/7aa77f8))
- Fix aliases in dynamic import statement
  ([9242649](https://github.com/fuse-box/fuse-box/commit/9242649)), closes
  [#943](https://github.com/fuse-box/fuse-box/issues/943)
- Fixed Issue with cached tsconfig language level
  ([efa3ffe](https://github.com/fuse-box/fuse-box/commit/efa3ffe))
- Fixes Quantum splitting but when resources have many dependents
  ([b181121](https://github.com/fuse-box/fuse-box/commit/b181121)), closes
  [#949](https://github.com/fuse-box/fuse-box/issues/949)
- Fixing QuantumBit module movement mechanism
  ([a528c9b](https://github.com/fuse-box/fuse-box/commit/a528c9b))
- Fixing Sparky fuse context
  ([49bd656](https://github.com/fuse-box/fuse-box/commit/49bd656))
- Incorrect dynamic module resolution
  ([#982](https://github.com/fuse-box/fuse-box/issues/982))
  ([2160073](https://github.com/fuse-box/fuse-box/commit/2160073))
- Issue with npm module dependencies being pulled into shared reference
  ([#955](https://github.com/fuse-box/fuse-box/issues/955))
  ([1aa514c](https://github.com/fuse-box/fuse-box/commit/1aa514c))
- LanguageLevel doesn't detect es2015 "const", "let" and "arrow function"
  ([#917](https://github.com/fuse-box/fuse-box/issues/917))
  ([145912c](https://github.com/fuse-box/fuse-box/commit/145912c))
- Modules are not moved to split bundles even the belong there
  ([eb9d36c](https://github.com/fuse-box/fuse-box/commit/eb9d36c))
- Printing fuse version is moved to FuseBox.init
  ([#1000](https://github.com/fuse-box/fuse-box/issues/1000))
  ([c61551e](https://github.com/fuse-box/fuse-box/commit/c61551e))
- Quantum crashed with undefined conditions on the plugin list
  ([3ef03fa](https://github.com/fuse-box/fuse-box/commit/3ef03fa)), closes
  [#939](https://github.com/fuse-box/fuse-box/issues/939)
- Quantum Splitting and node_modules
  ([a093cad](https://github.com/fuse-box/fuse-box/commit/a093cad))
- QuantumBit fixing circular dependency issue
  ([3ab0651](https://github.com/fuse-box/fuse-box/commit/3ab0651))
- related to package.json main directive
  ([#992](https://github.com/fuse-box/fuse-box/issues/992))
  ([071dc57](https://github.com/fuse-box/fuse-box/commit/071dc57))
- ScriptTarget ES-edition to ES-year aliases
  ([#990](https://github.com/fuse-box/fuse-box/issues/990))
  ([#1001](https://github.com/fuse-box/fuse-box/issues/1001))
  ([cba2bec](https://github.com/fuse-box/fuse-box/commit/cba2bec))
- Sparky combined tasks and new colours
  ([51cf154](https://github.com/fuse-box/fuse-box/commit/51cf154))
- Sparky failed to copy sub directories
  ([7fb285d](https://github.com/fuse-box/fuse-box/commit/7fb285d))
- **sparky:** Update watch flow to use user base path
  ([#996](https://github.com/fuse-box/fuse-box/issues/996))
  ([7a878ee](https://github.com/fuse-box/fuse-box/commit/7a878ee)), closes
  [#995](https://github.com/fuse-box/fuse-box/issues/995)
- Sparky log ([48fcf12](https://github.com/fuse-box/fuse-box/commit/48fcf12))
- Sparky shortcut functions lose context
  ([9b29153](https://github.com/fuse-box/fuse-box/commit/9b29153))
- tsc added to Sparky export
  ([31e62c0](https://github.com/fuse-box/fuse-box/commit/31e62c0))

### Features

- Ability to publish typescript sources to npm
  ([91b3a28](https://github.com/fuse-box/fuse-box/commit/91b3a28))
- add `appendBundles`-option to WebIndex-plugin
  ([#942](https://github.com/fuse-box/fuse-box/issues/942))
  ([3668e7a](https://github.com/fuse-box/fuse-box/commit/3668e7a))
- Add fuse helper to Sparky
  ([8315595](https://github.com/fuse-box/fuse-box/commit/8315595))
- Add support for adding prefetch and preload tags.
  ([#987](https://github.com/fuse-box/fuse-box/issues/987))
  ([567f0d8](https://github.com/fuse-box/fuse-box/commit/567f0d8))
- Added a rename function and some documentation
  ([#957](https://github.com/fuse-box/fuse-box/issues/957))
  ([62a2bae](https://github.com/fuse-box/fuse-box/commit/62a2bae))
- Added npmPublish, bumpVersion for Sparky
  ([82f553d](https://github.com/fuse-box/fuse-box/commit/82f553d))
- Added Sparky.exec
  ([ae02e49](https://github.com/fuse-box/fuse-box/commit/ae02e49))
- Adding default sparky context value
  ([d5ba1e1](https://github.com/fuse-box/fuse-box/commit/d5ba1e1))
- allow CSS mask images to be processed with PostCSSResourcePlugin
  ([#925](https://github.com/fuse-box/fuse-box/issues/925))
  ([1f1941d](https://github.com/fuse-box/fuse-box/commit/1f1941d))
- Allow to set root option on postcss-modules
  ([#985](https://github.com/fuse-box/fuse-box/issues/985))
  ([b92de87](https://github.com/fuse-box/fuse-box/commit/b92de87))
- An ability to create context in Sparky
  ([#962](https://github.com/fuse-box/fuse-box/issues/962))
  ([afca694](https://github.com/fuse-box/fuse-box/commit/afca694))
- Ensure Quantum target matches FuseBox.init target
  ([#953](https://github.com/fuse-box/fuse-box/issues/953))
  ([a65ee45](https://github.com/fuse-box/fuse-box/commit/a65ee45))
- EnsureEs5 false in Quantum
  ([44a099c](https://github.com/fuse-box/fuse-box/commit/44a099c))
- Generate tsconfig.json if not found with default values
  ([#952](https://github.com/fuse-box/fuse-box/issues/952))
  ([53a24e7](https://github.com/fuse-box/fuse-box/commit/53a24e7))
- Introducing Quantum noConflictApi option
  ([e819318](https://github.com/fuse-box/fuse-box/commit/e819318)), closes
  [#947](https://github.com/fuse-box/fuse-box/issues/947)
  [#914](https://github.com/fuse-box/fuse-box/issues/914)
- PostCSS added support for .pcss extension
  ([#972](https://github.com/fuse-box/fuse-box/issues/972))
  ([9e4df9b](https://github.com/fuse-box/fuse-box/commit/9e4df9b))
- Responsive target should affect tsconfig and Quantum uglify target
  ([#946](https://github.com/fuse-box/fuse-box/issues/946))
  ([3fb7176](https://github.com/fuse-box/fuse-box/commit/3fb7176))
- sendPageReload and sendPageHMR from fuse.js
  ([#921](https://github.com/fuse-box/fuse-box/issues/921))
  ([6635a10](https://github.com/fuse-box/fuse-box/commit/6635a10))
- Smart code splitting
  ([3b5ba2e](https://github.com/fuse-box/fuse-box/commit/3b5ba2e)), closes
  [#934](https://github.com/fuse-box/fuse-box/issues/934)
  [#926](https://github.com/fuse-box/fuse-box/issues/926)
  [#880](https://github.com/fuse-box/fuse-box/issues/880)
  [#771](https://github.com/fuse-box/fuse-box/issues/771)
  [#933](https://github.com/fuse-box/fuse-box/issues/933)
  [#895](https://github.com/fuse-box/fuse-box/issues/895)
- Smart Code Splitting respect splitConfig option
  ([55bc66b](https://github.com/fuse-box/fuse-box/commit/55bc66b))
- Support HMR of files included through CSS Modules
  [@value](https://github.com/value)
  ([#999](https://github.com/fuse-box/fuse-box/issues/999))
  ([55cfe54](https://github.com/fuse-box/fuse-box/commit/55cfe54))

<a name="2.4.0"></a>

# [2.4.0](https://github.com/fuse-box/fuse-box/compare/v2.3.3...v2.4.0) (2017-10-26)

### Bug Fixes

- Accepts only strings for sourceMaps
  ([#860](https://github.com/fuse-box/fuse-box/issues/860))
  ([65e110f](https://github.com/fuse-box/fuse-box/commit/65e110f))
- Check for frozen object in polyfillNonStandardDefaultUsage
  ([#850](https://github.com/fuse-box/fuse-box/issues/850))
  ([6137026](https://github.com/fuse-box/fuse-box/commit/6137026))
- css plugin doesnt check type before calling generateCorrectSourceMap
  ([#897](https://github.com/fuse-box/fuse-box/issues/897))
  ([2969f66](https://github.com/fuse-box/fuse-box/commit/2969f66))
- Ensure correct path names for last changed file in bundle for
  VueComponentPlugin ([#878](https://github.com/fuse-box/fuse-box/issues/878))
  ([c67cffe](https://github.com/fuse-box/fuse-box/commit/c67cffe))
- Ensures typescript plugin is used when vue lang="ts"
  ([#861](https://github.com/fuse-box/fuse-box/issues/861))
  ([0716e63](https://github.com/fuse-box/fuse-box/commit/0716e63))
- Fixes code splitting issue when Quantum doesn't take path resolver
  ([#867](https://github.com/fuse-box/fuse-box/issues/867))
  ([942e599](https://github.com/fuse-box/fuse-box/commit/942e599))
- Only inject HMR code at end of bundle if a vue file has been processed
  ([#858](https://github.com/fuse-box/fuse-box/issues/858))
  ([1b68718](https://github.com/fuse-box/fuse-box/commit/1b68718))
- WebWorker now works with VanillaAPI
  ([#869](https://github.com/fuse-box/fuse-box/issues/869))
  ([e40ec64](https://github.com/fuse-box/fuse-box/commit/e40ec64))

### Features

- Add CLI API functionality
  ([#892](https://github.com/fuse-box/fuse-box/issues/892))
  ([fcd30fb](https://github.com/fuse-box/fuse-box/commit/fcd30fb))
- Allow path overrides configuration
  ([05a47fb](https://github.com/fuse-box/fuse-box/commit/05a47fb))
- Allow typescript decorators for vue components
  ([#870](https://github.com/fuse-box/fuse-box/issues/870))
  ([18f783e](https://github.com/fuse-box/fuse-box/commit/18f783e))
- Extended Server require with import statements on remote files
  ([#883](https://github.com/fuse-box/fuse-box/issues/883))
  ([12dfc01](https://github.com/fuse-box/fuse-box/commit/12dfc01)), closes
  [#871](https://github.com/fuse-box/fuse-box/issues/871)
- object-rest-spread acorn parser extension
  ([#864](https://github.com/fuse-box/fuse-box/issues/864))
  ([3c7d18e](https://github.com/fuse-box/fuse-box/commit/3c7d18e))
- shimsPath customisation in Quantum
  ([50124ad](https://github.com/fuse-box/fuse-box/commit/50124ad))
- StylusPlugin and CSSDependencyExtractor + Cache
  ([#857](https://github.com/fuse-box/fuse-box/issues/857))
  ([fd024b2](https://github.com/fuse-box/fuse-box/commit/fd024b2))
- Uglify-es support for quantum
  ([#884](https://github.com/fuse-box/fuse-box/issues/884))
  ([7add661](https://github.com/fuse-box/fuse-box/commit/7add661))
- WebIndexPlugin now accepts a template as a string literal
  ([#886](https://github.com/fuse-box/fuse-box/issues/886))
  ([2792c1d](https://github.com/fuse-box/fuse-box/commit/2792c1d))

<a name="2.3.3"></a>

## [2.3.3](https://github.com/fuse-box/fuse-box/compare/v2.3.2...v2.3.3) (2017-10-05)

### Bug Fixes

- Fixes CopyPlugin regression where filenames had js extensions
  ([3745977](https://github.com/fuse-box/fuse-box/commit/3745977))

<a name="2.3.2"></a>

## [2.3.2](https://github.com/fuse-box/fuse-box/compare/v2.3.1...v2.3.2) (2017-10-04)

<a name="2.3.1"></a>

## [2.3.1](https://github.com/fuse-box/fuse-box/compare/v2.2.31...v2.3.1) (2017-10-03)

### Bug Fixes

- check pkg main ([#797](https://github.com/fuse-box/fuse-box/issues/797))
  ([3c219de](https://github.com/fuse-box/fuse-box/commit/3c219de))
- Entry point path failure when resolving at runtime
  ([#823](https://github.com/fuse-box/fuse-box/issues/823))
  ([abd760f](https://github.com/fuse-box/fuse-box/commit/abd760f))
- FuseBox.import and Quantum - unable to remove the record
  ([b5230fb](https://github.com/fuse-box/fuse-box/commit/b5230fb))
- Quantum didn't handle replacement of if else conditions
  ([de1eed3](https://github.com/fuse-box/fuse-box/commit/de1eed3))
- quantum relative package requires
  ([#802](https://github.com/fuse-box/fuse-box/issues/802))
  ([aa11433](https://github.com/fuse-box/fuse-box/commit/aa11433))
- respect log level for cache clear
  ([#830](https://github.com/fuse-box/fuse-box/issues/830))
  ([2d8131f](https://github.com/fuse-box/fuse-box/commit/2d8131f))

### Features

- add language target to control transpilation level
  ([ec41a95](https://github.com/fuse-box/fuse-box/commit/ec41a95))
- expose `package.json` in file info
  ([#782](https://github.com/fuse-box/fuse-box/issues/782))
  ([440dd3e](https://github.com/fuse-box/fuse-box/commit/440dd3e))
- support object rest-spread
  ([#837](https://github.com/fuse-box/fuse-box/issues/837))
  ([e130db2](https://github.com/fuse-box/fuse-box/commit/e130db2))

<a name="2.2.31"></a>

## [2.2.31](https://github.com/fuse-box/fuse-box/compare/v2.2.3...v2.2.31) (2017-09-05)

<a name="2.2.3"></a>

## [2.2.3](https://github.com/fuse-box/fuse-box/compare/v2.2.3-beta.21...v2.2.3) (2017-09-04)

<a name="2.2.3-beta.21"></a>

## [2.2.3-beta.21](https://github.com/fuse-box/fuse-box/compare/v2.2.3-beta.20...v2.2.3-beta.21) (2017-09-03)

<a name="2.2.3-beta.20"></a>

## [2.2.3-beta.20](https://github.com/fuse-box/fuse-box/compare/v2.2.3-beta.19...v2.2.3-beta.20) (2017-09-01)

<a name="2.2.3-beta.19"></a>

## [2.2.3-beta.19](https://github.com/fuse-box/fuse-box/compare/v2.2.3-beta.18...v2.2.3-beta.19) (2017-09-01)

<a name="2.2.3-beta.18"></a>

## [2.2.3-beta.18](https://github.com/fuse-box/fuse-box/compare/v2.2.3-beta.17...v2.2.3-beta.18) (2017-08-30)

<a name="2.2.3-beta.17"></a>

## [2.2.3-beta.17](https://github.com/fuse-box/fuse-box/compare/v2.2.3-beta.16...v2.2.3-beta.17) (2017-08-30)

<a name="2.2.3-beta.16"></a>

## [2.2.3-beta.16](https://github.com/fuse-box/fuse-box/compare/v2.2.3-beta.15...v2.2.3-beta.16) (2017-08-30)

<a name="2.2.3-beta.15"></a>

## [2.2.3-beta.15](https://github.com/fuse-box/fuse-box/compare/v2.2.3-beta.14...v2.2.3-beta.15) (2017-08-30)

<a name="2.2.3-beta.14"></a>

## [2.2.3-beta.14](https://github.com/fuse-box/fuse-box/compare/v2.2.3-beta.13...v2.2.3-beta.14) (2017-08-30)

<a name="2.2.3-beta.13"></a>

## [2.2.3-beta.13](https://github.com/fuse-box/fuse-box/compare/v2.2.3-beta.12...v2.2.3-beta.13) (2017-08-30)

### Features

- **error-logging:** minimize/hide in browser
  ([#759](https://github.com/fuse-box/fuse-box/issues/759))
  ([fa5f9d2](https://github.com/fuse-box/fuse-box/commit/fa5f9d2))

<a name="2.2.3-beta.12"></a>

## [2.2.3-beta.12](https://github.com/fuse-box/fuse-box/compare/v2.2.3-beta.11...v2.2.3-beta.12) (2017-08-28)

<a name="2.2.3-beta.11"></a>

## [2.2.3-beta.11](https://github.com/fuse-box/fuse-box/compare/v2.2.3-beta.10...v2.2.3-beta.11) (2017-08-28)

<a name="2.2.3-beta.10"></a>

## [2.2.3-beta.10](https://github.com/fuse-box/fuse-box/compare/v2.2.3-beta.9...v2.2.3-beta.10) (2017-08-24)

<a name="2.2.3-beta.9"></a>

## [2.2.3-beta.9](https://github.com/fuse-box/fuse-box/compare/v2.2.3-beta.8...v2.2.3-beta.9) (2017-08-24)

<a name="2.2.3-beta.8"></a>

## [2.2.3-beta.8](https://github.com/fuse-box/fuse-box/compare/v2.2.3-beta.7...v2.2.3-beta.8) (2017-08-24)

<a name="2.2.3-beta.7"></a>

## [2.2.3-beta.7](https://github.com/fuse-box/fuse-box/compare/v2.2.3-beta.6...v2.2.3-beta.7) (2017-08-23)

<a name="2.2.3-beta.6"></a>

## [2.2.3-beta.6](https://github.com/fuse-box/fuse-box/compare/v2.2.3-beta.5...v2.2.3-beta.6) (2017-08-18)

<a name="2.2.3-beta.5"></a>

## [2.2.3-beta.5](https://github.com/fuse-box/fuse-box/compare/v2.2.3-beta.4...v2.2.3-beta.5) (2017-08-18)

<a name="2.2.3-beta.4"></a>

## [2.2.3-beta.4](https://github.com/fuse-box/fuse-box/compare/v2.2.3-beta.3...v2.2.3-beta.4) (2017-08-18)

<a name="2.2.3-beta.3"></a>

## [2.2.3-beta.3](https://github.com/fuse-box/fuse-box/compare/v2.2.3-beta.2...v2.2.3-beta.3) (2017-08-17)

<a name="2.2.3-beta.2"></a>

## [2.2.3-beta.2](https://github.com/fuse-box/fuse-box/compare/v2.2.3-beta.1...v2.2.3-beta.2) (2017-08-17)

<a name="2.2.3-beta.1"></a>

## [2.2.3-beta.1](https://github.com/fuse-box/fuse-box/compare/v2.2.2...v2.2.3-beta.1) (2017-08-17)

<a name="2.2.2"></a>

## [2.2.2](https://github.com/fuse-box/fuse-box/compare/v2.2.2-beta.17...v2.2.2) (2017-08-16)

<a name="2.2.2-beta.17"></a>

## [2.2.2-beta.17](https://github.com/fuse-box/fuse-box/compare/v2.2.2-beta.16...v2.2.2-beta.17) (2017-08-16)

<a name="2.2.2-beta.16"></a>

## [2.2.2-beta.16](https://github.com/fuse-box/fuse-box/compare/v2.2.2-beta.15...v2.2.2-beta.16) (2017-08-16)

<a name="2.2.2-beta.15"></a>

## [2.2.2-beta.15](https://github.com/fuse-box/fuse-box/compare/v2.2.2-beta.14...v2.2.2-beta.15) (2017-08-16)

<a name="2.2.2-beta.14"></a>

## [2.2.2-beta.14](https://github.com/fuse-box/fuse-box/compare/v2.2.2-beta.13...v2.2.2-beta.14) (2017-08-14)

<a name="2.2.2-beta.13"></a>

## [2.2.2-beta.13](https://github.com/fuse-box/fuse-box/compare/v2.2.2-beta.12...v2.2.2-beta.13) (2017-08-14)

<a name="2.2.2-beta.12"></a>

## [2.2.2-beta.12](https://github.com/fuse-box/fuse-box/compare/v2.2.2-beta.11...v2.2.2-beta.12) (2017-08-11)

### Features

- centralized error logging for bundles
  ([01f8f21](https://github.com/fuse-box/fuse-box/commit/01f8f21))
- error logging in browser
  ([ea3e5fb](https://github.com/fuse-box/fuse-box/commit/ea3e5fb))

<a name="2.2.2-beta.11"></a>

## [2.2.2-beta.11](https://github.com/fuse-box/fuse-box/compare/v2.2.2-beta.10...v2.2.2-beta.11) (2017-08-09)

<a name="2.2.2-beta.10"></a>

## [2.2.2-beta.10](https://github.com/fuse-box/fuse-box/compare/v2.2.2-beta.9...v2.2.2-beta.10) (2017-08-09)

<a name="2.2.2-beta.9"></a>

## [2.2.2-beta.9](https://github.com/fuse-box/fuse-box/compare/v2.2.2-beta.8...v2.2.2-beta.9) (2017-08-08)

<a name="2.2.2-beta.8"></a>

## [2.2.2-beta.8](https://github.com/fuse-box/fuse-box/compare/v2.2.2-beta.7...v2.2.2-beta.8) (2017-08-08)

<a name="2.2.2-beta.7"></a>

## [2.2.2-beta.7](https://github.com/fuse-box/fuse-box/compare/v2.2.2-beta.6...v2.2.2-beta.7) (2017-08-01)

<a name="2.2.2-beta.6"></a>

## [2.2.2-beta.6](https://github.com/fuse-box/fuse-box/compare/v2.2.2-beta.5...v2.2.2-beta.6) (2017-07-29)

<a name="2.2.2-beta.5"></a>

## [2.2.2-beta.5](https://github.com/fuse-box/fuse-box/compare/v2.2.2-beta.4...v2.2.2-beta.5) (2017-07-29)

<a name="2.2.2-beta.4"></a>

## [2.2.2-beta.4](https://github.com/fuse-box/fuse-box/compare/v2.2.2-beta.3...v2.2.2-beta.4) (2017-07-25)

<a name="2.2.2-beta.3"></a>

## [2.2.2-beta.3](https://github.com/fuse-box/fuse-box/compare/v2.2.2-beta.2...v2.2.2-beta.3) (2017-07-25)

<a name="2.2.2-beta.2"></a>

## [2.2.2-beta.2](https://github.com/fuse-box/fuse-box/compare/v2.2.2-beta.1...v2.2.2-beta.2) (2017-07-24)

<a name="2.2.2-beta.1"></a>

## [2.2.2-beta.1](https://github.com/fuse-box/fuse-box/compare/v2.2.1...v2.2.2-beta.1) (2017-07-24)

<a name="2.2.1"></a>

## [2.2.1](https://github.com/fuse-box/fuse-box/compare/v2.2.1-beta.18...v2.2.1) (2017-07-21)

<a name="2.2.1-beta.18"></a>

## [2.2.1-beta.18](https://github.com/fuse-box/fuse-box/compare/v2.2.1-beta.17...v2.2.1-beta.18) (2017-07-21)

<a name="2.2.1-beta.17"></a>

## [2.2.1-beta.17](https://github.com/fuse-box/fuse-box/compare/v2.2.1-beta.16...v2.2.1-beta.17) (2017-07-21)

<a name="2.2.1-beta.16"></a>

## [2.2.1-beta.16](https://github.com/fuse-box/fuse-box/compare/v2.2.1-beta.15...v2.2.1-beta.16) (2017-07-21)

<a name="2.2.1-beta.15"></a>

## [2.2.1-beta.15](https://github.com/fuse-box/fuse-box/compare/v2.2.1-beta.14...v2.2.1-beta.15) (2017-07-20)

### Bug Fixes

- add missing type import
  ([#678](https://github.com/fuse-box/fuse-box/issues/678))
  ([f3dcedd](https://github.com/fuse-box/fuse-box/commit/f3dcedd))

<a name="2.2.1-beta.14"></a>

## [2.2.1-beta.14](https://github.com/fuse-box/fuse-box/compare/v2.2.1-beta.13...v2.2.1-beta.14) (2017-07-18)

<a name="2.2.1-beta.13"></a>

## [2.2.1-beta.13](https://github.com/fuse-box/fuse-box/compare/v2.2.1-beta.12...v2.2.1-beta.13) (2017-07-18)

<a name="2.2.1-beta.12"></a>

## [2.2.1-beta.12](https://github.com/fuse-box/fuse-box/compare/v2.2.1-beta.11...v2.2.1-beta.12) (2017-07-18)

<a name="2.2.1-beta.11"></a>

## [2.2.1-beta.11](https://github.com/fuse-box/fuse-box/compare/v2.2.1-beta.10...v2.2.1-beta.11) (2017-07-18)

<a name="2.2.1-beta.10"></a>

## [2.2.1-beta.10](https://github.com/fuse-box/fuse-box/compare/v2.2.1-beta.9...v2.2.1-beta.10) (2017-07-18)

<a name="2.2.1-beta.9"></a>

## [2.2.1-beta.9](https://github.com/fuse-box/fuse-box/compare/v2.2.1-beta.8...v2.2.1-beta.9) (2017-07-18)

<a name="2.2.1-beta.8"></a>

## [2.2.1-beta.8](https://github.com/fuse-box/fuse-box/compare/v2.2.1-beta.7...v2.2.1-beta.8) (2017-07-17)

<a name="2.2.1-beta.7"></a>

## [2.2.1-beta.7](https://github.com/fuse-box/fuse-box/compare/v2.2.1-beta.6...v2.2.1-beta.7) (2017-07-17)

<a name="2.2.1-beta.6"></a>

## [2.2.1-beta.6](https://github.com/fuse-box/fuse-box/compare/v2.2.1-beta.5...v2.2.1-beta.6) (2017-07-17)

### Bug Fixes

- fusebox bundle in repl and \_third_party_main
  ([#671](https://github.com/fuse-box/fuse-box/issues/671))
  ([827b64e](https://github.com/fuse-box/fuse-box/commit/827b64e))

<a name="2.2.1-beta.5"></a>

## [2.2.1-beta.5](https://github.com/fuse-box/fuse-box/compare/v2.2.1-beta.4...v2.2.1-beta.5) (2017-07-12)

<a name="2.2.1-beta.4"></a>

## [2.2.1-beta.4](https://github.com/fuse-box/fuse-box/compare/v2.2.1-beta.3...v2.2.1-beta.4) (2017-07-11)

<a name="2.2.1-beta.3"></a>

## [2.2.1-beta.3](https://github.com/fuse-box/fuse-box/compare/v2.2.1-beta.2...v2.2.1-beta.3) (2017-07-10)

<a name="2.2.1-beta.2"></a>

## [2.2.1-beta.2](https://github.com/fuse-box/fuse-box/compare/v2.2.1-beta.1...v2.2.1-beta.2) (2017-07-08)

<a name="2.2.1-beta.1"></a>

## [2.2.1-beta.1](https://github.com/fuse-box/fuse-box/compare/v2.2.0...v2.2.1-beta.1) (2017-07-08)

<a name="2.2.0"></a>

# [2.2.0](https://github.com/fuse-box/fuse-box/compare/v2.2.0-beta.28...v2.2.0) (2017-07-03)

<a name="2.2.0-beta.28"></a>

# [2.2.0-beta.28](https://github.com/fuse-box/fuse-box/compare/v2.2.0-beta.27...v2.2.0-beta.28) (2017-07-03)

<a name="2.2.0-beta.27"></a>

# [2.2.0-beta.27](https://github.com/fuse-box/fuse-box/compare/v2.2.0-beta.26...v2.2.0-beta.27) (2017-07-01)

<a name="2.2.0-beta.26"></a>

# [2.2.0-beta.26](https://github.com/fuse-box/fuse-box/compare/v2.2.0-beta.25...v2.2.0-beta.26) (2017-07-01)

<a name="2.2.0-beta.25"></a>

# [2.2.0-beta.25](https://github.com/fuse-box/fuse-box/compare/v2.2.0-beta.24...v2.2.0-beta.25) (2017-06-28)

<a name="2.2.0-beta.24"></a>

# [2.2.0-beta.24](https://github.com/fuse-box/fuse-box/compare/v2.2.0-beta.23...v2.2.0-beta.24) (2017-06-28)

<a name="2.2.0-beta.23"></a>

# [2.2.0-beta.23](https://github.com/fuse-box/fuse-box/compare/v2.2.0-beta.22...v2.2.0-beta.23) (2017-06-27)

<a name="2.2.0-beta.22"></a>

# [2.2.0-beta.22](https://github.com/fuse-box/fuse-box/compare/v2.2.0-beta.21...v2.2.0-beta.22) (2017-06-27)

<a name="2.2.0-beta.21"></a>

# [2.2.0-beta.21](https://github.com/fuse-box/fuse-box/compare/v2.2.0-beta.20...v2.2.0-beta.21) (2017-06-26)

<a name="2.2.0-beta.20"></a>

# [2.2.0-beta.20](https://github.com/fuse-box/fuse-box/compare/v2.2.0-beta.19...v2.2.0-beta.20) (2017-06-26)

<a name="2.2.0-beta.19"></a>

# [2.2.0-beta.19](https://github.com/fuse-box/fuse-box/compare/v2.2.0-beta.18...v2.2.0-beta.19) (2017-06-26)

<a name="2.2.0-beta.18"></a>

# [2.2.0-beta.18](https://github.com/fuse-box/fuse-box/compare/v2.2.0-beta.17...v2.2.0-beta.18) (2017-06-26)

### Features

- allow traversal plugins to be passed through makeAnalysis
  ([#634](https://github.com/fuse-box/fuse-box/issues/634))
  ([68757f0](https://github.com/fuse-box/fuse-box/commit/68757f0))

<a name="2.2.0-beta.17"></a>

# [2.2.0-beta.17](https://github.com/fuse-box/fuse-box/compare/v2.2.0-beta.16...v2.2.0-beta.17) (2017-06-22)

<a name="2.2.0-beta.16"></a>

# [2.2.0-beta.16](https://github.com/fuse-box/fuse-box/compare/v2.2.0-beta.15...v2.2.0-beta.16) (2017-06-20)

<a name="2.2.0-beta.15"></a>

# [2.2.0-beta.15](https://github.com/fuse-box/fuse-box/compare/v2.2.0-beta.14...v2.2.0-beta.15) (2017-06-20)

<a name="2.2.0-beta.14"></a>

# [2.2.0-beta.14](https://github.com/fuse-box/fuse-box/compare/v2.2.0-beta.13...v2.2.0-beta.14) (2017-06-20)

<a name="2.2.0-beta.13"></a>

# [2.2.0-beta.13](https://github.com/fuse-box/fuse-box/compare/v2.2.0-beta.12...v2.2.0-beta.13) (2017-06-20)

<a name="2.2.0-beta.12"></a>

# [2.2.0-beta.12](https://github.com/fuse-box/fuse-box/compare/v2.2.0-beta.11...v2.2.0-beta.12) (2017-06-19)

<a name="2.2.0-beta.11"></a>

# [2.2.0-beta.11](https://github.com/fuse-box/fuse-box/compare/v2.2.0-beta.10...v2.2.0-beta.11) (2017-06-19)

<a name="2.2.0-beta.10"></a>

# [2.2.0-beta.10](https://github.com/fuse-box/fuse-box/compare/v2.2.0-beta.9...v2.2.0-beta.10) (2017-06-18)

<a name="2.2.0-beta.9"></a>

# [2.2.0-beta.9](https://github.com/fuse-box/fuse-box/compare/v2.2.0-beta.8...v2.2.0-beta.9) (2017-06-18)

<a name="2.2.0-beta.8"></a>

# [2.2.0-beta.8](https://github.com/fuse-box/fuse-box/compare/v2.2.0-beta.7...v2.2.0-beta.8) (2017-06-18)

<a name="2.2.0-beta.7"></a>

# [2.2.0-beta.7](https://github.com/fuse-box/fuse-box/compare/v2.2.0-beta.6...v2.2.0-beta.7) (2017-06-17)

<a name="2.2.0-beta.6"></a>

# [2.2.0-beta.6](https://github.com/fuse-box/fuse-box/compare/v2.2.0-beta.5...v2.2.0-beta.6) (2017-06-17)

<a name="2.2.0-beta.5"></a>

# [2.2.0-beta.5](https://github.com/fuse-box/fuse-box/compare/v2.2.0-beta.4...v2.2.0-beta.5) (2017-06-16)

<a name="2.2.0-beta.4"></a>

# [2.2.0-beta.4](https://github.com/fuse-box/fuse-box/compare/v2.2.0-beta.3...v2.2.0-beta.4) (2017-06-16)

<a name="2.2.0-beta.3"></a>

# [2.2.0-beta.3](https://github.com/fuse-box/fuse-box/compare/v2.2.0-beta.2...v2.2.0-beta.3) (2017-06-16)

<a name="2.2.0-beta.2"></a>

# [2.2.0-beta.2](https://github.com/fuse-box/fuse-box/compare/v2.2.0-beta.1...v2.2.0-beta.2) (2017-06-16)

<a name="2.2.0-beta.1"></a>

# [2.2.0-beta.1](https://github.com/fuse-box/fuse-box/compare/v2.1.0...v2.2.0-beta.1) (2017-06-16)

<a name="2.1.0"></a>

# [2.1.0](https://github.com/fuse-box/fuse-box/compare/v2.1.0-beta.18...v2.1.0) (2017-06-11)

<a name="2.1.0-beta.18"></a>

# [2.1.0-beta.18](https://github.com/fuse-box/fuse-box/compare/v2.1.0-beta.17...v2.1.0-beta.18) (2017-06-11)

<a name="2.1.0-beta.17"></a>

# [2.1.0-beta.17](https://github.com/fuse-box/fuse-box/compare/v2.0.2...v2.1.0-beta.17) (2017-06-08)

<a name="2.0.2"></a>

## [2.0.2](https://github.com/fuse-box/fuse-box/compare/v2.1.0-beta.16...v2.0.2) (2017-06-06)

<a name="2.1.0-beta.16"></a>

# [2.1.0-beta.16](https://github.com/fuse-box/fuse-box/compare/v2.1.0-beta.15...v2.1.0-beta.16) (2017-06-06)

<a name="2.1.0-beta.15"></a>

# [2.1.0-beta.15](https://github.com/fuse-box/fuse-box/compare/v2.1.0-beta.14...v2.1.0-beta.15) (2017-06-06)

<a name="2.1.0-beta.14"></a>

# [2.1.0-beta.14](https://github.com/fuse-box/fuse-box/compare/v2.1.0-beta.13...v2.1.0-beta.14) (2017-06-06)

<a name="2.1.0-beta.13"></a>

# [2.1.0-beta.13](https://github.com/fuse-box/fuse-box/compare/v2.1.0-beta.12...v2.1.0-beta.13) (2017-06-04)

<a name="2.1.0-beta.12"></a>

# [2.1.0-beta.12](https://github.com/fuse-box/fuse-box/compare/v2.1.0-beta.11...v2.1.0-beta.12) (2017-06-04)

<a name="2.1.0-beta.11"></a>

# [2.1.0-beta.11](https://github.com/fuse-box/fuse-box/compare/v2.0.2-beta.1...v2.1.0-beta.11) (2017-06-04)

<a name="2.0.2-beta.1"></a>

## [2.0.2-beta.1](https://github.com/fuse-box/fuse-box/compare/v2.0.12...v2.0.2-beta.1) (2017-06-02)

<a name="2.0.12"></a>

## [2.0.12](https://github.com/fuse-box/fuse-box/compare/v2.0.11...v2.0.12) (2017-05-31)

<a name="2.0.11"></a>

## [2.0.11](https://github.com/fuse-box/fuse-box/compare/v2.0.1...v2.0.11) (2017-05-30)

<a name="2.0.1"></a>

## [2.0.1](https://github.com/fuse-box/fuse-box/compare/v2.1.0-beta.10...v2.0.1) (2017-05-30)

<a name="2.1.0-beta.10"></a>

# [2.1.0-beta.10](https://github.com/fuse-box/fuse-box/compare/v2.1.0-beta.9...v2.1.0-beta.10) (2017-05-23)

<a name="2.1.0-beta.9"></a>

# [2.1.0-beta.9](https://github.com/fuse-box/fuse-box/compare/v2.1.0-beta.8...v2.1.0-beta.9) (2017-05-22)

<a name="2.1.0-beta.8"></a>

# [2.1.0-beta.8](https://github.com/fuse-box/fuse-box/compare/v2.1.0-beta.7...v2.1.0-beta.8) (2017-05-22)

<a name="2.1.0-beta.7"></a>

# [2.1.0-beta.7](https://github.com/fuse-box/fuse-box/compare/v2.1.0-beta.6...v2.1.0-beta.7) (2017-05-21)

<a name="2.1.0-beta.6"></a>

# [2.1.0-beta.6](https://github.com/fuse-box/fuse-box/compare/v2.1.0-beta.5...v2.1.0-beta.6) (2017-05-21)

<a name="2.1.0-beta.5"></a>

# [2.1.0-beta.5](https://github.com/fuse-box/fuse-box/compare/v2.1.0-beta.4...v2.1.0-beta.5) (2017-05-21)

<a name="2.1.0-beta.4"></a>

# [2.1.0-beta.4](https://github.com/fuse-box/fuse-box/compare/v2.1.0-beta.3...v2.1.0-beta.4) (2017-05-18)

<a name="2.1.0-beta.3"></a>

# [2.1.0-beta.3](https://github.com/fuse-box/fuse-box/compare/v2.1.0-beta.2...v2.1.0-beta.3) (2017-05-17)

<a name="2.1.0-beta.2"></a>

# [2.1.0-beta.2](https://github.com/fuse-box/fuse-box/compare/v2.1.0-beta.1...v2.1.0-beta.2) (2017-05-16)

<a name="2.1.0-beta.1"></a>

# [2.1.0-beta.1](https://github.com/fuse-box/fuse-box/compare/v2.0.0...v2.1.0-beta.1) (2017-05-14)

### Bug Fixes

- relative includes requires filename option (pug)
  ([3c4ae38](https://github.com/fuse-box/fuse-box/commit/3c4ae38))

<a name="2.0.0"></a>

# [2.0.0](https://github.com/fuse-box/fuse-box/compare/v2.0.0-beta.23...v2.0.0) (2017-05-10)

<a name="2.0.0-beta.23"></a>

# [2.0.0-beta.23](https://github.com/fuse-box/fuse-box/compare/v2.0.0-beta.22...v2.0.0-beta.23) (2017-05-10)

<a name="2.0.0-beta.22"></a>

# [2.0.0-beta.22](https://github.com/fuse-box/fuse-box/compare/v2.0.0-beta.21...v2.0.0-beta.22) (2017-05-09)

<a name="2.0.0-beta.21"></a>

# [2.0.0-beta.21](https://github.com/fuse-box/fuse-box/compare/v2.0.0-beta.20...v2.0.0-beta.21) (2017-05-09)

<a name="2.0.0-beta.20"></a>

# [2.0.0-beta.20](https://github.com/fuse-box/fuse-box/compare/v2.0.0-beta.19...v2.0.0-beta.20) (2017-05-08)

<a name="2.0.0-beta.19"></a>

# [2.0.0-beta.19](https://github.com/fuse-box/fuse-box/compare/v2.0.0-beta.18...v2.0.0-beta.19) (2017-05-08)

<a name="2.0.0-beta.18"></a>

# [2.0.0-beta.18](https://github.com/fuse-box/fuse-box/compare/v2.0.0-beta.17...v2.0.0-beta.18) (2017-05-08)

<a name="2.0.0-beta.17"></a>

# [2.0.0-beta.17](https://github.com/fuse-box/fuse-box/compare/v2.0.0-beta.16...v2.0.0-beta.17) (2017-05-08)

<a name="2.0.0-beta.16"></a>

# [2.0.0-beta.16](https://github.com/fuse-box/fuse-box/compare/v2.0.0-beta.15...v2.0.0-beta.16) (2017-05-08)

<a name="2.0.0-beta.15"></a>

# [2.0.0-beta.15](https://github.com/fuse-box/fuse-box/compare/v2.0.0-beta.14...v2.0.0-beta.15) (2017-05-07)

<a name="2.0.0-beta.14"></a>

# [2.0.0-beta.14](https://github.com/fuse-box/fuse-box/compare/v2.0.0-beta.13...v2.0.0-beta.14) (2017-05-06)

<a name="2.0.0-beta.13"></a>

# [2.0.0-beta.13](https://github.com/fuse-box/fuse-box/compare/v2.0.0-beta.12...v2.0.0-beta.13) (2017-05-04)

<a name="2.0.0-beta.12"></a>

# [2.0.0-beta.12](https://github.com/fuse-box/fuse-box/compare/v2.0.0-beta.11...v2.0.0-beta.12) (2017-05-03)

<a name="2.0.0-beta.11"></a>

# [2.0.0-beta.11](https://github.com/fuse-box/fuse-box/compare/v2.0.0-beta.10...v2.0.0-beta.11) (2017-05-03)

<a name="2.0.0-beta.10"></a>

# [2.0.0-beta.10](https://github.com/fuse-box/fuse-box/compare/v2.0.0-beta.9...v2.0.0-beta.10) (2017-05-02)

<a name="2.0.0-beta.9"></a>

# [2.0.0-beta.9](https://github.com/fuse-box/fuse-box/compare/v2.0.0-beta.8...v2.0.0-beta.9) (2017-05-01)

<a name="2.0.0-beta.8"></a>

# [2.0.0-beta.8](https://github.com/fuse-box/fuse-box/compare/v2.0.0-beta.7...v2.0.0-beta.8) (2017-04-30)

<a name="2.0.0-beta.7"></a>

# [2.0.0-beta.7](https://github.com/fuse-box/fuse-box/compare/v2.0.0-beta.6...v2.0.0-beta.7) (2017-04-28)

<a name="2.0.0-beta.6"></a>

# [2.0.0-beta.6](https://github.com/fuse-box/fuse-box/compare/v2.0.0-beta.5...v2.0.0-beta.6) (2017-04-27)

<a name="2.0.0-beta.5"></a>

# [2.0.0-beta.5](https://github.com/fuse-box/fuse-box/compare/v2.0.0-beta.4...v2.0.0-beta.5) (2017-04-26)

<a name="2.0.0-beta.4"></a>

# [2.0.0-beta.4](https://github.com/fuse-box/fuse-box/compare/v2.0.0-beta.3...v2.0.0-beta.4) (2017-04-25)

<a name="2.0.0-beta.3"></a>

# [2.0.0-beta.3](https://github.com/fuse-box/fuse-box/compare/v2.0.0-beta.2...v2.0.0-beta.3) (2017-04-25)

<a name="2.0.0-beta.2"></a>

# [2.0.0-beta.2](https://github.com/fuse-box/fuse-box/compare/v2.0.0-beta.1...v2.0.0-beta.2) (2017-04-25)

<a name="2.0.0-beta.1"></a>

# [2.0.0-beta.1](https://github.com/fuse-box/fuse-box/compare/v1.4.1-beta.25...v2.0.0-beta.1) (2017-04-20)

<a name="1.4.1-beta.25"></a>

## [1.4.1-beta.25](https://github.com/fuse-box/fuse-box/compare/v1.4.1-beta.24...v1.4.1-beta.25) (2017-04-19)

<a name="1.4.1-beta.24"></a>

## [1.4.1-beta.24](https://github.com/fuse-box/fuse-box/compare/v1.4.1-beta.23...v1.4.1-beta.24) (2017-04-19)

<a name="1.4.1-beta.23"></a>

## [1.4.1-beta.23](https://github.com/fuse-box/fuse-box/compare/v1.3.131...v1.4.1-beta.23) (2017-04-13)

<a name="1.3.131"></a>

## [1.3.131](https://github.com/fuse-box/fuse-box/compare/v1.4.1-beta.22...v1.3.131) (2017-04-05)

<a name="1.3.130"></a>

## [1.3.130](https://github.com/fuse-box/fuse-box/compare/v1.4.1-beta.21...v1.3.130) (2017-04-02)

<a name="1.4.1-beta.21"></a>

## [1.4.1-beta.21](https://github.com/fuse-box/fuse-box/compare/v1.4.1-beta.20...v1.4.1-beta.21) (2017-03-31)

<a name="1.4.1-beta.20"></a>

## [1.4.1-beta.20](https://github.com/fuse-box/fuse-box/compare/v1.4.1-beta.18...v1.4.1-beta.20) (2017-03-31)

<a name="1.4.1-beta.18"></a>

## [1.4.1-beta.18](https://github.com/fuse-box/fuse-box/compare/v1.4.1-beta.17...v1.4.1-beta.18) (2017-03-29)

<a name="1.4.1-beta.17"></a>

## [1.4.1-beta.17](https://github.com/fuse-box/fuse-box/compare/v1.4.1-beta.16...v1.4.1-beta.17) (2017-03-29)

<a name="1.4.1-beta.16"></a>

## [1.4.1-beta.16](https://github.com/fuse-box/fuse-box/compare/v1.4.1-beta.15...v1.4.1-beta.16) (2017-03-29)

<a name="1.4.1-beta.15"></a>

## [1.4.1-beta.15](https://github.com/fuse-box/fuse-box/compare/v1.4.1-beta.14...v1.4.1-beta.15) (2017-03-29)

<a name="1.4.1-beta.14"></a>

## [1.4.1-beta.14](https://github.com/fuse-box/fuse-box/compare/v1.4.1-beta.13...v1.4.1-beta.14) (2017-03-28)

<a name="1.4.1-beta.13"></a>

## [1.4.1-beta.13](https://github.com/fuse-box/fuse-box/compare/v1.4.1-beta.12...v1.4.1-beta.13) (2017-03-28)

<a name="1.4.1-beta.12"></a>

## [1.4.1-beta.12](https://github.com/fuse-box/fuse-box/compare/v1.4.1-beta.11...v1.4.1-beta.12) (2017-03-28)

<a name="1.4.1-beta.11"></a>

## [1.4.1-beta.11](https://github.com/fuse-box/fuse-box/compare/v1.4.1-beta.10...v1.4.1-beta.11) (2017-03-28)

<a name="1.4.1-beta.10"></a>

## [1.4.1-beta.10](https://github.com/fuse-box/fuse-box/compare/v1.4.1-beta.9...v1.4.1-beta.10) (2017-03-28)

<a name="1.4.1-beta.9"></a>

## [1.4.1-beta.9](https://github.com/fuse-box/fuse-box/compare/v1.4.1-beta.8...v1.4.1-beta.9) (2017-03-28)

<a name="1.4.1-beta.8"></a>

## [1.4.1-beta.8](https://github.com/fuse-box/fuse-box/compare/v1.3.129...v1.4.1-beta.8) (2017-03-28)

<a name="1.3.129"></a>

## [1.3.129](https://github.com/fuse-box/fuse-box/compare/v1.4.1-beta.7...v1.3.129) (2017-03-28)

<a name="1.4.1-beta.7"></a>

## [1.4.1-beta.7](https://github.com/fuse-box/fuse-box/compare/v1.4.1-beta.6...v1.4.1-beta.7) (2017-03-28)

<a name="1.4.1-beta.6"></a>

## [1.4.1-beta.6](https://github.com/fuse-box/fuse-box/compare/v1.4.1-beta.5...v1.4.1-beta.6) (2017-03-28)

<a name="1.4.1-beta.5"></a>

## [1.4.1-beta.5](https://github.com/fuse-box/fuse-box/compare/v1.4.1-beta.4...v1.4.1-beta.5) (2017-03-27)

<a name="1.4.1-beta.4"></a>

## [1.4.1-beta.4](https://github.com/fuse-box/fuse-box/compare/v1.4.1-beta.3...v1.4.1-beta.4) (2017-03-27)

<a name="1.4.1-beta.3"></a>

## [1.4.1-beta.3](https://github.com/fuse-box/fuse-box/compare/v1.4.1-beta.2...v1.4.1-beta.3) (2017-03-27)

<a name="1.4.1-beta.2"></a>

## [1.4.1-beta.2](https://github.com/fuse-box/fuse-box/compare/v1.4.1-beta.1...v1.4.1-beta.2) (2017-03-27)

<a name="1.4.1-beta.1"></a>

## [1.4.1-beta.1](https://github.com/fuse-box/fuse-box/compare/v1.3.128...v1.4.1-beta.1) (2017-03-26)

<a name="1.3.128"></a>

## [1.3.128](https://github.com/fuse-box/fuse-box/compare/v1.3.127...v1.3.128) (2017-03-14)

<a name="1.3.127"></a>

## [1.3.127](https://github.com/fuse-box/fuse-box/compare/v1.3.126...v1.3.127) (2017-03-12)

<a name="1.3.126"></a>

## [1.3.126](https://github.com/fuse-box/fuse-box/compare/v1.3.125...v1.3.126) (2017-03-09)

<a name="1.3.125"></a>

## [1.3.125](https://github.com/fuse-box/fuse-box/compare/v1.3.124...v1.3.125) (2017-03-09)

<a name="1.3.124"></a>

## [1.3.124](https://github.com/fuse-box/fuse-box/compare/v1.3.123...v1.3.124) (2017-03-08)

### Features

- **modules:** `stream` `emitter` `setimmediate` `timers`
  ([b3ffa0e](https://github.com/fuse-box/fuse-box/commit/b3ffa0e))

<a name="1.3.123"></a>

## [1.3.123](https://github.com/fuse-box/fuse-box/compare/v1.3.122...v1.3.123) (2017-03-05)

<a name="1.3.122"></a>

## [1.3.122](https://github.com/fuse-box/fuse-box/compare/v1.3.121...v1.3.122) (2017-02-25)

<a name="1.3.121"></a>

## [1.3.121](https://github.com/fuse-box/fuse-box/compare/v1.3.120...v1.3.121) (2017-02-23)

<a name="1.3.120"></a>

## [1.3.120](https://github.com/fuse-box/fuse-box/compare/v1.3.119...v1.3.120) (2017-02-21)

<a name="1.3.119"></a>

## [1.3.119](https://github.com/fuse-box/fuse-box/compare/v1.3.118...v1.3.119) (2017-02-21)

<a name="1.3.118"></a>

## [1.3.118](https://github.com/fuse-box/fuse-box/compare/v1.3.117...v1.3.118) (2017-02-18)

<a name="1.3.117"></a>

## [1.3.117](https://github.com/fuse-box/fuse-box/compare/v1.3.116...v1.3.117) (2017-02-17)

<a name="1.3.116"></a>

## [1.3.116](https://github.com/fuse-box/fuse-box/compare/v1.3.115...v1.3.116) (2017-02-16)

<a name="1.3.115"></a>

## [1.3.115](https://github.com/fuse-box/fuse-box/compare/v1.3.114...v1.3.115) (2017-02-15)

<a name="1.3.114"></a>

## [1.3.114](https://github.com/fuse-box/fuse-box/compare/v1.3.113...v1.3.114) (2017-02-14)

<a name="1.3.113"></a>

## [1.3.113](https://github.com/fuse-box/fuse-box/compare/v1.3.112...v1.3.113) (2017-02-14)

<a name="1.3.112"></a>

## [1.3.112](https://github.com/fuse-box/fuse-box/compare/v1.3.111...v1.3.112) (2017-02-12)

<a name="1.3.111"></a>

## [1.3.111](https://github.com/fuse-box/fuse-box/compare/v1.3.110...v1.3.111) (2017-02-12)

<a name="1.3.110"></a>

## [1.3.110](https://github.com/fuse-box/fuse-box/compare/v1.3.109...v1.3.110) (2017-02-12)

<a name="1.3.109"></a>

## [1.3.109](https://github.com/fuse-box/fuse-box/compare/v1.3.108...v1.3.109) (2017-02-10)

<a name="1.3.108"></a>

## [1.3.108](https://github.com/fuse-box/fuse-box/compare/v1.3.107...v1.3.108) (2017-02-10)

<a name="1.3.107"></a>

## [1.3.107](https://github.com/fuse-box/fuse-box/compare/v1.3.106...v1.3.107) (2017-02-09)

<a name="1.3.106"></a>

## [1.3.106](https://github.com/fuse-box/fuse-box/compare/v1.3.105...v1.3.106) (2017-02-09)

<a name="1.3.105"></a>

## [1.3.105](https://github.com/fuse-box/fuse-box/compare/v1.3.104...v1.3.105) (2017-02-09)

<a name="1.3.104"></a>

## [1.3.104](https://github.com/fuse-box/fuse-box/compare/v1.3.103...v1.3.104) (2017-02-09)

<a name="1.3.103"></a>

## [1.3.103](https://github.com/fuse-box/fuse-box/compare/v1.3.102...v1.3.103) (2017-02-09)

<a name="1.3.102"></a>

## [1.3.102](https://github.com/fuse-box/fuse-box/compare/v1.3.101...v1.3.102) (2017-02-06)

<a name="1.3.101"></a>

## [1.3.101](https://github.com/fuse-box/fuse-box/compare/v1.3.100...v1.3.101) (2017-02-05)

<a name="1.3.100"></a>

## [1.3.100](https://github.com/fuse-box/fuse-box/compare/v1.3.99...v1.3.100) (2017-02-02)

<a name="1.3.99"></a>

## [1.3.99](https://github.com/fuse-box/fuse-box/compare/v1.3.98...v1.3.99) (2017-02-02)

<a name="1.3.98"></a>

## [1.3.98](https://github.com/fuse-box/fuse-box/compare/v1.3.97...v1.3.98) (2017-02-02)

<a name="1.3.97"></a>

## [1.3.97](https://github.com/fuse-box/fuse-box/compare/v1.3.96...v1.3.97) (2017-02-02)

<a name="1.3.96"></a>

## [1.3.96](https://github.com/fuse-box/fuse-box/compare/v1.3.95...v1.3.96) (2017-02-02)

<a name="1.3.95"></a>

## [1.3.95](https://github.com/fuse-box/fuse-box/compare/v1.3.94...v1.3.95) (2017-02-02)

<a name="1.3.94"></a>

## [1.3.94](https://github.com/fuse-box/fuse-box/compare/v1.3.93...v1.3.94) (2017-02-02)

<a name="1.3.93"></a>

## [1.3.93](https://github.com/fuse-box/fuse-box/compare/v1.3.92...v1.3.93) (2017-02-02)

<a name="1.3.92"></a>

## [1.3.92](https://github.com/fuse-box/fuse-box/compare/v1.3.91...v1.3.92) (2017-02-01)

<a name="1.3.91"></a>

## [1.3.91](https://github.com/fuse-box/fuse-box/compare/v1.3.90...v1.3.91) (2017-02-01)

<a name="1.3.90"></a>

## [1.3.90](https://github.com/fuse-box/fuse-box/compare/v1.3.89...v1.3.90) (2017-02-01)

<a name="1.3.89"></a>

## [1.3.89](https://github.com/fuse-box/fuse-box/compare/v1.3.88...v1.3.89) (2017-01-31)

<a name="1.3.88"></a>

## [1.3.88](https://github.com/fuse-box/fuse-box/compare/v1.3.87...v1.3.88) (2017-01-31)

<a name="1.3.87"></a>

## [1.3.87](https://github.com/fuse-box/fuse-box/compare/v1.3.86...v1.3.87) (2017-01-31)

<a name="1.3.86"></a>

## [1.3.86](https://github.com/fuse-box/fuse-box/compare/v1.3.85...v1.3.86) (2017-01-31)

<a name="1.3.85"></a>

## [1.3.85](https://github.com/fuse-box/fuse-box/compare/v1.3.84...v1.3.85) (2017-01-31)

<a name="1.3.84"></a>

## [1.3.84](https://github.com/fuse-box/fuse-box/compare/v1.3.83...v1.3.84) (2017-01-31)

<a name="1.3.83"></a>

## [1.3.83](https://github.com/fuse-box/fuse-box/compare/v1.3.82...v1.3.83) (2017-01-30)

<a name="1.3.82"></a>

## [1.3.82](https://github.com/fuse-box/fuse-box/compare/v1.3.81...v1.3.82) (2017-01-30)

<a name="1.3.81"></a>

## [1.3.81](https://github.com/fuse-box/fuse-box/compare/v1.3.80...v1.3.81) (2017-01-30)

<a name="1.3.80"></a>

## [1.3.80](https://github.com/fuse-box/fuse-box/compare/v1.3.79...v1.3.80) (2017-01-30)

<a name="1.3.79"></a>

## [1.3.79](https://github.com/fuse-box/fuse-box/compare/v1.3.78...v1.3.79) (2017-01-30)

<a name="1.3.78"></a>

## [1.3.78](https://github.com/fuse-box/fuse-box/compare/v1.3.77...v1.3.78) (2017-01-29)

<a name="1.3.77"></a>

## [1.3.77](https://github.com/fuse-box/fuse-box/compare/v1.3.76...v1.3.77) (2017-01-29)

<a name="1.3.76"></a>

## [1.3.76](https://github.com/fuse-box/fuse-box/compare/v1.3.75...v1.3.76) (2017-01-29)

<a name="1.3.75"></a>

## [1.3.75](https://github.com/fuse-box/fuse-box/compare/v1.3.74...v1.3.75) (2017-01-27)

<a name="1.3.74"></a>

## [1.3.74](https://github.com/fuse-box/fuse-box/compare/v1.3.73...v1.3.74) (2017-01-27)

<a name="1.3.73"></a>

## [1.3.73](https://github.com/fuse-box/fuse-box/compare/v1.3.72...v1.3.73) (2017-01-27)

<a name="1.3.72"></a>

## [1.3.72](https://github.com/fuse-box/fuse-box/compare/v1.3.71...v1.3.72) (2017-01-25)

<a name="1.3.71"></a>

## [1.3.71](https://github.com/fuse-box/fuse-box/compare/v1.3.70...v1.3.71) (2017-01-25)

<a name="1.3.70"></a>

## [1.3.70](https://github.com/fuse-box/fuse-box/compare/v1.3.69...v1.3.70) (2017-01-25)

<a name="1.3.69"></a>

## [1.3.69](https://github.com/fuse-box/fuse-box/compare/v1.3.68...v1.3.69) (2017-01-25)

<a name="1.3.68"></a>

## [1.3.68](https://github.com/fuse-box/fuse-box/compare/v1.3.67...v1.3.68) (2017-01-24)

<a name="1.3.67"></a>

## [1.3.67](https://github.com/fuse-box/fuse-box/compare/v1.3.66...v1.3.67) (2017-01-22)

<a name="1.3.66"></a>

## [1.3.66](https://github.com/fuse-box/fuse-box/compare/v1.3.65...v1.3.66) (2017-01-20)

<a name="1.3.65"></a>

## [1.3.65](https://github.com/fuse-box/fuse-box/compare/v1.3.64...v1.3.65) (2017-01-20)

<a name="1.3.64"></a>

## [1.3.64](https://github.com/fuse-box/fuse-box/compare/v1.3.63...v1.3.64) (2017-01-20)

<a name="1.3.63"></a>

## [1.3.63](https://github.com/fuse-box/fuse-box/compare/v1.3.62...v1.3.63) (2017-01-20)

<a name="1.3.62"></a>

## [1.3.62](https://github.com/fuse-box/fuse-box/compare/v1.3.61...v1.3.62) (2017-01-20)

<a name="1.3.61"></a>

## [1.3.61](https://github.com/fuse-box/fuse-box/compare/v1.3.60...v1.3.61) (2017-01-20)

<a name="1.3.60"></a>

## [1.3.60](https://github.com/fuse-box/fuse-box/compare/v1.3.59...v1.3.60) (2017-01-20)

<a name="1.3.59"></a>

## [1.3.59](https://github.com/fuse-box/fuse-box/compare/v1.3.58...v1.3.59) (2017-01-20)

<a name="1.3.58"></a>

## [1.3.58](https://github.com/fuse-box/fuse-box/compare/v1.3.57...v1.3.58) (2017-01-20)

<a name="1.3.57"></a>

## [1.3.57](https://github.com/fuse-box/fuse-box/compare/v1.3.56...v1.3.57) (2017-01-20)

<a name="1.3.56"></a>

## [1.3.56](https://github.com/fuse-box/fuse-box/compare/v1.3.55...v1.3.56) (2017-01-19)

<a name="1.3.55"></a>

## [1.3.55](https://github.com/fuse-box/fuse-box/compare/v1.3.54...v1.3.55) (2017-01-19)

<a name="1.3.54"></a>

## [1.3.54](https://github.com/fuse-box/fuse-box/compare/v1.3.53...v1.3.54) (2017-01-19)

<a name="1.3.53"></a>

## [1.3.53](https://github.com/fuse-box/fuse-box/compare/v1.3.52...v1.3.53) (2017-01-19)

<a name="1.3.52"></a>

## [1.3.52](https://github.com/fuse-box/fuse-box/compare/v1.3.51...v1.3.52) (2017-01-15)

<a name="1.3.51"></a>

## [1.3.51](https://github.com/fuse-box/fuse-box/compare/v1.3.50...v1.3.51) (2017-01-07)

<a name="1.3.50"></a>

## [1.3.50](https://github.com/fuse-box/fuse-box/compare/v1.3.49...v1.3.50) (2017-01-07)

<a name="1.3.49"></a>

## [1.3.49](https://github.com/fuse-box/fuse-box/compare/v1.3.48...v1.3.49) (2017-01-06)

<a name="1.3.48"></a>

## [1.3.48](https://github.com/fuse-box/fuse-box/compare/v1.3.47...v1.3.48) (2017-01-06)

<a name="1.3.47"></a>

## [1.3.47](https://github.com/fuse-box/fuse-box/compare/v1.3.46...v1.3.47) (2017-01-06)

<a name="1.3.46"></a>

## [1.3.46](https://github.com/fuse-box/fuse-box/compare/v1.3.45...v1.3.46) (2017-01-06)

<a name="1.3.45"></a>

## [1.3.45](https://github.com/fuse-box/fuse-box/compare/v1.3.44...v1.3.45) (2017-01-05)

<a name="1.3.44"></a>

## [1.3.44](https://github.com/fuse-box/fuse-box/compare/v1.3.43...v1.3.44) (2017-01-05)

<a name="1.3.43"></a>

## [1.3.43](https://github.com/fuse-box/fuse-box/compare/v1.3.42...v1.3.43) (2017-01-05)

<a name="1.3.42"></a>

## [1.3.42](https://github.com/fuse-box/fuse-box/compare/v1.3.41...v1.3.42) (2017-01-05)

<a name="1.3.41"></a>

## [1.3.41](https://github.com/fuse-box/fuse-box/compare/v1.3.40...v1.3.41) (2017-01-04)

<a name="1.3.40"></a>

## [1.3.40](https://github.com/fuse-box/fuse-box/compare/v1.3.39...v1.3.40) (2017-01-04)

<a name="1.3.39"></a>

## [1.3.39](https://github.com/fuse-box/fuse-box/compare/v1.3.38...v1.3.39) (2017-01-03)

<a name="1.3.38"></a>

## [1.3.38](https://github.com/fuse-box/fuse-box/compare/v1.3.37...v1.3.38) (2017-01-03)

<a name="1.3.37"></a>

## [1.3.37](https://github.com/fuse-box/fuse-box/compare/v1.3.36...v1.3.37) (2017-01-02)

<a name="1.3.36"></a>

## [1.3.36](https://github.com/fuse-box/fuse-box/compare/v1.3.35...v1.3.36) (2017-01-01)

<a name="1.3.35"></a>

## [1.3.35](https://github.com/fuse-box/fuse-box/compare/v1.3.34...v1.3.35) (2016-12-30)

<a name="1.3.34"></a>

## [1.3.34](https://github.com/fuse-box/fuse-box/compare/v1.3.33...v1.3.34) (2016-12-30)

<a name="1.3.33"></a>

## [1.3.33](https://github.com/fuse-box/fuse-box/compare/v1.3.32...v1.3.33) (2016-12-29)

<a name="1.3.32"></a>

## [1.3.32](https://github.com/fuse-box/fuse-box/compare/v1.3.31...v1.3.32) (2016-12-29)

<a name="1.3.31"></a>

## [1.3.31](https://github.com/fuse-box/fuse-box/compare/v1.3.30...v1.3.31) (2016-12-27)

<a name="1.3.30"></a>

## [1.3.30](https://github.com/fuse-box/fuse-box/compare/v1.3.29...v1.3.30) (2016-12-27)

<a name="1.3.29"></a>

## [1.3.29](https://github.com/fuse-box/fuse-box/compare/v1.3.28...v1.3.29) (2016-12-27)

<a name="1.3.28"></a>

## [1.3.28](https://github.com/fuse-box/fuse-box/compare/v1.3.27...v1.3.28) (2016-12-26)

<a name="1.3.27"></a>

## [1.3.27](https://github.com/fuse-box/fuse-box/compare/v1.3.26...v1.3.27) (2016-12-26)

<a name="1.3.26"></a>

## [1.3.26](https://github.com/fuse-box/fuse-box/compare/v1.3.25...v1.3.26) (2016-12-26)

<a name="1.3.25"></a>

## [1.3.25](https://github.com/fuse-box/fuse-box/compare/v1.3.24...v1.3.25) (2016-12-25)

<a name="1.3.24"></a>

## [1.3.24](https://github.com/fuse-box/fuse-box/compare/v1.3.23...v1.3.24) (2016-12-23)

<a name="1.3.23"></a>

## [1.3.23](https://github.com/fuse-box/fuse-box/compare/v1.3.22...v1.3.23) (2016-12-22)

<a name="1.3.22"></a>

## [1.3.22](https://github.com/fuse-box/fuse-box/compare/v1.3.21...v1.3.22) (2016-12-22)

<a name="1.3.21"></a>

## [1.3.21](https://github.com/fuse-box/fuse-box/compare/v1.3.20...v1.3.21) (2016-12-22)

<a name="1.3.20"></a>

## [1.3.20](https://github.com/fuse-box/fuse-box/compare/v1.3.19...v1.3.20) (2016-12-22)

<a name="1.3.19"></a>

## [1.3.19](https://github.com/fuse-box/fuse-box/compare/v1.3.18...v1.3.19) (2016-12-22)

<a name="1.3.18"></a>

## [1.3.18](https://github.com/fuse-box/fuse-box/compare/v1.3.17...v1.3.18) (2016-12-22)

<a name="1.3.17"></a>

## [1.3.17](https://github.com/fuse-box/fuse-box/compare/v1.3.16...v1.3.17) (2016-12-20)

<a name="1.3.16"></a>

## [1.3.16](https://github.com/fuse-box/fuse-box/compare/v1.3.15...v1.3.16) (2016-12-20)

<a name="1.3.15"></a>

## [1.3.15](https://github.com/fuse-box/fuse-box/compare/v1.3.14...v1.3.15) (2016-12-20)

<a name="1.3.14"></a>

## [1.3.14](https://github.com/fuse-box/fuse-box/compare/v1.3.13...v1.3.14) (2016-12-20)

<a name="1.3.13"></a>

## [1.3.13](https://github.com/fuse-box/fuse-box/compare/v1.3.12...v1.3.13) (2016-12-19)

<a name="1.3.12"></a>

## [1.3.12](https://github.com/fuse-box/fuse-box/compare/v1.3.11...v1.3.12) (2016-12-17)

<a name="1.3.11"></a>

## [1.3.11](https://github.com/fuse-box/fuse-box/compare/v1.2.100...v1.3.11) (2016-12-17)

<a name="1.2.100"></a>

## [1.2.100](https://github.com/fuse-box/fuse-box/compare/v1.2.99...v1.2.100) (2016-12-17)

<a name="1.2.99"></a>

## [1.2.99](https://github.com/fuse-box/fuse-box/compare/v1.2.98...v1.2.99) (2016-12-14)

<a name="1.2.98"></a>

## [1.2.98](https://github.com/fuse-box/fuse-box/compare/v1.2.97...v1.2.98) (2016-12-14)

<a name="1.2.97"></a>

## [1.2.97](https://github.com/fuse-box/fuse-box/compare/v1.2.96...v1.2.97) (2016-12-14)

<a name="1.2.96"></a>

## [1.2.96](https://github.com/fuse-box/fuse-box/compare/v1.2.95...v1.2.96) (2016-12-14)

<a name="1.2.95"></a>

## [1.2.95](https://github.com/fuse-box/fuse-box/compare/v1.2.94...v1.2.95) (2016-12-13)

<a name="1.2.94"></a>

## [1.2.94](https://github.com/fuse-box/fuse-box/compare/v1.2.93...v1.2.94) (2016-12-13)

<a name="1.2.93"></a>

## [1.2.93](https://github.com/fuse-box/fuse-box/compare/v1.2.89...v1.2.93) (2016-12-13)

<a name="1.2.89"></a>

## [1.2.89](https://github.com/fuse-box/fuse-box/compare/v1.2.88...v1.2.89) (2016-12-12)

<a name="1.2.88"></a>

## [1.2.88](https://github.com/fuse-box/fuse-box/compare/v1.2.87...v1.2.88) (2016-12-12)

<a name="1.2.87"></a>

## [1.2.87](https://github.com/fuse-box/fuse-box/compare/v1.2.86...v1.2.87) (2016-12-12)

<a name="1.2.86"></a>

## [1.2.86](https://github.com/fuse-box/fuse-box/compare/v1.2.85...v1.2.86) (2016-12-12)

<a name="1.2.85"></a>

## [1.2.85](https://github.com/fuse-box/fuse-box/compare/v1.2.84...v1.2.85) (2016-12-12)

<a name="1.2.84"></a>

## [1.2.84](https://github.com/fuse-box/fuse-box/compare/v1.2.83...v1.2.84) (2016-12-12)

<a name="1.2.83"></a>

## [1.2.83](https://github.com/fuse-box/fuse-box/compare/v1.2.82...v1.2.83) (2016-12-12)

<a name="1.2.82"></a>

## [1.2.82](https://github.com/fuse-box/fuse-box/compare/v1.2.81...v1.2.82) (2016-12-12)

<a name="1.2.81"></a>

## [1.2.81](https://github.com/fuse-box/fuse-box/compare/v1.2.80...v1.2.81) (2016-12-09)

<a name="1.2.80"></a>

## [1.2.80](https://github.com/fuse-box/fuse-box/compare/v1.2.79...v1.2.80) (2016-12-08)

<a name="1.2.79"></a>

## [1.2.79](https://github.com/fuse-box/fuse-box/compare/v1.2.78...v1.2.79) (2016-12-08)

<a name="1.2.78"></a>

## [1.2.78](https://github.com/fuse-box/fuse-box/compare/v1.2.77...v1.2.78) (2016-12-08)

<a name="1.2.77"></a>

## [1.2.77](https://github.com/fuse-box/fuse-box/compare/v1.2.76...v1.2.77) (2016-12-08)

<a name="1.2.76"></a>

## [1.2.76](https://github.com/fuse-box/fuse-box/compare/v1.2.75...v1.2.76) (2016-12-08)

<a name="1.2.75"></a>

## [1.2.75](https://github.com/fuse-box/fuse-box/compare/v1.2.74...v1.2.75) (2016-12-08)

<a name="1.2.74"></a>

## [1.2.74](https://github.com/fuse-box/fuse-box/compare/v1.2.73...v1.2.74) (2016-12-08)

<a name="1.2.73"></a>

## [1.2.73](https://github.com/fuse-box/fuse-box/compare/v1.2.72...v1.2.73) (2016-12-08)

<a name="1.2.72"></a>

## [1.2.72](https://github.com/fuse-box/fuse-box/compare/v1.2.71...v1.2.72) (2016-12-08)

<a name="1.2.71"></a>

## [1.2.71](https://github.com/fuse-box/fuse-box/compare/v1.2.70...v1.2.71) (2016-12-07)

<a name="1.2.70"></a>

## [1.2.70](https://github.com/fuse-box/fuse-box/compare/v1.2.69...v1.2.70) (2016-12-06)

<a name="1.2.69"></a>

## [1.2.69](https://github.com/fuse-box/fuse-box/compare/v1.2.68...v1.2.69) (2016-12-06)

<a name="1.2.68"></a>

## [1.2.68](https://github.com/fuse-box/fuse-box/compare/v1.2.67...v1.2.68) (2016-12-06)

<a name="1.2.67"></a>

## [1.2.67](https://github.com/fuse-box/fuse-box/compare/v1.2.66...v1.2.67) (2016-12-06)

<a name="1.2.66"></a>

## [1.2.66](https://github.com/fuse-box/fuse-box/compare/v1.2.65...v1.2.66) (2016-12-06)

<a name="1.2.65"></a>

## [1.2.65](https://github.com/fuse-box/fuse-box/compare/v1.2.64...v1.2.65) (2016-12-01)

<a name="1.2.64"></a>

## [1.2.64](https://github.com/fuse-box/fuse-box/compare/v1.2.63...v1.2.64) (2016-12-01)

<a name="1.2.63"></a>

## [1.2.63](https://github.com/fuse-box/fuse-box/compare/v1.2.62...v1.2.63) (2016-11-25)

<a name="1.2.62"></a>

## [1.2.62](https://github.com/fuse-box/fuse-box/compare/v1.2.61...v1.2.62) (2016-11-25)

<a name="1.2.61"></a>

## [1.2.61](https://github.com/fuse-box/fuse-box/compare/v1.2.60...v1.2.61) (2016-11-25)

<a name="1.2.60"></a>

## [1.2.60](https://github.com/fuse-box/fuse-box/compare/v1.2.59...v1.2.60) (2016-11-25)

<a name="1.2.59"></a>

## [1.2.59](https://github.com/fuse-box/fuse-box/compare/v1.2.58...v1.2.59) (2016-11-25)

<a name="1.2.58"></a>

## [1.2.58](https://github.com/fuse-box/fuse-box/compare/v1.2.57...v1.2.58) (2016-11-25)

<a name="1.2.57"></a>

## [1.2.57](https://github.com/fuse-box/fuse-box/compare/v1.2.56...v1.2.57) (2016-11-25)

<a name="1.2.56"></a>

## [1.2.56](https://github.com/fuse-box/fuse-box/compare/v1.2.55...v1.2.56) (2016-11-25)

<a name="1.2.55"></a>

## [1.2.55](https://github.com/fuse-box/fuse-box/compare/v1.2.54...v1.2.55) (2016-11-25)

<a name="1.2.54"></a>

## [1.2.54](https://github.com/fuse-box/fuse-box/compare/v1.2.53...v1.2.54) (2016-11-25)

<a name="1.2.53"></a>

## [1.2.53](https://github.com/fuse-box/fuse-box/compare/v1.2.52...v1.2.53) (2016-11-25)

<a name="1.2.52"></a>

## [1.2.52](https://github.com/fuse-box/fuse-box/compare/v1.2.51...v1.2.52) (2016-11-25)

<a name="1.2.51"></a>

## [1.2.51](https://github.com/fuse-box/fuse-box/compare/v1.2.50...v1.2.51) (2016-11-24)

<a name="1.2.50"></a>

## [1.2.50](https://github.com/fuse-box/fuse-box/compare/v1.2.49...v1.2.50) (2016-11-24)

<a name="1.2.49"></a>

## [1.2.49](https://github.com/fuse-box/fuse-box/compare/v1.2.48...v1.2.49) (2016-11-23)

<a name="1.2.48"></a>

## [1.2.48](https://github.com/fuse-box/fuse-box/compare/v1.2.47...v1.2.48) (2016-11-22)

<a name="1.2.47"></a>

## [1.2.47](https://github.com/fuse-box/fuse-box/compare/v1.2.46...v1.2.47) (2016-11-22)

<a name="1.2.46"></a>

## [1.2.46](https://github.com/fuse-box/fuse-box/compare/v1.2.45...v1.2.46) (2016-11-22)

<a name="1.2.45"></a>

## [1.2.45](https://github.com/fuse-box/fuse-box/compare/v1.2.44...v1.2.45) (2016-11-22)

<a name="1.2.44"></a>

## [1.2.44](https://github.com/fuse-box/fuse-box/compare/v1.2.43...v1.2.44) (2016-11-22)

<a name="1.2.43"></a>

## [1.2.43](https://github.com/fuse-box/fuse-box/compare/v1.2.42...v1.2.43) (2016-11-22)

<a name="1.2.42"></a>

## [1.2.42](https://github.com/fuse-box/fuse-box/compare/v1.2.41...v1.2.42) (2016-11-22)

<a name="1.2.41"></a>

## [1.2.41](https://github.com/fuse-box/fuse-box/compare/v1.2.40...v1.2.41) (2016-11-22)

<a name="1.2.40"></a>

## [1.2.40](https://github.com/fuse-box/fuse-box/compare/v1.2.39...v1.2.40) (2016-11-22)

<a name="1.2.39"></a>

## [1.2.39](https://github.com/fuse-box/fuse-box/compare/v1.2.38...v1.2.39) (2016-11-21)

<a name="1.2.38"></a>

## [1.2.38](https://github.com/fuse-box/fuse-box/compare/v1.2.37...v1.2.38) (2016-11-21)

<a name="1.2.37"></a>

## [1.2.37](https://github.com/fuse-box/fuse-box/compare/v1.2.36...v1.2.37) (2016-11-21)

<a name="1.2.36"></a>

## [1.2.36](https://github.com/fuse-box/fuse-box/compare/v1.2.35...v1.2.36) (2016-11-21)

<a name="1.2.35"></a>

## [1.2.35](https://github.com/fuse-box/fuse-box/compare/v1.2.34...v1.2.35) (2016-11-21)

<a name="1.2.34"></a>

## [1.2.34](https://github.com/fuse-box/fuse-box/compare/v1.2.33...v1.2.34) (2016-11-18)

<a name="1.2.33"></a>

## [1.2.33](https://github.com/fuse-box/fuse-box/compare/v1.2.32...v1.2.33) (2016-11-18)

<a name="1.2.32"></a>

## [1.2.32](https://github.com/fuse-box/fuse-box/compare/v1.2.31...v1.2.32) (2016-11-18)

<a name="1.2.31"></a>

## [1.2.31](https://github.com/fuse-box/fuse-box/compare/v1.2.30...v1.2.31) (2016-11-17)

<a name="1.2.30"></a>

## [1.2.30](https://github.com/fuse-box/fuse-box/compare/v1.2.29...v1.2.30) (2016-11-17)

<a name="1.2.29"></a>

## [1.2.29](https://github.com/fuse-box/fuse-box/compare/v1.2.28...v1.2.29) (2016-11-17)

<a name="1.2.28"></a>

## [1.2.28](https://github.com/fuse-box/fuse-box/compare/v1.2.27...v1.2.28) (2016-11-17)

<a name="1.2.27"></a>

## [1.2.27](https://github.com/fuse-box/fuse-box/compare/v1.2.26...v1.2.27) (2016-11-17)

<a name="1.2.26"></a>

## [1.2.26](https://github.com/fuse-box/fuse-box/compare/v1.2.25...v1.2.26) (2016-11-16)

<a name="1.2.25"></a>

## [1.2.25](https://github.com/fuse-box/fuse-box/compare/v1.2.24...v1.2.25) (2016-11-16)

<a name="1.2.24"></a>

## [1.2.24](https://github.com/fuse-box/fuse-box/compare/v1.2.23...v1.2.24) (2016-11-16)

<a name="1.2.23"></a>

## [1.2.23](https://github.com/fuse-box/fuse-box/compare/v1.2.22...v1.2.23) (2016-11-16)

<a name="1.2.22"></a>

## [1.2.22](https://github.com/fuse-box/fuse-box/compare/v1.2.21...v1.2.22) (2016-11-16)

<a name="1.2.21"></a>

## [1.2.21](https://github.com/fuse-box/fuse-box/compare/v1.2.20...v1.2.21) (2016-11-16)

<a name="1.2.20"></a>

## [1.2.20](https://github.com/fuse-box/fuse-box/compare/v1.2.19...v1.2.20) (2016-11-16)

<a name="1.2.19"></a>

## [1.2.19](https://github.com/fuse-box/fuse-box/compare/v1.2.18...v1.2.19) (2016-11-16)

<a name="1.2.18"></a>

## [1.2.18](https://github.com/fuse-box/fuse-box/compare/v1.2.17...v1.2.18) (2016-11-15)

<a name="1.2.17"></a>

## [1.2.17](https://github.com/fuse-box/fuse-box/compare/v1.2.16...v1.2.17) (2016-11-15)

<a name="1.2.16"></a>

## [1.2.16](https://github.com/fuse-box/fuse-box/compare/v1.2.15...v1.2.16) (2016-11-15)

<a name="1.2.15"></a>

## [1.2.15](https://github.com/fuse-box/fuse-box/compare/v1.2.14...v1.2.15) (2016-11-15)

<a name="1.2.14"></a>

## [1.2.14](https://github.com/fuse-box/fuse-box/compare/v1.2.13...v1.2.14) (2016-11-15)

<a name="1.2.13"></a>

## [1.2.13](https://github.com/fuse-box/fuse-box/compare/v1.2.12...v1.2.13) (2016-11-14)

<a name="1.2.12"></a>

## [1.2.12](https://github.com/fuse-box/fuse-box/compare/v1.2.11...v1.2.12) (2016-11-14)

<a name="1.2.11"></a>

## [1.2.11](https://github.com/fuse-box/fuse-box/compare/v1.1.100...v1.2.11) (2016-11-14)

<a name="1.1.100"></a>

## [1.1.100](https://github.com/fuse-box/fuse-box/compare/v1.1.99...v1.1.100) (2016-11-14)

<a name="1.1.99"></a>

## [1.1.99](https://github.com/fuse-box/fuse-box/compare/v1.1.98...v1.1.99) (2016-11-14)

<a name="1.1.98"></a>

## [1.1.98](https://github.com/fuse-box/fuse-box/compare/v1.1.97...v1.1.98) (2016-11-14)

<a name="1.1.97"></a>

## [1.1.97](https://github.com/fuse-box/fuse-box/compare/v1.1.96...v1.1.97) (2016-11-13)

<a name="1.1.96"></a>

## [1.1.96](https://github.com/fuse-box/fuse-box/compare/v1.1.95...v1.1.96) (2016-11-13)

<a name="1.1.95"></a>

## [1.1.95](https://github.com/fuse-box/fuse-box/compare/v1.1.93...v1.1.95) (2016-11-13)

<a name="1.1.93"></a>

## [1.1.93](https://github.com/fuse-box/fuse-box/compare/v1.1.92...v1.1.93) (2016-11-13)

<a name="1.1.92"></a>

## [1.1.92](https://github.com/fuse-box/fuse-box/compare/v1.1.91...v1.1.92) (2016-11-13)

<a name="1.1.91"></a>

## [1.1.91](https://github.com/fuse-box/fuse-box/compare/v1.1.90...v1.1.91) (2016-11-13)

<a name="1.1.90"></a>

## [1.1.90](https://github.com/fuse-box/fuse-box/compare/v1.1.89...v1.1.90) (2016-11-13)

<a name="1.1.89"></a>

## [1.1.89](https://github.com/fuse-box/fuse-box/compare/v1.1.88...v1.1.89) (2016-11-13)

<a name="1.1.88"></a>

## [1.1.88](https://github.com/fuse-box/fuse-box/compare/v1.1.87...v1.1.88) (2016-11-13)

<a name="1.1.87"></a>

## [1.1.87](https://github.com/fuse-box/fuse-box/compare/v1.1.86...v1.1.87) (2016-11-13)

<a name="1.1.86"></a>

## [1.1.86](https://github.com/fuse-box/fuse-box/compare/v1.1.85...v1.1.86) (2016-11-13)

<a name="1.1.85"></a>

## [1.1.85](https://github.com/fuse-box/fuse-box/compare/v1.1.84...v1.1.85) (2016-11-13)

<a name="1.1.84"></a>

## [1.1.84](https://github.com/fuse-box/fuse-box/compare/v1.1.83...v1.1.84) (2016-11-13)

<a name="1.1.83"></a>

## [1.1.83](https://github.com/fuse-box/fuse-box/compare/v1.1.82...v1.1.83) (2016-11-13)

<a name="1.1.82"></a>

## [1.1.82](https://github.com/fuse-box/fuse-box/compare/v1.1.81...v1.1.82) (2016-11-13)

<a name="1.1.81"></a>

## [1.1.81](https://github.com/fuse-box/fuse-box/compare/v1.1.80...v1.1.81) (2016-11-13)

<a name="1.1.80"></a>

## [1.1.80](https://github.com/fuse-box/fuse-box/compare/v1.1.79...v1.1.80) (2016-11-11)

<a name="1.1.79"></a>

## [1.1.79](https://github.com/fuse-box/fuse-box/compare/v1.1.78...v1.1.79) (2016-11-11)

<a name="1.1.78"></a>

## [1.1.78](https://github.com/fuse-box/fuse-box/compare/v1.1.77...v1.1.78) (2016-11-08)

<a name="1.1.77"></a>

## [1.1.77](https://github.com/fuse-box/fuse-box/compare/v1.1.76...v1.1.77) (2016-11-04)

<a name="1.1.76"></a>

## [1.1.76](https://github.com/fuse-box/fuse-box/compare/v1.1.75...v1.1.76) (2016-11-01)

<a name="1.1.75"></a>

## [1.1.75](https://github.com/fuse-box/fuse-box/compare/v1.1.74...v1.1.75) (2016-11-01)

<a name="1.1.74"></a>

## [1.1.74](https://github.com/fuse-box/fuse-box/compare/v1.1.73...v1.1.74) (2016-10-31)

<a name="1.1.73"></a>

## [1.1.73](https://github.com/fuse-box/fuse-box/compare/v1.1.72...v1.1.73) (2016-10-31)

<a name="1.1.72"></a>

## [1.1.72](https://github.com/fuse-box/fuse-box/compare/v1.1.71...v1.1.72) (2016-10-31)

<a name="1.1.71"></a>

## [1.1.71](https://github.com/fuse-box/fuse-box/compare/v1.1.70...v1.1.71) (2016-10-31)

<a name="1.1.70"></a>

## [1.1.70](https://github.com/fuse-box/fuse-box/compare/v1.1.69...v1.1.70) (2016-10-31)

<a name="1.1.69"></a>

## [1.1.69](https://github.com/fuse-box/fuse-box/compare/v1.1.68...v1.1.69) (2016-10-31)

<a name="1.1.68"></a>

## [1.1.68](https://github.com/fuse-box/fuse-box/compare/v1.1.67...v1.1.68) (2016-10-31)

<a name="1.1.67"></a>

## [1.1.67](https://github.com/fuse-box/fuse-box/compare/v1.1.66...v1.1.67) (2016-10-31)

<a name="1.1.66"></a>

## [1.1.66](https://github.com/fuse-box/fuse-box/compare/v1.1.65...v1.1.66) (2016-10-30)

<a name="1.1.65"></a>

## [1.1.65](https://github.com/fuse-box/fuse-box/compare/v1.1.64...v1.1.65) (2016-10-30)

<a name="1.1.64"></a>

## [1.1.64](https://github.com/fuse-box/fuse-box/compare/v1.1.63...v1.1.64) (2016-10-29)

<a name="1.1.63"></a>

## [1.1.63](https://github.com/fuse-box/fuse-box/compare/v1.1.62...v1.1.63) (2016-10-29)

<a name="1.1.62"></a>

## [1.1.62](https://github.com/fuse-box/fuse-box/compare/v1.1.61...v1.1.62) (2016-10-29)

<a name="1.1.61"></a>

## [1.1.61](https://github.com/fuse-box/fuse-box/compare/v1.1.60...v1.1.61) (2016-10-29)

<a name="1.1.60"></a>

## [1.1.60](https://github.com/fuse-box/fuse-box/compare/v1.1.59...v1.1.60) (2016-10-29)

<a name="1.1.59"></a>

## [1.1.59](https://github.com/fuse-box/fuse-box/compare/v1.1.58...v1.1.59) (2016-10-29)

<a name="1.1.58"></a>

## [1.1.58](https://github.com/fuse-box/fuse-box/compare/v1.1.57...v1.1.58) (2016-10-29)

<a name="1.1.57"></a>

## [1.1.57](https://github.com/fuse-box/fuse-box/compare/v1.1.56...v1.1.57) (2016-10-29)

<a name="1.1.56"></a>

## [1.1.56](https://github.com/fuse-box/fuse-box/compare/v1.1.55...v1.1.56) (2016-10-29)

<a name="1.1.55"></a>

## [1.1.55](https://github.com/fuse-box/fuse-box/compare/v1.1.54...v1.1.55) (2016-10-28)

<a name="1.1.54"></a>

## 1.1.54 (2016-10-28)
