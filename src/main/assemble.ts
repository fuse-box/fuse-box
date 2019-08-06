import { fastAnalysis } from '../analysis/fastAnalysis';
import { createApplicationPackage } from '../core/application';
import { Context } from '../core/Context';
import { createModule, Module } from '../core/Module';
import { createPackage, Package } from '../core/Package';
import { ImportType, IResolver, resolveModule } from '../resolver/resolver';

interface IDefaultParseProps {
  assemble?: boolean;
  module: Module;
  pkg: Package;
  ctx: Context;
  FTL?: boolean;
  extraDependencies?: Array<string>;
}

function registerPackage(props: { assemble?: boolean; pkg: Package; ctx: Context; resolved: IResolver }) {
  const collection = props.ctx.assembleContext.collection;
  const resolved = props.resolved;

  let pkg: Package = collection.packages.get(resolved.package.meta.name, resolved.package.meta.version);
  if (!pkg) {
    props.ctx.log.progressFormat('assemble package', resolved.package.meta.name + ':' + resolved.package.meta.version);
    pkg = createPackage({ ctx: props.ctx, meta: resolved.package.meta });
    collection.packages.add(pkg);
  } else {
    // handle a very rare case where a package that has the same version is located
    // in multiple sub_modules
    if (resolved.package.meta.packageRoot !== pkg.props.meta.packageRoot) {
      if (!pkg.props.meta.packageAltRoots) pkg.props.meta.packageAltRoots = [];
      // this will be used in order to make a fuseBoxPath
      pkg.props.meta.packageAltRoots.push(resolved.package.meta.packageRoot);
    }
  }
  // if we have a version conflict we need to notity the parent package
  if (!props.pkg.externalPackages.includes(pkg)) {
    props.pkg.externalPackages.push(pkg);
  }
  let target: Module;
  if (resolved.package.isEntry && !pkg.entry) {
    pkg.entry = createModule(
      {
        absPath: resolved.package.targetAbsPath,
        ctx: props.ctx,
        extension: resolved.package.targetExtension,
        fuseBoxPath: resolved.package.targetFuseBoxPath,
      },
      pkg,
    );
    target = pkg.entry;
  } else if (!resolved.package.isEntry) {
    let userEntry = pkg.userEntries.find(item => item.props.absPath === resolved.package.targetAbsPath);
    if (!userEntry) {
      userEntry = createModule(
        {
          absPath: resolved.package.targetAbsPath,
          ctx: props.ctx,
          extension: resolved.package.targetExtension,
          fuseBoxPath: resolved.package.targetFuseBoxPath,
        },
        pkg,
      );
      pkg.userEntries.push(userEntry);
    }
    target = userEntry;
  }
  if (target && !target.assembled && props.assemble) {
    processModule({ ...props, module: target, pkg: pkg });
  }
  return pkg;
}

export interface IAssembleResolveResult {
  resolver?: IResolver;
  module?: Module;
  forcedStatement?: string;
  processed?: boolean;
  package?: Package;
}
function resolveStatement(
  opts: { statement: string; importType: ImportType },
  props: IDefaultParseProps,
): IAssembleResolveResult {
  const collection = props.ctx.assembleContext.collection;
  const config = props.ctx.config;

  const resolved = resolveModule({
    filePath: props.module.props.absPath,
    homeDir: config.homeDir,
    alias: config.alias,
    javascriptFirst: props.module.isJavascriptModule(),
    typescriptPaths: props.pkg.isDefaultPackage && props.ctx.tsConfig.typescriptPaths,
    packageMeta: !props.pkg.isDefaultPackage && props.pkg.props.meta,
    buildTarget: config.target,
    modules: config.modules,
    importType: opts.importType,
    target: opts.statement,
  });

  if (!resolved) {
    props.ctx.log.warn('Cannot resolve $statement in $file', {
      statement: opts.statement,
      file: props.module.props.absPath,
    });
    return;
  }

  if (resolved.error) {
    props.ctx.log.error(`$error in $file`, { error: resolved.error, file: props.module.props.absPath });
    return;
  }
  if (resolved.skip || resolved.isExternal) {
    return;
  }
  if (resolved.package) {
    // ignoring all dependencies if required
    if (props.ctx.config.dependencies.ignoreAllExternal) {
      if (!props.ctx.config.isEssentialDependency(resolved.package.meta.name)) return;
    }
    return {
      resolver: resolved,
      forcedStatement: resolved.forcedStatement,
      package: registerPackage({ assemble: props.assemble, pkg: props.pkg, ctx: props.ctx, resolved: resolved }),
    };
  }
  if (collection.modules.has(resolved.absPath)) {
    return {
      forcedStatement: resolved.forcedStatement,
      processed: true,
      module: collection.modules.get(resolved.absPath),
    };
  }
  const _module = createModule(
    {
      absPath: resolved.absPath,
      ctx: props.ctx,
      extension: resolved.extension,
      fuseBoxPath: resolved.fuseBoxPath,
    },
    props.pkg,
  );

  collection.modules.set(resolved.absPath, _module);
  return { processed: false, module: _module, forcedStatement: resolved.forcedStatement };
}

