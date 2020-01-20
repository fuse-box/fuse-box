import { BUNDLE_RUNTIME_NAMES } from '../BundleRuntime/bundleRuntimeCore';
import { ImportType } from '../compiler/interfaces/ImportType';
import { Context } from '../core/Context';
import { resolveModule } from '../resolver/resolver';
import { ensureAbsolutePath } from '../utils/utils';
import { createBundleContext, IBundleContext } from './BundleContext';
import { createModule, IModule } from './Module';
import { createPackage, IPackage, PackageType } from './Package';

export function resolve(props: {
  ctx: Context;
  parent: IModule;
  importType: ImportType;
  statement: string;
  bundleContext: IBundleContext;
}) {
  const config = props.ctx.config;

  const { bundleContext, parent, ctx } = props;
  let typescriptPaths = parent.pkg && parent.pkg.type == PackageType.USER_PACKAGE && props.ctx.tsConfig.typescriptPaths;
  const resolved = resolveModule({
    isDev: !props.ctx.config.production,
    filePath: props.parent.absPath,
    homeDir: config.homeDir,
    alias: config.alias,
    javascriptFirst: props.parent.isJavaScript,
    typescriptPaths: typescriptPaths,
    packageMeta: parent.pkg && parent.pkg.meta,
    buildTarget: config.target,
    modules: config.modules,
    importType: props.importType,
    target: props.statement,
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
      pkg = createPackage({ type: PackageType.EXTERNAL_PACKAGE, meta: resolved.package.meta });
      bundleContext.setPackage(pkg);
    }
    module = initModule({ absPath, bundleContext, ctx, pkg });
  } else {
    module = initModule({ absPath: resolved.absPath, bundleContext, ctx, pkg: parent.pkg });
  }
  if (module) props.parent.dependencies.push(module);

  return module;
}

function initModule(props: { ctx: Context; absPath: string; pkg?: IPackage; bundleContext: IBundleContext }) {
  const { ctx, pkg, absPath, bundleContext } = props;
  let module = bundleContext.getModule(absPath);

  function init(pkg, absPath, reUseId?: number) {
    const module = createModule({ pkg, ctx, absPath });
    module.init();
    // generate next id
    module.id = reUseId ? reUseId : bundleContext.nextId();
    // storing for further references (and avoid recursion)
    bundleContext.setModule(module);
    // reading and parsing the contents
    module.read();

    ctx.ict.sync('module_init', { module, bundleContext });

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
        // re-writing the reference
        item.statement.callee.name = BUNDLE_RUNTIME_NAMES.ARG_REQUIRE_FUNCTION;
        item.statement.arguments[0].value = resolvedModule.id;
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
  modules: Array<IModule>;
  bundleContext: IBundleContext;
  entries: Array<IModule>;
}

export function ModuleResolver(ctx: Context, entryFile: string): IModuleResolver {
  const bundleContext = createBundleContext(ctx);

  const userPackage = createPackage({ type: PackageType.USER_PACKAGE });
  const absPath = ensureAbsolutePath(entryFile, ctx.config.homeDir);

  const entry = initModule({ ctx, absPath, pkg: userPackage, bundleContext });

  return { bundleContext, modules: Object.values(bundleContext.modules), entries: [entry] };
}
