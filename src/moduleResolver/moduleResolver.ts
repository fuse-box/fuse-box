import { BUNDLE_RUNTIME_NAMES } from '../bundleRuntime/bundleRuntimeCore';
import { ASTNode } from '../compiler/interfaces/AST';
import { ITransformerRequireStatement } from '../compiler/interfaces/ITransformerRequireStatements';
import { ImportType } from '../compiler/interfaces/ImportType';
import { Context } from '../core/context';
import { env } from '../env';
import { resolveModule } from '../resolver/resolver';
import { fileExists, getPublicPath } from '../utils/utils';
import { createBundleContext, IBundleContext } from './bundleContext';
import { createModule, IModule } from './module';
import { getModuleResolutionPaths } from './moduleResolutionPaths';
import { PackageType, createPackage, IPackage } from './package';

export function createRuntimeRequireStatement(props: {
  ctx: Context;
  item: ITransformerRequireStatement;
  module: IModule;
}): ASTNode {
  let requireModuleId: number | string = 'error';
  const { ctx, item, module } = props;
  const log = ctx.log;

  const isServer = ctx.config.target === 'server';
  // no value.. import() or require();
  if (!item.statement.arguments[0]) {
    module.errored = true;
    log.warn(`Empty require detected in ${module.publicPath}`, item.statement);
  }

  if (item.statement.arguments.length === 1) {
    /**
     * regular import rewrite
     * require('./x');
     */
    const source = item.statement.arguments[0].value;
    if (module.moduleSourceRefs[source]) {
      requireModuleId = module.moduleSourceRefs[source].id;
    } else {
      // we're importing some weird stuff... require(1) ie.
      if (typeof source !== 'string') {
        log.warn(`Invalid import "${source}" in ${module.publicPath}`, { statement: item.statement });
        module.errored = true;
      }
      // don't convert it and let the user figure it out
      requireModuleId = source;
    }
  } else {
    /**
     * computed statement import
     * require('./x' + b);
     */
    if (!isServer) {
      log.warn(`Unsupported require detected in ${module.publicPath}`, item.statement);
      requireModuleId = 'unsupported';
      module.errored = true;
    }
  }
  // prevert require for production to matter what
  if (ctx.config.target === 'server' && typeof requireModuleId !== 'number') return item.statement;

  item.statement.callee.name = BUNDLE_RUNTIME_NAMES.ARG_REQUIRE_FUNCTION;
  item.statement.arguments = [
    {
      type: 'Literal',
      value: requireModuleId,
    },
  ];
  return item.statement;
}

export function resolve(props: {
  bundleContext: IBundleContext;
  ctx: Context;
  importType: ImportType;
  parent: IModule;
  statement: string;
}) {
  const config = props.ctx.config;

  const { bundleContext, ctx, parent } = props;
  const resolved = resolveModule({
    alias: config.alias,
    buildTarget: config.target,
    cachePaths: !env.isTest, // should be always on, since that's the internal caching
    filePath: props.parent.absPath,
    homeDir: config.homeDir,
    importType: props.importType,
    isDev: props.ctx.config.isDevelopment,
    javascriptFirst: props.parent.isJavaScript,
    modules: config.modules,
    packageMeta: parent.pkg && parent.pkg.meta,
    target: props.statement,
    typescriptPaths: getModuleResolutionPaths({ module: parent }),
  });

  if (!resolved || (resolved && resolved.error)) return;
  if (resolved.skip || resolved.isExternal) return;
  if (resolved.tsConfigAtPath) ctx.tsConfigAtPaths.push(resolved.tsConfigAtPath);

  let absPath;
  let module: IModule;
  if (resolved.package) {
    absPath = resolved.package.targetAbsPath;

    if (config.shouldIgnoreDependency(resolved.package.meta.name)) {
      return;
    }

    let pkg = bundleContext.getPackage(resolved.package.meta);

    if (!pkg) {
      pkg = createPackage({ meta: resolved.package.meta, type: PackageType.EXTERNAL_PACKAGE });
      bundleContext.setPackage(pkg);
    }
    module = initModule({ absPath, bundleContext, ctx, pkg });
  } else {
    module = initModule({ absPath: resolved.absPath, bundleContext, ctx, pkg: parent.pkg });
  }
  if (module) {
    const parentDeps = props.parent.dependencies;
    if (!parentDeps.includes(module.id)) parentDeps.push(module.id);
  }

  return module;
}

export function addModule(ctx: Context, absPath: string) {}

