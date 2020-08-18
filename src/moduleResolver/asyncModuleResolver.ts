import { ImportType } from '../compiler/interfaces/ImportType';
import { Context } from '../core/context';
import { env } from '../env';
import { resolveModule } from '../resolver/resolver';
import { fileExists, getPublicPath, readFileAsync } from '../utils/utils';
import { createBundleContext, IBundleContext } from './bundleContext';
import { createModule, IModule } from './module';
import { getModuleResolutionPaths } from './moduleResolutionPaths';
import { PackageType, createPackage, IPackage } from './package';

export interface IModuleResolver {
  bundleContext: IBundleContext;
  entries: Array<IModule>;
  modules: Array<IModule>;
}

export interface IRelativeResolve {
  errored?: boolean;
  ignore?: boolean;
  module?: IModule;
}
export async function asyncModuleResolver(ctx: Context, entryFiles: Array<string>): Promise<IModuleResolver> {
  const entries: Array<IModule> = [];
  const bundleContext = createBundleContext(ctx);
  ctx.bundleContext = bundleContext;
  const userPackage = createPackage({ type: PackageType.USER_PACKAGE });
  bundleContext.setPackage(userPackage);

  const config = ctx.config;
  const compilerOptions = ctx.compilerOptions;
  const buildEnv = compilerOptions.buildEnv;
  if (!buildEnv.entries) buildEnv.entries = [];
  ctx.compilerHub.launch();

  /**
   * Gives an absolute path and a package
   * @param props
   */
  function resolveToAbsPath(props: { importType: ImportType; parent: IModule; statement: string }) {
    const { parent } = props;
    const resolved = resolveModule({
      alias: config.alias,
      buildTarget: config.target,
      cachePaths: !env.isTest, // should be always on, since that's the internal caching
      electronNodeIntegration: config.electron.nodeIntegration,
      filePath: props.parent.absPath,
      importType: props.importType,
      isDev: config.isDevelopment,
      javascriptFirst: props.parent.isJavaScript,
      modules: config.modules,
      packageMeta: parent.pkg && parent.pkg.meta,
      target: props.statement,
      tsTargetResolver: ctx.tsTargetResolver,
      typescriptPaths: getModuleResolutionPaths({ module: parent }),
    });

    if (!resolved || (resolved && resolved.error)) return { errored: true };
    if (resolved.skip || resolved.isExternal) return { ignore: true };
    if (resolved.tsConfigAtPath) ctx.tsConfigAtPaths.push(resolved.tsConfigAtPath);
    let absPath;
    if (resolved.package) {
      absPath = resolved.package.targetAbsPath;

      if (config.shouldIgnoreDependency(resolved.package)) {
        return { ignore: true };
      }
      let pkg = bundleContext.getPackage(resolved.package.meta);

      const pkgType = resolved.package.isUserOwned ? PackageType.USER_PACKAGE : PackageType.EXTERNAL_PACKAGE;

      if (!pkg) {
        pkg = createPackage({ meta: resolved.package.meta, type: pkgType });
        bundleContext.setPackage(pkg);
      }
      return { absPath, pkg };
    } else {
      return { absPath: resolved.absPath, pkg: parent.pkg };
    }
  }
  /**
   * KIcks off the entire process
   * @param absPath
   * @param pkg
   */
  async function resolveEntry(absPath: string, pkg: IPackage): Promise<IModule> {
    /**
     * Recursive function
     * @param absPath
     * @param pkg
     */
    async function initModule(initModuleProps: {
      absPath: string;
      isEntry?: boolean;
      pkg: IPackage;
    }): Promise<IModule> {
      const { absPath, isEntry, pkg } = initModuleProps;

      let module: IModule = bundleContext.modules[absPath];
      if (module) {
        return module;
      }

      ctx.log.info('init', '<dim>$absPath</dim>', { absPath: getPublicPath(absPath) });

      if (bundleContext.cache) {
        const cached = bundleContext.tryCache(absPath);
        if (cached) {
          if (cached.mrc.modulesRequireResolution.length) {
            for (const item of cached.mrc.modulesRequireResolution) {
              if (item.absPath !== absPath) {
                bundleContext.modules[item.absPath] = undefined;

                await initModule({ absPath: item.absPath, pkg: item.pkg });
              }
            }
          }
          if (cached.module) {
            return cached.module;
          }
        }
      }

      module = createModule({ absPath, ctx, pkg });

      module.init();
      module.id = bundleContext.getIdFor(absPath);

      if (isEntry) {
        module.isEntry = true;
        if (!buildEnv.entries.includes(module.id)) buildEnv.entries.push(module.id);
      }
      bundleContext.setModule(module);

      // this function can resolve any module relative to this file
      // It can be used by other plugins

      async function relativeResolve(props: { importType?: ImportType; statement: string }): Promise<IRelativeResolve> {
        const resolved = resolveToAbsPath({
          importType: props.importType || ImportType.REQUIRE,
          parent: module,
          statement: props.statement,
        });
        if (resolved.absPath) {
          const target = await initModule({ absPath: resolved.absPath, pkg: resolved.pkg });
          const parentDeps = module.dependencies;
          if (!parentDeps.includes(target.id)) parentDeps.push(target.id);
          return { module: target };
        }
        return resolved;
      }

      const pending = [];
      module.resolve = (props: { importType?: ImportType; statement: string }) => {
        const data = relativeResolve(props);
        pending.push(data);
        return data;
      };

      if (isEntry) {
        for (const userDependency of ctx.config.dependencies.include) {
          await module.resolve({ statement: userDependency });
        }
        ctx.ict.sync('entry_resolve', { module });
      }

      ctx.ict.sync('module_init', { bundleContext, module });
      if (typeof module.contents === 'undefined') {
        module.contents = await readFileAsync(module.absPath);
      }
      if (module.isExecutable) {
        return new Promise((resolve, reject) => {
          ctx.compilerHub.compile({
            absPath: module.absPath,
            contents: module.contents,
            context: module.getTransformationContext(),
            generateCode: ctx.config.isDevelopment,
            onError: message => {
              module.errored = true;
              ctx.log.warn(message);
            },
            onFatal: e => {
              ctx.fatal('Error while compiling a module', [module.absPath, e.stack || e]);
            },
            onReady: response => {
              if (ctx.config.isDevelopment) {
                module.contents = response.contents;
                module.sourceMap = response.sourceMap;
              }

              Promise.all(pending).then(() => {
                ctx.log.info('compiler', `Completed ${module.publicPath}`);
                resolve(module);
              });
            },
            onResolve: async data => {
              const requestedModule = await relativeResolve({ statement: data.source, importType: data.importType });
              let response: any = {};

              if (requestedModule.module) {
                response.id = requestedModule.module.id;
                module.moduleSourceRefs[data.source] = requestedModule.module;
              } else {
                if (requestedModule.errored) {
                  ctx.log.warn(`Error while resolving ${data.source} in ${module.publicPath}`);
                  module.errored = true;
                }
                response.ignore = requestedModule.ignore;
                response.errored = requestedModule.errored;
              }
              return response;
            },
          });
        });
      }

      await Promise.all(pending);

      return module;
    }

    return initModule({ absPath, isEntry: true, pkg });
  }

  for (const absPath of entryFiles) {
    if (!fileExists(absPath)) {
      ctx.fatal("Entry point doesn't exist", [
        absPath,
        'Entry point path must be absolute or relative to the fuse file',
      ]);
    }

    const entryModule = await resolveEntry(absPath, userPackage);
    entries.push(entryModule);
  }
  ctx.compilerHub.terminate();

  if (process.argv.includes('--debug-cache')) {
    ctx.log.line();

    ctx.log.echo('<yellow><bold> Cache overview: </bold></yellow>');
    ctx.log.line();
    for (const absPath in bundleContext.modules) {
      const module = bundleContext.modules[absPath];

      if (module.isCached) {
        ctx.log.echo('<dim> [cache]: restored $file</dim>', { file: module.absPath });
      } else {
        ctx.log.echo('<dim> [cache]:</dim> <bgGreen><black> busted </black> </bgGreen> <yellow>$file</yellow>', {
          file: module.absPath,
        });
      }
    }
  }

  return { bundleContext, entries, modules: Object.values(bundleContext.modules) };
}
