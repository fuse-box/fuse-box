import * as convertSourceMap from 'convert-source-map';
import { devStrings } from '../bundle/bundleStrings';
import { inflatePackage } from '../bundle/createDevBundles';
import { Context } from '../core/Context';
import { Module } from '../core/Module';
import { Package } from '../core/Package';
import { Concat, createConcat, offsetLines } from '../utils/utils';

export interface IGenerateHMRContentProps {
  modules: Array<Module>;
  packages?: Array<Package>;
  ctx: Context;
}

export interface IHMRModuleUpdate {
  content: string;
  fuseBoxPath: string;
}

export interface IHMRUpdate {
  modules: Array<IHMRModuleUpdate>;
  packages: Array<{ name: string; content: string }>;
}
export function generateHMRContent(props: IGenerateHMRContentProps): IHMRUpdate {
  const { ctx } = props;
  const config = ctx.config;

  let packageUpdate: Array<{ name: string; content: string }> = [];
  if (props.packages) {
    packageUpdate = props.packages.map(pkg => {
      const name = pkg.getPublicName();
      if (pkg.isCached) {
        return { name, content: pkg.cache.contents };
      } else {
        const inflated = inflatePackage(ctx, pkg);

        return { name, content: inflated.content.toString() };
      }
    });
  }

  const response: Array<IHMRModuleUpdate> = [];
  props.modules.forEach(module => {
    let requireSourceMaps = false;
    const pkg = module.pkg;
    const packageName = module.pkg.getPublicName();
    if (pkg.isDefaultPackage && config.sourceMap.project) {
      requireSourceMaps = true;
    }
    if (!pkg.isDefaultPackage && config.sourceMap.vendor) {
      requireSourceMaps = true;
    }

    if (module.isExecutable()) {
      let concat: Concat;
      if (module.isCached) {
        concat = createConcat(requireSourceMaps, '', '\n');
        concat.add(null, devStrings.openPackage(packageName, {}));
        concat.add(null, module.cache.contents, requireSourceMaps ? module.cache.sourceMap : undefined);
        concat.add(null, devStrings.closePackage());
      } else {
        const data = module.generate();
        concat = createConcat(requireSourceMaps, '', '\n');
        concat.add(null, devStrings.openPackage(packageName, {}));
        concat.add(null, devStrings.openFile(module.props.fuseBoxPath));
        concat.add(null, data.contents, requireSourceMaps ? data.sourceMap : undefined);
        concat.add(null, devStrings.closeFile());
        concat.add(null, devStrings.closePackage());
      }
      let stringContent = concat.content.toString();
      const rawSourceMap = concat.sourceMap;
      if (rawSourceMap && requireSourceMaps) {
        let json = JSON.parse(rawSourceMap);
        // since new Function wrapoer adds extra 2 lines we need to shift sourcemaps
        json = offsetLines(json, 2);
        const sm = convertSourceMap.fromObject(json).toComment();
        stringContent += '\n' + sm;
      }
      response.push({ content: stringContent, fuseBoxPath: `${pkg.getPublicName()}/${module.props.fuseBoxPath}` });
    }
  });
  return {
    packages: packageUpdate,
    modules: response,
  };
}
