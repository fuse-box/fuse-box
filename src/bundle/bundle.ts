import * as CleanCSS from 'clean-css';
import * as convertSourceMap from 'convert-source-map';
import * as offsetLinesModule from 'offset-sourcemap-lines';
import * as path from 'path';
import * as Terser from 'terser';
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
  exported?: boolean;
  isCSSType?: boolean;
  priority: number;
  source: BundleSource;
  type: BundleType;
  webIndexed: boolean;
  createSourceMap: (sourceMap: string) => Promise<void>;
  generate: (opts?: { runtimeCore?: string }) => Promise<IBundleWriteResponse>;
  generateHMRUpdate?: () => string;
  prepare: () => IWriterConfig;
  write: () => Promise<IBundleWriteResponse>;
  path?: string;
}

export enum BundleType {
  CSS_APP = 1,
  CSS_SPLIT = 2,
  JS_APP = 3,
  JS_SERVER_ENTRY = 4,
  JS_SPLIT = 5,
  JS_VENDOR = 6,
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

  const isCSS = type === BundleType.CSS_APP || type === BundleType.CSS_SPLIT;
  const source = createBundleSource({
    isCSS: isCSS,
    isProduction: props.ctx.config.isProduction,
    target,
  });

  const shouldCleanCSS = !!ctx.config.cleanCSS;
  function optimizeCSS(self: Bundle) {
    let userProps = {};
    if (typeof ctx.config.cleanCSS === 'object') userProps = ctx.config.cleanCSS;

    const response = new CleanCSS({
      ...userProps,
      sourceMap: source.containsMaps,
      sourceMapInlineSources: true,
    }).minify(self.data.content.toString(), self.data.sourceMap);
    self.data = ({ sourceMap: response.sourceMap, content: response.styles } as unknown) as Concat;
  }

  const self: Bundle = {
    config: null,
    contents: null,
    data: null,
    isCSSType: isCSS,
    priority,
    source,
    type,
    webIndexed,
    createSourceMap: async (sourceMap: string) => {
      const sourceMapName = path.basename(self.config.relativePath) + '.map';
      if (isCSS) {
        // just in case remove the existing sourcemap references
        // some css preprocessors add it
        self.contents = self.contents.replace(/\/\*\#\s?sourceMappingURL.*?\*\//g, '');
        self.contents += `\n/*#  sourceMappingURL=${sourceMapName} */`;
      } else {
        self.contents += `\n//# sourceMappingURL=${sourceMapName}`;
      }
      const targetDir = path.dirname(self.config.absPath);
      const sourceMapFile = path.join(targetDir, sourceMapName);

      await bundleWriter.write(sourceMapFile, sourceMap);
    },
    generate: async (opts?: { runtimeCore?: string; uglify?: boolean }) => {
      opts = opts || {};
      if (!self.config) self.prepare();
      if (self.entries) {
        source.entries = self.entries;
        if (self.exported) source.exported = true;
      }

      ctx.ict.sync('before_bundle_write', { bundle: self });
      self.data = source.generate({ isIsolated: bundleConfig.isolatedApi, runtimeCore: opts.runtimeCore });

      if (isCSS && shouldCleanCSS) optimizeCSS(self);

      self.contents = self.data.content.toString();

      let sourceMap;
      if (source.containsMaps && self.data.sourceMap) {
        sourceMap = self.data.sourceMap.toString();
      }

      if (ctx.config.isProduction && !self.isCSSType && opts.uglify) {
        const terserOpts: any = {
          sourceMap: source.containsMaps
            ? {
                content: self.data.sourceMap,
                includeSources: true,
              }
            : undefined,
        };
        ctx.log.info('minify', self.config.absPath);
        const result = await Terser.minify(self.contents, terserOpts);
        self.contents = result.code;
        if (source.containsMaps && result.map) {
          sourceMap = result.map.toString();
        }
      }
      // writing source maps
      if (source.containsMaps) await self.createSourceMap(sourceMap);
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
