import * as path from 'path';
import { Context } from '../../core/Context';
import { joinFuseBoxPath, fileExists, fastHash, path2RegexPattern } from '../../utils/utils';
import { defineResourceGroup } from '../../stylesheet/cssResolveURL';
import { Module } from '../../core/Module';
import { wrapContents } from '../pluginStrings';

export interface IPluginLinkOptions {
  useDefault?: boolean;
  resourcePublicRoot?: string;
}

export function pluginLinkHandler(module: Module, options?: IPluginLinkOptions) {
  const ctx = module.props.ctx;
  const resourceConfig = ctx.config.getResourceConfig();
  const resourcePublicRoot = ctx.config.getPublicRoot(
    options.resourcePublicRoot ? options.resourcePublicRoot : ctx.config.link.resourcePublicRoot,
  );
  const target = module.props.absPath;
  let fileGroup;
  if (ctx.config.stylesheet.groupResourcesFilesByType) {
    fileGroup = defineResourceGroup(path.extname(target).toLowerCase());
  }

  let name = fastHash(target) + path.extname(target);
  if (fileGroup) {
    name = fileGroup + '/' + name;
  }

  const publicPath = joinFuseBoxPath(resourcePublicRoot, name);
  const destination = path.join(resourceConfig.resourceFolder, name);

  module.captured = true;
  ctx.log.info('link', 'Captured $file with <bold>pluginLink</bold>', {
    file: module.props.absPath,
  });

  if (!fileExists(destination)) {
    ctx.taskManager.copyFile(module.props.absPath, destination);
  }

  module.contents = wrapContents(
    JSON.stringify(publicPath),
    options.useDefault !== undefined ? options.useDefault : ctx.config.link.useDefault,
  );
}

export function pluginLink(target: string | RegExp, options?: IPluginLinkOptions) {
  let matcher: RegExp;
  if (typeof target === 'string') {
    matcher = path2RegexPattern(target);
  } else matcher = target;
  options = options || {};

  return (ctx: Context) => {
    ctx.ict.on('bundle_resolve_module', props => {
      if (!props.module.captured) {
        // filter out options

        if (!matcher.test(props.module.props.absPath)) {
          return;
        }

        pluginLinkHandler(props.module, options);
      }
      return props;
    });
  };
}
