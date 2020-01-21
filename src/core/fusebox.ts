import { IPublicConfig } from '../config/IPublicConfig';
import { IRunProps } from '../config/IRunProps';
import { bundleDev } from '../development/bundleDev';
import { bundleProd } from '../production/bundleProd';
import { UserHandler } from '../userHandler/UserHandler';
import { createContext } from './Context';
import { finalizeFusebox } from './helpers/finalizeFusebox';
import { preflightFusebox } from './helpers/preflightFusebox';

export function fusebox(config: IPublicConfig) {
  return {
    runDev: (props?: IRunProps) => {
      const ctx = createContext(config, props);
      ctx.setDevelopment();

      preflightFusebox(ctx);

      try {
        bundleDev(ctx);
      } catch (e) {
        ctx.fatal('bundleDev ran into a fatal error', [e.stack]);
      }

      finalizeFusebox(ctx);
    },

    runProd: (props?: IRunProps) => {
      const ctx = createContext(config, props);
      ctx.setProduction(props);

      preflightFusebox(ctx);

      if (props && props.handler) {
        props.handler(new UserHandler(ctx));
      }

      try {
        bundleProd(ctx);
      } catch (e) {
        ctx.fatal('bundleProd ran into a fatal error', [e.stack]);
      }

      finalizeFusebox(ctx);
    },
  };
}
