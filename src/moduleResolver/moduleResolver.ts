import { BUNDLE_RUNTIME_NAMES } from '../bundleRuntime/bundleRuntimeCore';
import { ASTNode } from '../compiler/interfaces/AST';
import { ITransformerRequireStatement } from '../compiler/interfaces/ITransformerRequireStatements';
import { ImportType } from '../compiler/interfaces/ImportType';
import { Context } from '../core/context';
import { resolveModule, ITypescriptPathsConfig } from '../resolver/resolver';
import { getPublicPath } from '../utils/utils';
import { createBundleContext, IBundleContext } from './bundleContext';
import { createModule, IModule } from './module';
import { PackageType, createPackage, IPackage } from './package';

export function createRuntimeRequireStatement(props: {
  ctx: Context;
  item: ITransformerRequireStatement;
  module: IModule;
}): ASTNode {
  let requireModuleId: number | string = 'error';
  const { ctx, item, module } = props;
  const log = ctx.log;

  // no value.. import() or require();
  if (!item.statement.arguments[0]) {
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
      }
      // don't convert it and let the user figure it out
      requireModuleId = source;
    }
  } else {
    /**
     * computed statement import
     * require('./x' + b);
     */
    log.warn(`Unsupported require detected in ${module.publicPath}`, item.statement);
    requireModuleId = 'unsupported';
  }

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
  let typescriptPaths: ITypescriptPathsConfig;
  const compilerOptions = props.ctx.compilerOptions;
  if (parent.pkg && parent.pkg.type === PackageType.USER_PACKAGE) {
    if (compilerOptions.baseUrl) typescriptPaths = { baseURL: compilerOptions.baseUrl, paths: compilerOptions.paths };
  }
  const resolved = resolveModule({
    alias: config.alias,
    buildTarget: config.target,
    filePath: props.parent.absPath,
    homeDir: config.homeDir,
    importType: props.importType,
    isDev: props.ctx.config.isDevelopment,
    javascriptFirst: props.parent.isJavaScript,
    modules: config.modules,
    packageMeta: parent.pkg && parent.pkg.meta,
    target: props.statement,
    typescriptPaths: typescriptPaths,
  });
  if (!resolved || (resolved && resolved.error)) return;
  if (resolved.skip || resolved.isExternal) return;

  let absPath;
  let module: IModule;
  if (resolved.package) {
    absPath = resolved.package.targetAbsPath;
    let pkg = bundleContext.getPackage(resolved.package.meta);

    if (!pkg) {
      pkg = createPackage({ meta: resolved.package.meta, type: PackageType.EXTERNAL_PACKAGE });
      bundleContext.setPackage(pkg);
    }
    module = initModule({ absPath, bundleContext, ctx, pkg });
  } else {
    module = initModule({ absPath: resolved.absPath, bundleContext, ctx, pkg: parent.pkg });
  }
  if (module) props.parent.dependencies.push(module);

  return module;
}

function initModule(props: { absPath: string; bundleContext: IBundleContext; ctx: Context; pkg?: IPackage }) {
  const { absPath, bundleContext, ctx, pkg } = props;
  let module = bundleContext.getModule(absPath);

  function init(pkg, absPath, reUseId?: number) {
    if (bundleContext.modules[absPath]) return bundleContext.modules[absPath];

    ctx.log.info('init', '<dim>$absPath</dim>', { absPath: getPublicPath(absPath) });

    const module = createModule({ absPath, ctx, pkg });
    module.init();

    // generate next id
    module.id = reUseId ? reUseId : bundleContext.nextId();
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
            module.moduleSourceRefs[source] = resolvedModule;
            // rewrite statement because we have a resolvedModule
            item.statement = createRuntimeRequireStatement({ ctx, item, module });
          }
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
      const module = cached.module;
      const mrc = cached.mrc;
      // letting the bundle context know of the dependencies
      for (const cached of mrc.modulesCached) bundleContext.setModule(cached);

      for (const item of mrc.modulesRequireResolution) {
        delete bundleContext.modules[item.absPath];
        init(item.pkg, item.absPath, item.id);
      }

      if (module) return module;
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

export function ModuleResolver(ctx: Context, entryFiles: Array<string>): IModuleResolver {
  const entries = [];
  const bundleContext = createBundleContext(ctx);
  const userPackage = createPackage({ type: PackageType.USER_PACKAGE });
  bundleContext.setPackage(userPackage);
  for (const absPath of entryFiles) {
    const entryModule = initModule({ absPath, bundleContext, ctx, pkg: userPackage });
    entryModule.isEntry = true;
    entries.push(entryModule);
  }

  return { bundleContext, entries, modules: Object.values(bundleContext.modules) };
}
