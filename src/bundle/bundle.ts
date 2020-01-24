import * as path from 'path';
import { bundleSource, IBundleSource } from '../bundleRuntime/bundleSource';
import { Context } from '../core/context';
import { IModule } from '../moduleResolver/module';
import { IOutputBundleConfigAdvanced } from '../output/OutputConfigInterface';
import { distWriter } from '../output/distWriter';

export interface IBundle {
  name?: string;
  priority?: number;
  source?: IBundleSource;
  type?: IBundleType;
  webIndexed: boolean;
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
  priority?: number;
  type?: IBundleType;
  webIndexed?: boolean;
}

export interface IBundleWriteResponse {
  absPath: string;
  bundle?: IBundle;
  relativePath: string;
}

export function createBundle(props: IBundleProps): IBundle {
  const { bundleConfig, ctx, priority, webIndexed = true } = props;
  const outputConfig = ctx.outputConfig;
  const isProduction = ctx.config.isProduction;
  const target = ctx.config.target;

  const bundleWriter = distWriter({ hashEnabled: isProduction, root: outputConfig.distRoot });
  const apiCore = props.includeAPI && {
    interopRequireDefault: ctx.compilerOptions.esModuleInterop,
    isIsolated: bundleConfig.isolatedApi,
    target,
  };
  const source = bundleSource({ core: apiCore, isIsolated: bundleConfig.isolatedApi, target });
  source.entries = props.entries;

  const self: IBundle = {
    priority,
    source,
    type: props.type,
    webIndexed,
    generate: async () => {
      const data = source.generate();

      const options = { contents: data.content.toString(), hash: isProduction, userString: bundleConfig.path };
      const config = bundleWriter.createWriter(options);

      let contents = options.contents;
      if (source.containsMaps) {
        // writing source maps
        const sourceMapName = path.basename(config.relativePath) + '.map';
        contents = options.contents + `\n//# sourceMappingURL=${sourceMapName}`;
        const targetDir = path.dirname(config.absPath);
        const sourceMapFile = path.join(targetDir, sourceMapName);
        await bundleWriter.write(sourceMapFile, data.sourceMap);
      }

      await bundleWriter.write(config.absPath, contents);

      const bundleResponse = { absPath: config.absPath, bundle: self, relativePath: config.relativePath };
      return [bundleResponse];
    },
  };
  return self;
}
