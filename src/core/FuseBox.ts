import { IPublicConfig } from '../config/IPublicConfig';
import { createContext } from './Context';
import { bundleDev } from '../main/bundle_dev';

export interface IBundleProps {}

export interface IDevelopmentProps {}
export interface IProductionProps {}

export function fusebox(config: IPublicConfig) {
  const ctx = createContext(config);
  return {
    runDev: async (props?: IDevelopmentProps) => {
      return bundleDev(ctx).catch(e => {
        console.error(e);
      });
    },
    runProd: (props: IProductionProps) => {},
  };
}
