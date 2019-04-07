import { Module } from '../core/Module';
import { createConcat, offsetLines } from '../utils/utils';
import { Context } from '../core/Context';
import { devStrings } from '../bundle/bundleStrings';
import * as convertSourceMap from 'convert-source-map';

export interface IGenerateHMRContentProps {
  modules: Array<Module>;
  ctx: Context;
}

export interface IHMRModuleUpdate {
  content: string;
  fuseBoxPath: string;
}

export interface IHMRUpdate {
  modules: Array<IHMRModuleUpdate>;
}
export function generateHMRContent(props: IGenerateHMRContentProps): IHMRUpdate {
  const { ctx } = props;
  const config = ctx.config;

  const response: Array<IHMRModuleUpdate> = [];
  props.modules.forEach(module => {
    let requireSourceMaps = false;
    const pkg = module.pkg;
    const packageName = module.pkg.getPublicName();
    if (pkg.isDefaultPackage && config.options.projectSourceMap) {
      requireSourceMaps = true;
    }
    if (!pkg.isDefaultPackage && config.options.vendorSourceMap) {
      requireSourceMaps = true;
    }

    if (module.contents) {
      const concat = createConcat(requireSourceMaps, '', '\n');
      concat.add(null, devStrings.openPackage(packageName, {}));
      concat.add(null, devStrings.openFile(module.props.fuseBoxPath));
      module.header.forEach(h => concat.add(null, h));
      concat.add(null, module.contents, requireSourceMaps ? module.sourceMap : undefined);
      concat.add(null, devStrings.closeFile());
      concat.add(null, devStrings.closePackage());

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
    modules: response,
  };
}
