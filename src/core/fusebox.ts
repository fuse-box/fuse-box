import * as ts from 'typescript';
import { IPublicConfig } from '../config/IPublicConfig';
import { IRunProps } from '../config/IRunProps';
import { FuseBoxLogAdapter } from '../fuse-log/FuseBoxLogAdapter';
import { bundleDev } from '../main/bundle_dev';
import { IProductionContext } from '../production/ProductionContext';
import { bundleProd, productionPhases } from '../production/bundleProd';
import { UserHandler } from '../user-handler/UserHandler';
import { parseVersion } from '../utils/utils';
import { Context } from './Context';

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
    runDev: async (props?: IRunProps) => {
      const ctx = new Context(config, props);
      ctx.setDevelopment();

      checkVersion(ctx.log);

      return bundleDev(ctx).catch(e => {
        console.error(e);
      });
    },
    runProd: (props?: IRunProps): Promise<any> => {
      const ctx = new Context(config, props);
      ctx.setProduction(props);

      if (props && props.handler) {
        props.handler(new UserHandler(ctx));
      }
      bundleProd(ctx);

      // return bundleProd(ctx);
      return Promise.resolve();
    },
    runProductionContext: (phases, props?: IRunProps): Promise<IProductionContext> => {
      const ctx = new Context(config, props);
      ctx.setProduction(props);
      ctx.createOutputConfig(props ? props.bundles : undefined);
      return productionPhases(ctx, phases);
    },
  };
}
