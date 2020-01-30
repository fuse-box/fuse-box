import * as path from 'path';
import { ICompilerOptions } from '../compilerOptions/interfaces';
import { env } from '../env';
import { ITypescriptPathsConfig } from '../resolver/resolver';
import { isPathRelative } from '../utils/utils';
import { IModule } from './module';
import { PackageType } from './package';

export function getModuleResolutionPaths(props: { module: IModule }): ITypescriptPathsConfig {
  const module = props.module;
  const { absPath, ctx, pkg } = module;
  let compilerOptions: ICompilerOptions;
  let tsconfigPath: string;
  if (pkg.type === PackageType.USER_PACKAGE) {
    // any custom overrides
    if (ctx.tsConfigAtPaths.length) {
      for (const item of ctx.tsConfigAtPaths) {
        if (isPathRelative(item.absPath, absPath)) {
          compilerOptions = item.compilerOptions;
          tsconfigPath = item.tsconfigPath;
          break;
        }
      }
    }
    if (!compilerOptions) {
      compilerOptions = ctx.compilerOptions;
      tsconfigPath = env.SCRIPT_FILE;
    }
  }

  if (compilerOptions && compilerOptions.baseUrl) {
    let baseURL = compilerOptions.baseUrl;
    if (baseURL) {
      if (!path.isAbsolute(baseURL)) baseURL = path.resolve(path.dirname(tsconfigPath), baseURL);
    }
    return {
      baseURL: baseURL,
      paths: compilerOptions.paths,
      tsconfigPath,
    };
  }
}
