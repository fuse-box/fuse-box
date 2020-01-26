import * as path from 'path';
import { bundleSource, IBundleSource } from '../bundleRuntime/bundleSource';
import { Context } from '../core/context';
import { IModule } from '../moduleResolver/module';
import { IOutputBundleConfigAdvanced } from '../output/OutputConfigInterface';
import { distWriter, IWriterConfig } from '../output/distWriter';
import { Concat } from '../utils/utils';

export interface Bundle {
  config: IWriterConfig;
  contents: string;
  data: Concat;
  priority: number;
  source: IBundleSource;
  type: IBundleType;
  webIndexed: boolean;
  createSourceMap: () => Promise<void>;
  generate: () => Promise<Array<IBundleWriteResponse>>;
  prepare: () => IWriterConfig;
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
  fileName?: string;
  includeAPI?: boolean;
  priority?: number;
  type?: IBundleType;
  webIndexed?: boolean;
}

export interface IBundleWriteResponse {
  absPath: string;
  bundle?: Bundle;
  relativePath: string;
}

export function createBundle(props: IBundleProps): Bundle {
  const { bundleConfig, ctx, priority, type, webIndexed = true } = props;
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

  const self: Bundle = {
    config: null,
    contents: null,
    data: null,
    priority,
    source,
    type,
    webIndexed,
    createSourceMap: async () => {
      const sourceMapName = path.basename(self.config.relativePath) + '.map';
      self.contents += `\n//# sourceMappingURL=${sourceMapName}`;
      const targetDir = path.dirname(self.config.absPath);
      const sourceMapFile = path.join(targetDir, sourceMapName);
      await bundleWriter.write(sourceMapFile, self.data.sourceMap);
    },
    generate: async () => {
      if (!self.config) {
        self.prepare();
      }
      // writing source maps
      if (source.containsMaps) self.createSourceMap();
      // write the bundle to fs
      await bundleWriter.write(self.config.absPath, self.contents);
      return [
        {
          absPath: self.config.absPath,
          // bundle: self,
          relativePath: self.config.relativePath,
        },
      ];
    },
    prepare: (): IWriterConfig => {
      self.data = source.generate();
      self.contents = self.data.content.toString();
      self.config = bundleWriter.createWriter({
        contents: self.contents,
        fileName: props.fileName,
        hash: isProduction,
        userString: bundleConfig.path,
      });
      return self.config;
    },
  };
  return self;
}
