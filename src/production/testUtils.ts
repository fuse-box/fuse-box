import * as appRoot from 'app-root-path';
import { unlinkSync, writeFileSync, unlink } from 'fs';
import * as path from 'path';
import { ASTNode } from '../compiler/interfaces/AST';
import { ITransformer } from '../compiler/interfaces/ITransformer';
import { createGlobalContext } from '../compiler/program/GlobalContext';
import { transpileModule } from '../compiler/program/transpileModule';
import { GlobalContextTransformer } from '../compiler/transformers/GlobalContextTransformer';
import { IPublicConfig } from '../config/IPublicConfig';
import { createContext } from '../core/Context';
import { fusebox } from '../core/fusebox';
import { createModule } from '../core/Module';
import { createPackage } from '../core/Package';
import { ensureDir, fastHash } from '../utils/utils';
import { ModuleTree } from './module/ModuleTree';
import { IProductionContext, ProductionContext } from './ProductionContext';
import * as fsExtra from 'fs-extra';
export function testProductionWarmup(props: {
  jsx?: boolean;
  code: string;
  transformers: Array<ITransformer>;
  props?: any;
  moduleProps?: any;
}) {
  const ctx = createContext({
    cache: false,
    devServer: false,
    target: 'browser',
  });

  const pkg = createPackage({ ctx: ctx, meta: {} as any });

  const module = Object.assign(
    createModule(
      {
        absPath: __filename,
        ctx: ctx,
        extension: '.ts',
        fuseBoxPath: 'file.ts',
      },
      pkg,
    ),
    props.moduleProps || {},
  );

  pkg.modules.push(module);

  module.contents = props.code;
  module.parse();

  const productionContext = ProductionContext(ctx, [pkg]);

  const tree = (module.moduleTree = ModuleTree(productionContext, module));

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

  return { productionContext, module, tree };
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
