import { IPublicConfig } from '../config/IPublicConfig';
import { IRunProps } from '../config/IRunProps';
import { bundleDev } from '../development/bundleDev';
import { bundleProd } from '../production/bundleProd';
import { createEnvContext } from './Context';
import { finalizeFusebox } from './helpers/finalizeFusebox';
import { preflightFusebox } from './helpers/preflightFusebox';

export function fusebox(config: IPublicConfig) {
  function execute(props: { config: IPublicConfig; runProps: IRunProps; type: 'development' | 'production' }) {
    const ctx = createEnvContext(props);
    preflightFusebox(ctx);
    try {
      if (props.type === 'development') {
        bundleDev(ctx);
      } else bundleProd(ctx);
    } catch (e) {
      ctx.fatal('Error', [e.stack]);
    }
    finalizeFusebox(ctx);
  }
  return {
    runDev: (runProps?: IRunProps) => {
      execute({ config, runProps, type: 'development' });
    },

    runProd: (runProps?: IRunProps) => {
      execute({ config, runProps, type: 'production' });
    },
  };
}
