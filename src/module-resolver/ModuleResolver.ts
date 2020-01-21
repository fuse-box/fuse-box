import { BUNDLE_RUNTIME_NAMES } from '../BundleRuntime/bundleRuntimeCore';
import { ImportType } from '../compiler/interfaces/ImportType';
import { Context } from '../core/Context';
import { resolveModule } from '../resolver/resolver';
import { ensureAbsolutePath } from '../utils/utils';
import { createBundleContext, IBundleContext } from './BundleContext';
import { createModule, IModule } from './Module';
import { PackageType, createPackage, IPackage } from './Package';

export function resolve(props: {
  bundleContext: IBundleContext;
  ctx: Context;
  importType: ImportType;
  parent: IModule;
  statement: string;
}) {
  const config = props.ctx.config;

  const { bundleContext, ctx, parent } = props;
  let typescriptPaths = parent.pkg && parent.pkg.type == PackageType.USER_PACKAGE && props.ctx.tsConfig.typescriptPaths;
  const resolved = resolveModule({
    alias: config.alias,
    buildTarget: config.target,
    filePath: props.parent.absPath,
    homeDir: config.homeDir,
    importType: props.importType,
    isDev: !props.ctx.config.production,
    javascriptFirst: props.parent.isJavaScript,
    modules: config.modules,
    packageMeta: parent.pkg && parent.pkg.meta,
    target: props.statement,
    typescriptPaths: typescriptPaths,
  });
  if (!resolved || (resolved && resolved.error)) return;
  if (resolved.skip || resolved.isExternal) {
    return;
  }
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
    ctx.log.verbose('init', '<dim>$absPath</dim>', { absPath });
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
        const source = item.statement.arguments[0].value;

        const resolvedModule = resolve({
          bundleContext: props.bundleContext,
          ctx: props.ctx,
          importType: item.importType,
          parent: module,
          statement: source,
        });

        module.moduleSourceRefs[source] = resolvedModule;
        // re-writing the reference
        item.statement.callee.name = BUNDLE_RUNTIME_NAMES.ARG_REQUIRE_FUNCTION;
        item.statement.arguments[0].value = resolvedModule.id;
        delete item.statement.arguments[0].raw;
      }
      if (!ctx.config.production) module.generate();
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
        init(undefined, item.absPath, item.id);
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
  for (const entry of entryFiles) {
    const absPath = ensureAbsolutePath(entry, ctx.config.homeDir);
    const entryModule = initModule({ absPath, bundleContext, ctx, pkg: userPackage });
    entryModule.isEntry = true;
    entries.push(entryModule);
  }

  return { bundleContext, entries, modules: Object.values(bundleContext.modules) };
}
