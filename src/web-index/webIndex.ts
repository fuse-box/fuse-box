import { join } from 'path';
import { IBundleWriteResponse, BundleType } from '../bundle/bundle';
import { Context } from '../core/Context';
import { env } from '../core/env';
import { ensureAbsolutePath, fileExists, readFile, joinFuseBoxPath } from '../utils/utils';
import { htmlStrings } from './htmlStrings';

export interface IWebIndexConfig {
  target?: string;
  template?: string;
  distFileName?: string;
  publicPath?: string;
}
export interface IWebIndexInterface {
  isDisabled?: boolean;

  generate?: (bundles: Array<IBundleWriteResponse>) => void;
}

export function replaceWebIndexStrings(str: string, keys: { [key: string]: any }) {
  return str.replace(/\$([a-z_-]+)/gi, (_var, name) => {
    return keys[name] !== undefined ? (typeof keys[name] === 'object' ? JSON.stringify(keys[name]) : keys[name]) : '';
  });
}

export function getEssentialWebIndexParams(config: IWebIndexConfig | boolean) {
  let templatePath = join(__dirname, 'template.html');
  let publicPath = '/';
  let distFileName = 'index.html';
  if (typeof config === 'object') {
    if (config.template) {
      templatePath = ensureAbsolutePath(config.template, env.SCRIPT_PATH);
      if (!fileExists(templatePath)) {
        throw new Error(`Failed to find webindex ${templatePath}`);
      }
    }
    if (config.publicPath) {
      publicPath = config.publicPath;
    }

    if (config.distFileName) {
      distFileName = config.distFileName;
    }
  }
  return {
    distFileName,
    publicPath,
    templatePath,
  };
}

export function createWebIndex(ctx: Context): IWebIndexInterface {
  const config = ctx.config.webIndex;
  const isDisabled = config === false || config === undefined;
  const logger = ctx.log;
  if (isDisabled) {
    return { isDisabled };
  }

  logger.info('WebIndex enabled, processing ...');

  return {
    generate: async (bundles: Array<IBundleWriteResponse>) => {
      const opts = getEssentialWebIndexParams(config);

      const scriptTags = [];
      const cssTags = [];

      const sorted = bundles.sort((a, b) => a.bundle.props.priority - b.bundle.props.priority);
      sorted.forEach(item => {
        if (item.bundle.props.webIndexed) {
          if (item.bundle.props.type === BundleType.CSS) {
            scriptTags.push(htmlStrings.cssTag(joinFuseBoxPath(opts.publicPath, item.stat.relBrowserPath)));
          } else {
            cssTags.push(htmlStrings.scriptTag(joinFuseBoxPath(opts.publicPath, item.stat.relBrowserPath)));
          }
        }
      });
      let contents = replaceWebIndexStrings(readFile(opts.templatePath), {
        bundles: scriptTags.join('\n'),
        css: cssTags.join('\n'),
      });

      logger.info('Writing WebIndex to $name', { name: opts.distFileName });
      await ctx.writer.write(opts.distFileName, contents);
    },
  };
}
