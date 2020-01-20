import { bundleSource, IBundleSource } from '../BundleRuntime/bundleSource';
import { Context } from '../core/Context';
import { IModule } from '../ModuleResolver/Module';
import { distWriter } from '../output/distWriter';
import { IOutputBundleConfigAdvanced } from '../output/OutputConfigInterface';

export interface IBundle {
  name?: string;
  source?: IBundleSource;
  type?: IBundleType;
  generate?: () => Promise<Array<IBundleWriteResponse>>;
}

export enum IBundleType {
  JS_APP,
  JS_VENDOR,
  JS_SPLIT,
  CSS_APP,
  CSS_SPLIT,
}

export interface IBundleProps {
  ctx: Context;
  includeAPI?: boolean;
  type?: IBundleType;
  entries?: Array<IModule>;
  bundleConfig?: IOutputBundleConfigAdvanced;
}

export interface IBundleWriteResponse {
  bundle?: IBundle;
  absPath: string;
  relativePath: string;
}

export function Bundle(props: IBundleProps): IBundle {
  const { ctx, bundleConfig } = props;
  const outputConfig = ctx.outputConfig;
  const isProduction = !!ctx.config.production;
  const target = ctx.config.target;

  const bundleWriter = distWriter({ hashEnabled: isProduction, root: outputConfig.root });

  const apiCore = props.includeAPI && { isIsolated: bundleConfig.isolatedApi, target };
  const source = bundleSource({ core: apiCore, isIsolated: bundleConfig.isolatedApi, target });
  source.entries = props.entries;

  const scope: IBundle = {
    source,
    type: props.type,
    generate: async () => {
      const data = source.generate();
      const writer = bundleWriter.createWriter({
        userString: bundleConfig.path,
        hash: isProduction,
        contents: data.content.toString(),
      });
      const result = await writer.write();

      const bundleResponse = { bundle: scope, absPath: result.absPath, relativePath: result.relativePath };
      return [bundleResponse];
    },
  };
  return scope;
}
