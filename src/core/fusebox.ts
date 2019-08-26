import { IPublicConfig } from '../config/IPublicConfig';
import { ILogger } from '../logging/logging';
import { bundleDev } from '../main/bundle_dev';
import { bundleProd } from '../production/bundle_prod';
import { parseVersion } from '../utils/utils';
import { createContext, createProdContext } from './Context';
import { IProductionProps } from '../config/IProductionProps';
import * as ts from 'typescript';
import { UserHandler } from '../user-handler/UserHandler';
import { IProductionResponse } from '../production/main';
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
    const tsVersion = parseVersion(ts.version);
    if (tsVersion[0] < 3) {
      log.warn('You are using an older version of TypeScript $version. FuseBox builds might not work properly', {
        version: tsVersion,
      });
    }
  }
  return {
    runDev: async (cb?: (handler: UserHandler) => void) => {
      const ctx = createContext(config);
      if (cb) cb(new UserHandler(ctx));

      checkVersion(ctx.log);
      return bundleDev(ctx).catch(e => {
        console.error(e);
      });
    },
    runProd: (props?: IProductionProps): Promise<IProductionResponse> => {
      const ctx = createProdContext(config, props);

      if (props && props.handler) {
        props.handler(new UserHandler(ctx));
      }
      return bundleProd(ctx);
    },
  };
}
