import { IPublicConfig } from '../config/IPublicConfig';
import { createContext, createProductionContext, createProdContext } from './Context';
import { bundleDev } from '../main/bundle_dev';
import { parseVersion } from '../utils/utils';
import { bundleProd } from '../production/bundle_prod';
import { ILogger } from '../logging/logging';

export interface IBundleProps {}

export interface IDevelopmentProps {}
export interface IProductionProps {}

export function fusebox(config: IPublicConfig) {
  function checkVersion(log: ILogger) {
    const nodeVersion = parseVersion(process.version)[0];
    if (nodeVersion < 11) {
      log.warn(
        'You are using an older version of Node.js $version. Upgrade to at least Node.js v11 to get the maximium speed out of FuseBox',
        { version: process.version },
      );
    }
  }
  return {
    runDev: async (props?: IDevelopmentProps) => {
      const ctx = createContext(config);
      checkVersion(ctx.log);
      return bundleDev(ctx).catch(e => {
        console.error(e);
      });
    },
    runProd: (props?: IProductionProps) => {
      const ctx = createProdContext(config);
      return bundleProd(ctx).catch(e => {
        console.log(e);
      });
    },
  };
}
