import { Context } from '../core/Context';
import { createPackage, PackageType, Package, IPackage } from './Package';
import { createModule, IModule } from './Module';
import { ensureAbsolutePath } from '../utils/utils';
import { createBundleContext, IBundleContext } from './BundleContext';
import { resolveModule } from '../resolver/resolver';
import { ImportType } from '../compiler/interfaces/ImportType';

function resolve(props: {
  ctx: Context;
  parent: IModule;
  importType: ImportType;
  statement: string;
  bundleContext: IBundleContext;
}) {
  const config = props.ctx.config;

  const { bundleContext, parent, ctx } = props;
  let typescriptPaths = parent.pkg.type == PackageType.USER_PACKAGE && props.ctx.tsConfig.typescriptPaths;
  const resolved = resolveModule({
    isDev: !props.ctx.config.production,
    filePath: props.parent.absPath,
    homeDir: config.homeDir,
    alias: config.alias,
    javascriptFirst: props.parent.isJavaScript,
    typescriptPaths: typescriptPaths,
    packageMeta: parent.pkg.meta,
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
  if (resolved.package) {
    absPath = resolved.package.targetAbsPath;
    let pkg = bundleContext.getPackage(resolved.package.meta);
    if (!pkg) {
      pkg = createPackage({ type: PackageType.EXTERNAL_PACKAGE, meta: resolved.package.meta });
      bundleContext.setPackage(pkg);
    }
    return initModule({ absPath, bundleContext, ctx, pkg });
  } else {
    return initModule({ absPath: resolved.absPath, bundleContext, ctx, pkg: parent.pkg });
  }
}

function initModule(props: { ctx: Context; absPath: string; pkg?: IPackage; bundleContext: IBundleContext }) {
  const { ctx, pkg, absPath, bundleContext } = props;
  let module = bundleContext.getModule(absPath);
  if (module) {
    return module;
  } else {
    const module = createModule({ pkg, ctx, absPath });
    // generate next id
    module.id = bundleContext.nextId();
    // storing for further references (and avoid recursion)
    bundleContext.setModule(module);
    // reading and parsing the contents
    module.read();
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
      item.statement.arguments[0].value = resolvedModule.id;
    }

    return module;
  }
}

export function ModuleResolver(ctx: Context, entryFile: string) {
  const bundleContext = createBundleContext(ctx);

  const userPackage = createPackage({ type: PackageType.USER_PACKAGE });
  const absPath = ensureAbsolutePath(entryFile, ctx.config.homeDir);

  //console.log(module);
  initModule({ ctx, absPath, pkg: userPackage, bundleContext });

  for (const key in bundleContext.modules) {
    const module = bundleContext.modules[key];
    const code = module.generate();
    console.log('******' + module.absPath + '******');
    console.log(code);
  }
}
