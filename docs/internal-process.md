### internal steps

#### bundle step (1)
- bundle(config) is called
  - if config is an object, internally it instantiate a new FuseBox instance for each property.
  - if it is a string, it will instantiate one FuseBox instance.
  - each instance's constructor will
    - initiate a cache for a context
    -
- [workflow context][src-workflow-context] is reset
- [preBundle](#preBundle) is triggered
- [shims](#shimming) are added
- [bundleStart](#bundleStart) is triggered
- [Arithmetics][src-arithmetic] are parsed

#### process step (2)
- [modules are collected (moduleCollection)][src-module-collection-collectmodules]
- [paths are resolved][src-path-master]
- [.collectBundle (bundleCollection)][src-module-collection-collectbundle]
  - [plugins init is called][#init]
  - [the collections are logged][src-log] (you will see this in the console as `└──`)
  - bundleCollection.transformGroups is called
    - fileGroups are looped
      - nested dependencies all grouped into one promise array to flatten
      - if they are cached & cache is enabled, the cache is used
      - otherwise resolveNodeModule is called: .resolveNodeModule -> resolve()
        - checks whether they should be bundled, or excluded
        - checks for any conflictingVersions

[src-module-collection-collectmodules]: (https://github.com/fuse-box/fuse-box/tree/master/src/ModuleCollection.ts)
[src-module-collection-collectbundle]: (https://github.com/fuse-box/fuse-box/tree/master/src/ModuleCollection.ts)

[src-log]: https://github.com/fuse-box/fuse-box/blob/master/src/Log.ts
[src-file]: https://github.com/fuse-box/fuse-box/blob/master/src/core/File.ts
[src-path-master]: (https://github.com/fuse-box/fuse-box/tree/master/src/PathMaster.ts)
[src-workflow-context]: (https://github.com/fuse-box/fuse-box/tree/master/src/WorkFlowContext.ts)
[src-arithmetic]: (https://github.com/fuse-box/fuse-box/tree/master/src/WorkFlowContext.ts)
