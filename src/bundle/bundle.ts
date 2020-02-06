import * as convertSourceMap from 'convert-source-map';
import * as offsetLinesModule from 'offset-sourcemap-lines';
import * as path from 'path';
import { BundleSource, createBundleSource } from '../bundleRuntime/bundleSource';
import { Context } from '../core/context';
import { IModule } from '../moduleResolver/module';
import { IOutputBundleConfigAdvanced } from '../output/OutputConfigInterface';
import { distWriter, IWriterConfig } from '../output/distWriter';
import { Concat } from '../utils/utils';
export interface Bundle {
  config: IWriterConfig;
  containsAPI?: boolean;
  containsApplicationEntryCall?: boolean;
  contents: string;
  data: Concat;
  entries?: Array<IModule>;
  priority: number;
  source: BundleSource;
  type: BundleType;
  webIndexed: boolean;
  createSourceMap: () => Promise<void>;
  generate: (opts?: { runtimeCore?: string }) => Promise<IBundleWriteResponse>;
  generateHMRUpdate?: () => string;
  prepare: () => IWriterConfig;
  write: () => Promise<IBundleWriteResponse>;
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
  browserPath: string;
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
    generate: async (opts?: { runtimeCore?: string; uglify?: boolean }) => {
      opts = opts || {};
      if (!self.config) self.prepare();
      if (self.entries) source.entries = self.entries;

      ctx.ict.sync('before_bundle_write', { bundle: self });
      self.data = source.generate({ isIsolated: bundleConfig.isolatedApi, runtimeCore: opts.runtimeCore });
      self.contents = self.data.content.toString();
      // writing source maps
      if (source.containsMaps) await self.createSourceMap();
      // write the bundle to fs
      return await self.write();
    },
    generateHMRUpdate: (): string => {
      const concat = source.generate({ isIsolated: false, runtimeCore: undefined });
      const rawSourceMap = concat.sourceMap;
      let stringContent = concat.content.toString();
      if (self.source.containsMaps) {
        if (rawSourceMap) {
          let json = JSON.parse(rawSourceMap);
          // since new Function wrapoer adds extra 2 lines we need to shift sourcemaps
          json = offsetLinesModule(json, 2);
          const sm = convertSourceMap.fromObject(json).toComment();
          stringContent += '\n' + sm;
        }
      }
      return stringContent;
    },
    prepare: (): IWriterConfig => {
      self.config = bundleWriter.createWriter({
        fileName: props.fileName,
        hash: isProduction && self.source.generateHash(),
        publicPath: bundleConfig.publicPath,
        userString: bundleConfig.path,
      });
      return self.config;
    },
    write: async () => {
      await bundleWriter.write(self.config.absPath, self.contents);
      return {
        absPath: self.config.absPath,
        browserPath: self.config.browserPath,
        bundle: self,
        relativePath: self.config.relativePath,
      };
    },
  };
  return self;
}
