import { bundleSource, IBundleSource } from '../BundleRuntime/bundleSource';
import { Context } from '../core/Context';
import { IModule } from '../module-resolver/Module';
import { IOutputBundleConfigAdvanced } from '../output/OutputConfigInterface';
import { distWriter } from '../output/distWriter';

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
  bundleConfig?: IOutputBundleConfigAdvanced;
  ctx: Context;
  entries?: Array<IModule>;
  includeAPI?: boolean;
  type?: IBundleType;
}

export interface IBundleWriteResponse {
  absPath: string;
  bundle?: IBundle;
  relativePath: string;
}

export function Bundle(props: IBundleProps): IBundle {
  const { bundleConfig, ctx } = props;
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
        contents: data.content.toString(),
        hash: isProduction,
        userString: bundleConfig.path,
      });
      const result = await writer.write();

      const bundleResponse = { absPath: result.absPath, bundle: scope, relativePath: result.relativePath };
      return [bundleResponse];
    },
  };
  return scope;
}
