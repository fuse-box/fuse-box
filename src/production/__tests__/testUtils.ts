import * as appRoot from 'app-root-path';
import { writeFileSync } from 'fs';
import * as fsExtra from 'fs-extra';
import * as path from 'path';

import { IPublicConfig } from '../../config/IConfig';
import { Context, createContext } from '../../core/context';
// import { fusebox } from '../../core/fusebox';
import { ASTNode } from '../../compiler/interfaces/AST';
import { ITransformer } from '../../compiler/interfaces/ITransformer';
import { createGlobalContext } from '../../compiler/program/GlobalContext';
import { transpileModule } from '../../compiler/program/transpileModule';
import { GlobalContextTransformer } from '../../compiler/transformers/GlobalContextTransformer';
import { EnvironmentType } from '../../config/EnvironmentType';
import { IModule } from '../../moduleResolver/module';
import { ensureDir, fastHash } from '../../utils/utils';
import { createProductionContext, IProductionContext } from '../ProductionContext';
import { Engine } from '../engine';

export interface ITestEnvironment {
  context: Context;
  productionContext: IProductionContext;
  sourceDir: string;
  cleanup: () => void;
  run: (phases: Array<(IProductionContext) => void>) => IProductionContext;
}

export function createTestEnvironment(customConfig: Record<string, string>, files: Record<string, string>) {
  // setup folder structure
  const sourceFolder = fastHash(Math.random() + '-' + new Date().getTime());
  const rootDir = path.join(appRoot.path, '.tmp', sourceFolder);
  const sourceDir = path.join(rootDir, 'src');
  if (customConfig.entry) {
    customConfig.entry = path.join(sourceDir, customConfig.entry);
  }
  const config: IPublicConfig = {
    cache: false,
    devServer: false,
    homeDir: sourceDir,
    target: 'browser',
    watcher: false,
    ...customConfig,
  };

  // create the source folders and files
  ensureDir(sourceDir);
  for (const filename in files) {
    const filePath = path.join(sourceDir, filename);
    writeFileSync(filePath, files[filename]);
  }

  const context = createContext({ envType: EnvironmentType.TEST, publicConfig: config });

  const productionContext = createProductionContext(context);

  return {
    context,
    productionContext,
    sourceDir,
    cleanup: () => {
      fsExtra.removeSync(rootDir);
    },
    run: (phases): IProductionContext => {
      Engine(productionContext).start(phases);
      return productionContext;
    },
  };
}

/**
 * Left for reference
 * Is not used atm!
 */
export function customWarmupPhase(
  productionContext: IProductionContext,
  module: IModule,
  transformers: Array<ITransformer>,
) {
  const customTransformers = [GlobalContextTransformer().commonVisitors()];
  for (const transformer of transformers) {
    if (transformer.productionWarmupPhase) {
      customTransformers.push(
        transformer.productionWarmupPhase({
          ctx: productionContext.ctx,
          module,
          productionContext,
        }),
      );
    }
  }

  transpileModule({
    ast: module.ast as ASTNode,
    globalContext: createGlobalContext(),
    transformers: customTransformers,
  });
}

// function getProductionContext(code: string): IProductionContext {
//   const environment = createTestEnvironment({ entry: 'index.ts' }, {
//     'foo.ts': `
//       console.log('foo');
//     `,
//     'index.ts': code,
//   });
//   const CustomPhase = () => customWarmupPhase(
//     environment.productionContext,
//     environment.productionContext.modules[0],
//     [Phase_1_ExportLink()]
//   );
//   environment.run([CustomPhase]);
//   return environment.productionContext;
// };
