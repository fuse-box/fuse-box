import * as path from 'path';
import { BundleSource, createBundleSource } from '../bundleRuntime/bundleSource';
import { Context } from '../core/context';
import { IModule } from '../moduleResolver/module';
import { IOutputBundleConfigAdvanced } from '../output/OutputConfigInterface';
import { distWriter, IWriterConfig } from '../output/distWriter';
import { Concat } from '../utils/utils';

export interface Bundle {
  config: IWriterConfig;
  contents: string;
  data: Concat;
  entries?: Array<IModule>;
  priority: number;
  source: BundleSource;
  type: BundleType;
  webIndexed: boolean;
  createSourceMap: () => Promise<void>;
  generate: (opts?: { runtimeCore?: string }) => Promise<IBundleWriteResponse>;
  prepare: () => IWriterConfig;
}

export enum BundleType {
  JS_APP,
  JS_VENDOR,
  JS_SPLIT,
  CSS_APP,
  CSS_SPLIT,
}

export interface IBundleProps {
  bundleConfig?: IOutputBundleConfigAdvanced;
  ctx: Context;
  fileName?: string;
  priority?: number;
  type?: BundleType;
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

  const source = createBundleSource({ isProduction: props.ctx.config.isProduction, target });

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
    generate: async (opts?: { runtimeCore?: string }) => {
      opts = opts || {};
      if (!self.config) self.config = self.prepare();
      if (self.entries) source.entries = self.entries;
      self.data = source.generate({ isIsolated: bundleConfig.isolatedApi, runtimeCore: opts.runtimeCore });
      self.contents = self.data.content.toString();
      // writing source maps
      if (source.containsMaps) await self.createSourceMap();
      // write the bundle to fs
      await bundleWriter.write(self.config.absPath, self.contents);
      return {
        absPath: self.config.absPath,
        bundle: self,
        relativePath: self.config.relativePath,
      };
    },
    prepare: (): IWriterConfig => {
      self.config = bundleWriter.createWriter({
        fileName: props.fileName,
        hash: isProduction && self.source.generateHash(),
        userString: bundleConfig.path,
      });
      return self.config;
    },
  };
  return self;
}
