import { ITarget } from '../../config/PrivateConfig';
export interface ITranspiler {
  ast: any;
  target: ITarget;
  moduleFileName?: string;
  env: { [key: string]: string };
  isBrowser: boolean;
  isServer: boolean;
}
