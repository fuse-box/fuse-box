import { IPublicConfig } from '../config/IConfig';
import { IRunProps } from '../config/IRunProps';
import { bundleDev } from '../development/bundleDev';
import { bundleProd } from '../production/bundleProd';

import { EnvironmentType } from '../config/EnvironmentType';
import { createContext, ICreateContextProps } from './context';
import { finalizeFusebox } from './helpers/finalizeFusebox';
import { preflightFusebox } from './helpers/preflightFusebox';

export function fusebox(publicConfig: IPublicConfig) {
  function execute(props: ICreateContextProps) {
    const ctx = createContext(props);
    preflightFusebox(ctx);
    switch (props.envType) {
      case EnvironmentType.DEVELOPMENT:
        bundleDev(ctx);
        break;
      case EnvironmentType.PRODUCTION:
        bundleProd(ctx);
        break;
    }
    finalizeFusebox(ctx);
  }
  return {
    runDev: (runProps?: IRunProps) => execute({ envType: EnvironmentType.DEVELOPMENT, publicConfig, runProps }),
    runProd: (runProps?: IRunProps) => execute({ envType: EnvironmentType.PRODUCTION, publicConfig, runProps }),
  };
}