export function processModule(props: IDefaultParseProps) {
  const icp = props.ctx.ict;
  const _module = props.module;

  icp.sync('assemble_module_init', { module: _module });
  props.pkg.modules.push(props.module);
  if (_module.isExecutable()) {
    if (!_module.isCached) {
      _module.read();
      _module.fastAnalyse();
      // temp hack to set jsx analysis based on extension
      if (_module.props.extension === '.jsx') {
        _module.fastAnalysis.report.containsJSX = true;
      }
      icp.sync('assemble_fast_analysis', { module: _module });

      _module.fastAnalysis.replaceable = [];
      // adding extra dependencies
      if (props.extraDependencies) {
        for (const dep of props.extraDependencies) {
          _module.fastAnalysis.imports.push({ type: ImportType.RAW_IMPORT, statement: dep });
        }
      }
    }
  }

  _module.assembled = true;
  if (_module.fastAnalysis && _module.fastAnalysis.imports) {
    const modules = [];
    _module.fastAnalysis.imports.forEach(data => {
      const response = resolveStatement({ statement: data.statement, importType: data.type }, props);

      if (response) {
        if (props.ctx.config.production) {
          data.link = response;
        }
        // if (response.module) {
        //   if (!response.module.moduleDependants) response.module.moduleDependants = [];
        //   if (response.module.moduleDependants.indexOf(_module) === -1) {
        //     response.module.moduleDependants.push(_module);
        //   }
        // }
        if (response.forcedStatement) {
          _module.fastAnalysis.replaceable.push({
            type: data.type,
            fromStatement: data.statement,
            toStatement: response.forcedStatement,
          });
        }
        modules.push(response);
      }
    });
    modules.forEach(item => {
      if (item) {
        if (item.module) {
          props.module.moduleDependencies.push(item.module);
        }

        if (item.package) {
          props.module.externalDependencies.push(item.package);
        }
        if (item && !item.processed && item.module) {
          processModule({ ...props, module: item.module, extraDependencies: undefined });
        }
      }
    });
  }
}

function parseDefaultPackage(ctx: Context, pkg: Package) {
  ctx.assembleContext.collection.modules.set(pkg.entry.props.absPath, pkg.entry);

  // Production might require tslib so we need to add it here
  if (ctx.config.production) {
    if (!ctx.config.dependencies.include) ctx.config.dependencies.include = [];
    if (!ctx.config.dependencies.include.includes('tslib')) {
      ctx.config.dependencies.include.push('tslib');
    }
  }
  processModule({
    ctx: ctx,
    pkg: pkg,
    module: pkg.entry,
    extraDependencies: ctx.config.dependencies.include,
  });
}

function assemblePackage(pkg: Package, ctx: Context) {
  pkg.externalPackages.forEach(pkg => {
    let modules = [...pkg.userEntries];
    if (pkg.entry) {
      modules.push(pkg.entry);
    }

    ctx.ict.sync('assemble_package_from_project', {
      pkg,
      userModules: modules,
      assembleContext: ctx.assembleContext,
    });
    if (!pkg.isCached) {
      modules.map(item => {
        processModule({
          assemble: true,
          module: item,
          pkg: pkg,
          ctx: ctx,
        });
      });
    }
  });
}

export function assemble(ctx: Context, entryFile: string): Array<Package> {
  // default package. Big Bang starts here/

  const pkg = createApplicationPackage(ctx, entryFile);
  if (!pkg) return;
  parseDefaultPackage(ctx, pkg);
  assemblePackage(pkg, ctx);
  const result: Array<Package> = [pkg];
  ctx.assembleContext.collection.packages.getAll(pkg => {
    result.push(pkg);
  });
  ctx.packages = result;
  ctx.log.progressEnd('<green><bold>$checkmark Assemble completed</bold></green>');

  return result;
}
