import * as ts from 'typescript';
import { IProductionProps } from '../config/IProductionProps';
import { IPublicConfig } from '../config/IPublicConfig';
import { FuseBoxLogAdapter } from '../fuse-log/FuseBoxLogAdapter';
import { bundleDev } from '../main/bundle_dev';
import { UserHandler } from '../user-handler/UserHandler';
import { parseVersion } from '../utils/utils';
import { createContext, createProdContext } from './Context';
import { bundleProd } from '../production/bundleProd';

export interface IDevelopmentProps {}

export function fusebox(config: IPublicConfig) {
  function checkVersion(log: FuseBoxLogAdapter) {
    // process.on('uncaughtException', e => {
    //   console.log(e);
    // });

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
    runProd: (props?: IProductionProps) => {
      console.log('not implemented yet');
      const ctx = createProdContext(config, props);

      if (props && props.handler) {
        props.handler(new UserHandler(ctx));
      }
      bundleProd(ctx);
      // return bundleProd(ctx);
    },
  };
}
