declare const __build_env: {
  // REference to runtime cached modules __fuse.c
  cachedModules: Record<string, any>;
  // an array of application entries
  entries: Array<number>;
  // internal require function (available at runtime __fuse.r)
  require: (id: number) => any;

  hmrModuleId?: number;
};
