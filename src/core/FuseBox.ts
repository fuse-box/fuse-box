import { IPublicConfig } from '../config/IPublicConfig';
import { ILogger } from '../logging/logging';
import { bundleDev } from '../main/bundle_dev';
import { bundleProd } from '../production/bundle_prod';
import { parseVersion } from '../utils/utils';
import { createContext, createProdContext } from './Context';
import { IProductionProps } from '../config/IProductionProps';

export interface IBundleProps {}

export interface IDevelopmentProps {}

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
      const ctx = createProdContext(config, props);
      return bundleProd(ctx).catch(e => {
        console.log(e);
      });
    },
  };
}
