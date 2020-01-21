import * as appRoot from 'app-root-path';
import { writeFileSync } from 'fs';
import * as fsExtra from 'fs-extra';
import * as path from 'path';
import { ASTNode } from '../../compiler/interfaces/AST';
import { ITransformer } from '../../compiler/interfaces/ITransformer';
import { createGlobalContext } from '../../compiler/program/GlobalContext';
import { transpileModule } from '../../compiler/program/transpileModule';
import { GlobalContextTransformer } from '../../compiler/transformers/GlobalContextTransformer';
import { IPublicConfig } from '../../config/IPublicConfig';
import { createContext } from '../../core/Context';
import { fusebox } from '../../core/fusebox';
import { createModule, IModule } from '../../module-resolver/Module';
import { PackageType, createPackage } from '../../module-resolver/Package';
import { ensureDir, fastHash } from '../../utils/utils';
import { ProductionContext, IProductionContext } from '../ProductionContext';
import { ModuleTree } from '../module/ModuleTree';

export function testProductionWarmup(props: {
  code: string;
  jsx?: boolean;
  moduleProps?: any;
  props?: any;
  transformers: Array<ITransformer>;
}) {
  const ctx = createContext({
    cache: false,
    devServer: false,
    target: 'browser',
  });

  const pkg = createPackage({ type: PackageType.USER_PACKAGE });

  const module: IModule = Object.assign(
    createModule({
      //absPath: __filename,
      ctx: ctx,
      pkg,
    }),
    props.moduleProps || {},
  );

  module.contents = props.code;
  module.extension = '.ts';
  module.id = 1;

  module.parse();

  const productionContext = ProductionContext(ctx, [module]);

  const tree = (module.moduleTree = ModuleTree({ module, productionContext }));

  const tranformers = [GlobalContextTransformer().commonVisitors(props.props)];
  for (const t of props.transformers) {
    if (t.productionWarmupPhase) {
      tranformers.push(t.productionWarmupPhase({ ctx: ctx, module: module, productionContext: productionContext }));
    }
  }

  transpileModule({
    ast: module.ast as ASTNode,
    globalContext: createGlobalContext(),
    transformers: tranformers,
  });

  return { module, productionContext, tree };
}

function createFileSet(directory, files: Record<string, string>) {
  const newSet = {};
  for (const key in files) {
    newSet[path.join(directory, key)] = files[key];
  }

  return newSet;
}

export class ProdPhasesTestEnv {
  private rootDir: string;
  private homeDir: string;
  constructor(public config: IPublicConfig) {
    config.cache = false;
    config.target = 'browser';
    config.watch = false;
    config.devServer = false;
  }
  initFileStructure(files: Record<string, string>) {
    const folder = fastHash(Math.random() + '-' + new Date().getTime());
    this.rootDir = path.join(appRoot.path, '.tmp', folder);
    this.homeDir = path.join(this.rootDir, 'src');
    this.config.homeDir = this.homeDir;
    ensureDir(this.homeDir);
    for (const key in files) {
      const filePath = path.join(this.homeDir, key);
      writeFileSync(filePath, files[key]);
    }
  }

  public async run(phases): Promise<IProductionContext> {
    const fuse = fusebox(this.config);
    const context = await fuse.runProductionContext(phases);
    return context;
  }

  public destroy() {
    fsExtra.removeSync(this.rootDir);
  }
}

export function prodPhasesEnv(config: IPublicConfig, files: Record<string, string>): ProdPhasesTestEnv {
  const env = new ProdPhasesTestEnv(config);
  env.initFileStructure(files);

  return env;
}