export function initModule(props: {
  absPath: string;
  bundleContext: IBundleContext;
  ctx: Context;
  isEntry?: boolean;
  pkg?: IPackage;
}) {
  const { absPath, bundleContext, ctx, pkg } = props;
  let module = bundleContext.getModule(absPath);
  const compilerOptions = ctx.compilerOptions;
  function init(pkg, absPath) {
    if (bundleContext.modules[absPath]) return bundleContext.modules[absPath];

    ctx.log.info('init', '<dim>$absPath</dim>', { absPath: getPublicPath(absPath) });

    const module = createModule({ absPath, ctx, pkg });
    module.init();

    // generate next id
    module.id = bundleContext.getIdFor(absPath);
    if (props.isEntry) {
      module.isEntry = true;
      if (!compilerOptions.buildEnv.entries) compilerOptions.buildEnv.entries = [];
      compilerOptions.buildEnv.entries.push(module.id);
      ctx.ict.sync('entry_resolve', { module });
    }
    // storing for further references (and avoid recursion)
    bundleContext.setModule(module);
    // reading and parsing the contents
    module.read();

    ctx.ict.sync('module_init', { bundleContext, module });

    if (module.isExecutable) {
      module.parse();
      const transformerResult = module.transpile();

      for (const item of transformerResult.requireStatementCollection) {
        if (item.statement.arguments.length === 1 && typeof item.statement.arguments[0].value === 'string') {
          const source = item.statement.arguments[0].value;
          const resolvedModule = resolve({
            bundleContext,
            ctx,
            importType: item.importType,
            parent: module,
            statement: source,
          });
          if (resolvedModule) {
            // extra instructions from the resolver
            // for example to break cache when a module has been modified
            if (item.moduleOptions) {
              for (const moduleField in item.moduleOptions) {
                resolvedModule[moduleField] = item.moduleOptions[moduleField];
              }
            }
            module.moduleSourceRefs[source] = resolvedModule;
            // rewrite statement because we have a resolvedModule
          } else {
            module.errored = true;
            ctx.log.warn('Unresolved statement $source in $file', {
              file: module.absPath,
              source: source,
            });
          }
          item.statement = createRuntimeRequireStatement({ ctx, item, module });
        } else {
          // other possible options
          continue;
        }
      }
      if (ctx.config.isDevelopment) module.generate();
    }
    return module;
  }
  if (module) return module;

  if (bundleContext.cache) {
    const cached = bundleContext.tryCache(absPath);
    if (cached) {
      if (cached.mrc.modulesRequireResolution.length) {
        for (const item of cached.mrc.modulesRequireResolution) {
          bundleContext.modules[item.absPath] = undefined;
          init(item.pkg, item.absPath);
        }
      }
      if (cached.module) return cached.module;
    }

    return init(pkg, absPath);
  }
  return init(pkg, absPath);
}

export interface IModuleResolver {
  bundleContext: IBundleContext;
  entries: Array<IModule>;
  modules: Array<IModule>;
}

function addExtraDepednencies(props: { bundleContext: IBundleContext; ctx: Context; entryModule: IModule }) {
  const { bundleContext, ctx, entryModule } = props;
  for (const statement of ctx.config.dependencies.include) {
    const targetModule = resolve({
      bundleContext,
      ctx,
      importType: ImportType.RAW_IMPORT,
      parent: entryModule,
      statement,
    });
    // when a plugin injects dependencies it will most likely want to have the reference
    // the easiest way is to store them to the bundle context for later retrieval
    bundleContext.injectedDependencies[statement] = targetModule;
  }
}

export function ModuleResolver(ctx: Context, entryFiles: Array<string>): IModuleResolver {
  const entries = [];
  const bundleContext = createBundleContext(ctx);
  ctx.bundleContext = bundleContext;
  const userPackage = createPackage({ type: PackageType.USER_PACKAGE });
  bundleContext.setPackage(userPackage);

  let shouldAddExtraDependencies = ctx.config.dependencies.include.length > 0;
  for (const absPath of entryFiles) {
    if (!fileExists(absPath)) {
      ctx.fatal("Entry point doesn't exist", [
        absPath,
        'Entry point path must be absolute or relative to the fuse file',
      ]);
    }
    const entryModule = initModule({ absPath, bundleContext, ctx, isEntry: true, pkg: userPackage });

    if (shouldAddExtraDependencies) {
      // add them only once to the first entry module
      shouldAddExtraDependencies = false;
      addExtraDepednencies({ bundleContext, ctx, entryModule });
    }

    entries.push(entryModule);
  }

  if (process.argv.includes('--debug-cache')) {
    ctx.log.line();

    ctx.log.echo('<yellow><bold> Cache overview: </bold></yellow>');
    ctx.log.line();
    for (const absPath in bundleContext.modules) {
      const module = bundleContext.modules[absPath];
      //if (!module.isCached) {

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
