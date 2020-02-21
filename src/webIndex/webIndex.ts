import { join } from 'path';
import { BundleType, IBundleWriteResponse } from '../bundle/bundle';
import { Context } from '../core/context';
import { env } from '../env';
import { FuseBoxLogAdapter } from '../fuseLog/FuseBoxLogAdapter';
import { resolveCSSResource } from '../stylesheet/cssResolveURL';
import { ensureAbsolutePath, fileExists, joinFuseBoxPath, readFile } from '../utils/utils';
import { htmlStrings } from './htmlStrings';

export interface IWebIndexConfig {
  distFileName?: string;
  embedIndexedBundles?: boolean;
  enabled?: boolean;
  publicPath?: string;
  target?: string;
  template?: string;
}

export interface IWebIndexInterface {
  isDisabled?: boolean;
  addBundleContent?: (content: string) => void;
  generate?: (bundles: Array<IBundleWriteResponse>) => void;
  resolve?: (userPath: string) => string;
}

export function replaceWebIndexStrings(str: string, keys: Record<string, any>) {
  return str.replace(/\$([a-z_-]+)/gi, (_var, name) => {
    return keys[name] !== undefined ? (typeof keys[name] === 'object' ? JSON.stringify(keys[name]) : keys[name]) : '';
  });
}

export function getEssentialWebIndexParams(config: IWebIndexConfig | boolean, log: FuseBoxLogAdapter) {
  let templatePath = join(env.FUSE_MODULES, 'web-index-default-template/template.html');
  let publicPath = '/';
  let distFileName = 'index.html';
  let templateContent = readFile(templatePath);
  if (typeof config === 'object') {
    if (config.template) {
      templatePath = ensureAbsolutePath(config.template, env.SCRIPT_PATH);
    }
    if (config.publicPath) {
      publicPath = config.publicPath;
    }

    if (config.distFileName) {
      distFileName = config.distFileName;
    }
  }

  if (fileExists(templatePath)) {
    templateContent = readFile(templatePath);
  } else {
    log.warn('No webIndex template found, using default HTML template instead.');
  }

  return {
    distFileName,
    publicPath,
    templateContent,
    templatePath,
  };
}

export function createWebIndex(ctx: Context): IWebIndexInterface {
  const config = ctx.config.webIndex;
  const isDisabled = config.enabled === false;
  const logger = ctx.log;
  if (isDisabled) {
    return { isDisabled };
  }

  let lateBundles;
  let opts;
  const self = {
    generate: async (bundles: Array<IBundleWriteResponse>) => {
      opts = getEssentialWebIndexParams(config, ctx.log);
      // memorize those to re-generate webIndex is needed
      lateBundles = bundles;
      const scriptTags = [];
      const cssTags = [];

      bundles.sort((a, b) => a.bundle.priority - b.bundle.priority);
      bundles.forEach(item => {
        const isCSS = item.bundle.type === BundleType.CSS_APP;
        if (item.bundle.webIndexed) {
          if (isCSS) {
            cssTags.push(htmlStrings.cssTag(item.browserPath));
          } else {
            scriptTags.push(htmlStrings.scriptTag(item.browserPath));
          }
        }
      });
      let fileContents = opts.templateContent;
      fileContents = fileContents.replace(/\$import\('(.+?)'\)/g, (_, relPath: string) => {
        const result = resolveCSSResource(relPath, {
          contents: '',
          ctx,
          filePath: opts.templatePath,
          options: ctx.config.stylesheet,
        });
        if (result) {
          return result.publicPath;
        } else {
          ctx.log.warn(`Unable to resolve ${result.original}`);
          return '';
        }
      });

      const scriptOpts = {
        bundles: scriptTags.join('\n'),
        css: cssTags.join('\n'),
      };
      fileContents = replaceWebIndexStrings(fileContents, scriptOpts);

      logger.info('webindex', '<dim>writing to $name</dim>', {
        name: opts.distFileName,
      });
      await ctx.writer.write(opts.distFileName, fileContents);
    },
    resolve: (userPath: string) => {
      return joinFuseBoxPath(opts.publicPath, userPath);
    },
  };

  ctx.ict.on('watcher_reaction', ({ reactionStack }) => {
    for (const item of reactionStack) {
      if (opts && item.absPath === opts.templatePath && lateBundles) {
        logger.info(
          'webindex',
          '<magenta><bold>Detected changes to webIndex source. Will regenerate now</bold></magenta>',
          {
            name: opts.distFileName,
          },
        );
        self.generate(lateBundles).then(() => {
          ctx.sendPageReload('webindex change');
        });
      }
    }
  });
  ctx.ict.on('complete', ({ bundles }) => self.generate(bundles));
  return self;
}
