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
}

function registerPackage(props: { assemble?: boolean; pkg: Package; ctx: Context; resolved: IResolver }) {
  const collection = props.ctx.assembleContext.collection;
  const resolved = props.resolved;

  let pkg: Package = collection.packages.get(resolved.package.meta.name, resolved.package.meta.version);
  if (!pkg) {
    props.ctx.log.info('package $name:$version', {
      name: resolved.package.meta.name,
      version: resolved.package.meta.version,
    });
    pkg = createPackage({ ctx: props.ctx, meta: resolved.package.meta });
    collection.packages.add(pkg);
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

function resolveStatement(
  opts: { statement: string; importType: ImportType },
  props: IDefaultParseProps,
): {
  module?: Module;
  forcedStatement?: string;
  processed?: boolean;
  package?: Package;
} {
  const collection = props.ctx.assembleContext.collection;
  const config = props.ctx.config;

  const resolved = resolveModule({
    filePath: props.module.props.absPath,
    homeDir: config.homeDir,
    alias: config.alias,
    packageMeta: !props.pkg.isDefaultPackage && props.pkg.props.meta,
    buildTarget: config.target,
    modules: config.modules,
    importType: opts.importType,
    target: opts.statement,
  });

  if (!resolved || resolved.skip || resolved.isExternal) {
    return;
  }
  if (resolved.package) {
    return {
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

function processModule(props: IDefaultParseProps) {
  const icp = props.ctx.interceptor;
  const _module = props.module;
  icp.sync('assemble_module_init', { module: _module });
  props.pkg.modules.push(props.module);
  if (_module.isExecutable()) {
    if (!_module.isCached) {
      _module.read();
      _module.fastAnalysis = fastAnalysis({ input: _module.contents });

      _module.fastAnalysis.replaceable = [];
      icp.sync('assemble_fast_analysis', { module: _module });
    }
    _module.assembled = true;

    const modules = [];

    _module.fastAnalysis.imports.forEach(data => {
      const response = resolveStatement({ statement: data.statement, importType: data.type }, props);
      if (response) {
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
    if (_module.isTypescriptModule()) {
      icp.sync('assemble_ts_module', { module: _module });
    }
    if (_module.pkg.isDefaultPackage) {
      icp.sync('assemble_pr_module', { module: _module });
    } else {
      icp.sync('assemble_nm_module', { module: _module });
    }

    modules.forEach(item => {
      if (!item) {
        return;
      }
      if (item.module) {
        props.module.moduleDependencies.push(item.module);
      }
      if (item.package) {
        props.module.externalDependencies.push(item.package);
      }
      if (item && !item.processed && item.module) {
        processModule({ ...props, module: item.module });
      }
    });
  }
}

function parseDefaultPackage(ctx: Context, pkg: Package) {
  ctx.assembleContext.collection.modules.set(pkg.entry.props.absPath, pkg.entry);
  processModule({
    ctx: ctx,
    pkg: pkg,
    module: pkg.entry,
  });
}

function assemblePackage(pkg: Package, ctx: Context) {
  pkg.externalPackages.forEach(pkg => {
    let modules = [...pkg.userEntries];
    if (pkg.entry) {
      modules.push(pkg.entry);
    }
    ctx.interceptor.sync('assemble_package_from_project', { pkg, assembleContext: ctx.assembleContext });
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
  ctx.log.group('assemble');
  const pkg = createApplicationPackage(ctx, entryFile);
  parseDefaultPackage(ctx, pkg);
  assemblePackage(pkg, ctx);
  const result: Array<Package> = [pkg];
  ctx.assembleContext.collection.packages.getAll(pkg => {
    result.push(pkg);
  });
  ctx.packages = result;
  // reset logging group
  ctx.log.group(false);
  return result;
}
