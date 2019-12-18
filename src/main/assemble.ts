import * as path from 'path';
import { ITransformerRequireStatement } from '../compiler/interfaces/ITransformerRequireStatements';
import { ImportType } from '../compiler/interfaces/ImportType';
import { Context } from '../core/Context';
import { Module, createModule } from '../core/Module';
import { Package, createPackage } from '../core/Package';
import { createApplicationPackage } from '../core/application';
import { resolveModule, IResolver } from '../resolver/resolver';

interface IDefaultParseProps {
  FTL?: boolean;
  assemble?: boolean;
  ctx: Context;
  extraDependencies?: Array<string>;
  module: Module;
  pkg: Package;
}

function registerPackage(props: {
  assemble?: boolean;
  ctx: Context;
  pkg: Package;
  resolved: IResolver;
}): { pkg: Package; target: Module } {
  const collection = props.ctx.assembleContext.collection;
  const resolved = props.resolved;

  let pkg: Package = collection.packages.get(resolved.package.meta.name, resolved.package.meta.version);
  if (!pkg) {
    props.ctx.log.info('assemble package', resolved.package.meta.name + ':' + resolved.package.meta.version);
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

  if (target && !collection.modules.has(target.props.absPath)) {
    collection.modules.set(target.props.absPath, target);
  }
  if (target && !target.assembled && props.assemble) {
    processModule({ ...props, module: target, pkg: pkg });
  }
  return { pkg, target };
}

export interface IAssembleResolveResult {
  forcedStatement?: string;
  module?: Module;
  package?: Package;
  packageTarget?: Module;
  processed?: boolean;
  resolver?: IResolver;
}
function resolveStatement(
  opts: { importType: ImportType; statement: string },
  props: IDefaultParseProps,
): IAssembleResolveResult {
  const collection = props.ctx.assembleContext.collection;
  const config = props.ctx.config;
  const log = props.ctx.log;

  let typescriptPaths = props.pkg.isDefaultPackage && props.ctx.tsConfig.typescriptPaths;
  // let's check for custom tsConfig typescript paths here.
  if (props.ctx.tsConfigAtPaths && props.pkg.isDefaultPackage) {
    // fine a path that's relative to any tsConfig
    const typescriptPathsOverride = props.ctx.tsConfigAtPaths.find(item => {
      const relativePath = path.relative(item.absPath, props.module.props.absPath);
      return !relativePath.startsWith('..');
    });
    if (typescriptPathsOverride) typescriptPaths = typescriptPathsOverride.tsConfig.typescriptPaths;
  }

  const resolved = resolveModule({
    alias: config.alias,
    buildTarget: config.target,
    filePath: props.module.props.absPath,
    homeDir: config.homeDir,
    importType: opts.importType,
    isDev: !props.ctx.config.production,
    javascriptFirst: props.module.isJavascriptModule(),
    modules: config.modules,
    packageMeta: !props.pkg.isDefaultPackage && props.pkg.props.meta,
    target: opts.statement,
    typescriptPaths: typescriptPaths,
  });

  if (!resolved || (resolved && resolved.error)) {
    if (log.ignoreStatementErrors && log.ignoreStatementErrors.find(re => re.test(opts.statement))) {
      return;
    }

    let shouldIgnoreCaching = true; // will be toggled
    log.warn(
      resolved && resolved.error
        ? resolved.error + ' / Import statement: "$statement" in <dim>$file</dim>'
        : 'Cannot resolve $statement in <dim>$file</dim>',
      {
        file: props.module.props.absPath,
        statement: opts.statement,
      },
    );

    if (shouldIgnoreCaching) {
      props.module.errored = true;
    }
    return;
  }

  if (resolved.skip || resolved.isExternal) {
    return;
  }
  if (resolved.package) {
    // ignoring all dependencies if required
    if (props.ctx.config.shoudIgnorePackage(resolved.package.meta.name)) {
      return;
    }
    const packageData = registerPackage({
      assemble: props.assemble,
      ctx: props.ctx,
      pkg: props.pkg,
      resolved: resolved,
    });
    return {
      forcedStatement: resolved.forcedStatement,
      package: packageData.pkg,
      packageTarget: packageData.target,
      resolver: resolved,
    };
  }

  if (collection.modules.has(resolved.absPath)) {
    return {
      forcedStatement: resolved.forcedStatement,
      module: collection.modules.get(resolved.absPath),
      processed: true,
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
  if (resolved.monorepoModulesPath) {
    _module.meta = _module.meta || {};
    _module.meta.monorepoModulesPath = resolved.monorepoModulesPath;
  }

  if (resolved.tsConfigAtPath) {
    _module.meta = _module.meta || {};
    _module.meta.tsConfigAtPath = resolved.tsConfigAtPath;
    // adding ts config to the global context to further resolution can be handled accordingly
    props.ctx.addTsConfigAtPath(resolved.tsConfigAtPath);
  }
  collection.modules.set(resolved.absPath, _module);
  return { forcedStatement: resolved.forcedStatement, module: _module, processed: false };
}

export function processModule(props: IDefaultParseProps) {
  const icp = props.ctx.ict;
  const _module = props.module;
  _module.errored = false;

  icp.sync('assemble_module_init', { module: _module });
  props.pkg.modules.push(props.module);

  let literalStatements: { [key: string]: Array<ITransformerRequireStatement> };
  if (_module.isExecutable()) {
    if (!_module.isCached) {
      _module.read();

      icp.sync('assemble_before_transpile', { module: _module });
      _module.parse();

      props.ctx.log.info('compiler', _module.getShortPath());
      const response = _module.transpile();
      _module.analysis = {
        imports: [],
      };

      literalStatements = {};
      icp.sync('assemble_after_transpile', { module: _module });
      for (const item of response.requireStatementCollection) {
        if (item.statement.arguments.length === 1) {
          const importLiteral = item.statement.arguments[0];
          _module.analysis.imports.push({ literal: importLiteral.value, type: item.importType });
          if (!literalStatements[importLiteral.value]) literalStatements[importLiteral.value] = [];
          literalStatements[importLiteral.value].push(item);
        }
      }

      //adding extra dependencies
      if (props.extraDependencies) {
        for (const dep of props.extraDependencies) {
          _module.analysis.imports.push({ literal: dep, type: ImportType.REQUIRE });
        }
      }
    }
  }

  // local paths (in case of a monorepo wich is toggle by local:main in package.json)
  // might have node_modules. That should solved the problem during development
  // this path is added to the context to help FuseBox find modules
  if (_module.meta && _module.meta.monorepoModulesPath) {
    if (props.ctx.config.modules.indexOf(_module.meta.monorepoModulesPath) === -1) {
      props.ctx.config.modules.push(_module.meta.monorepoModulesPath);
    }
  }

  _module.assembled = true;
  const modules = [];
  if (_module.analysis && _module.analysis.imports) {
    for (const data of _module.analysis.imports) {
      if (data.literal) {
        const response = resolveStatement({ importType: data.type, statement: data.literal }, props);
        if (response && literalStatements) {
          modules.push(response);

          const nodes = literalStatements[data.literal];
          if (nodes) {
            // for production map imports to module
            if (props.ctx.config.production) {
              _module.moduleSourceRefs[data.literal] = response.module || response.packageTarget;
            }
            if (response.forcedStatement) {
              for (const node of nodes) {
                node.statement.arguments[0].value = response.forcedStatement;
              }
            }
          }
        }
      } else {
        // Should handle computed statements
      }
    }
    modules.forEach(item => {
      if (item) {
        if (item.module) {
          props.module.moduleDependencies.push(item.module);
        }

        if (item.package) {
          props.module.externalDependencies.push(item.package);
        }
        if (item && !item.processed && item.module) {
          processModule({ ...props, extraDependencies: undefined, module: item.module });
        }
      }
    });
  }
  if (!props.ctx.config.production && _module.isExecutable() && !_module.isCached) {
    _module.generateCode();
  }
  icp.sync('assemble_module_complete', { module: _module });
}

function parseDefaultPackage(ctx: Context, pkg: Package) {
  ctx.assembleContext.collection.modules.set(pkg.entry.props.absPath, pkg.entry);

  // Production might require tslib so we need to add it here

  processModule({
    ctx: ctx,
    extraDependencies: ctx.config.dependencies.include,
    module: pkg.entry,
    pkg: pkg,
  });
}

function assemblePackage(pkg: Package, ctx: Context) {
  pkg.externalPackages.forEach(pkg => {
    let modules = [...pkg.userEntries];
    if (pkg.entry) {
      modules.push(pkg.entry);
    }

    ctx.ict.sync('assemble_package_from_project', {
      assembleContext: ctx.assembleContext,
      pkg,
      userModules: modules,
    });
    if (!pkg.isCached) {
      modules.map(item => {
        processModule({
          assemble: true,
          ctx: ctx,
          module: item,
          pkg: pkg,
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

  return result;
}
