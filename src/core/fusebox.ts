import { EnvironmentType } from '../config/EnvironmentType';
import { IPublicConfig } from '../config/IConfig';
import { IRunProps } from '../config/IRunProps';
import { bundleDev } from '../development/bundleDev';
import { bundleProd } from '../production/bundleProd';
import { IRunResponse } from './IRunResponse';
import { createContext, ICreateContextProps } from './context';
import { preflightFusebox } from './helpers/preflightFusebox';

export function fusebox(publicConfig: IPublicConfig) {
  async function execute(props: ICreateContextProps): Promise<IRunResponse> {
    let response: IRunResponse;
    const ctx = createContext(props);

    ctx.isWorking = true;
    ctx.ict.sync('init', { ctx: ctx });

    preflightFusebox(ctx);
    switch (props.envType) {
      case EnvironmentType.DEVELOPMENT:
        try {
          response = await bundleDev({ ctx, rebundle: false });
        } catch (e) {
          ctx.fatal('Error during development build', [e.stack]);
        }

        break;
      case EnvironmentType.PRODUCTION:
        try {
          response = await bundleProd(ctx);
        } catch (e) {
          ctx.fatal('Error during production build', [e.stack]);
        }
        break;
    }
    ctx.isWorking = false;
    return response;
  }
  return {
    runDev: (runProps?: IRunProps): Promise<IRunResponse> =>
      execute({ envType: EnvironmentType.DEVELOPMENT, publicConfig, runProps }),
    runProd: (runProps?: IRunProps): Promise<IRunResponse> =>
      execute({ envType: EnvironmentType.PRODUCTION, publicConfig, runProps }),
  };
}
