import { IPublicConfig } from '../config/IPublicConfig';
import { createContext } from './Context';
import { bundleDev } from '../main/bundle_dev';
import { parseVersion } from '../utils/utils';
import { bundleProd } from '../production/main/bundle_prod';

export interface IBundleProps {}

export interface IDevelopmentProps {}
export interface IProductionProps {}

export function fusebox(config: IPublicConfig) {
  const ctx = createContext(config);
  const nodeVersion = parseVersion(process.version)[0];
  if (nodeVersion < 11) {
    ctx.log.warn(
      'You are using an older version of Node.js $version. Upgrade to at least Node.js v11 to get the maximium speed out of FuseBox',
      { version: process.version },
    );
  }
  return {
    runDev: async (props?: IDevelopmentProps) => {
      return bundleDev(ctx).catch(e => {
        console.error(e);
      });
    },
    runProd: (props?: IProductionProps) => {
      return bundleProd(ctx).catch(e => {
        console.log(e);
      });
    },
  };
}
