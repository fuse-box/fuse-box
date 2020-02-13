import { IBundleWriteResponse } from '../bundle/bundle';
import { ITarget } from '../config/ITarget';
import { Context } from '../core/context';

export interface IServer {
  target: ITarget;
  onComplete: (props: any) => void;
}

export const createServer = (ctx: Context, bundles: Array<IBundleWriteResponse>): IServer => {
  const target = ctx.config.target;

  return {
    target,
    onComplete: ({ electron, runResponse, server }): void => {
      console.log(server, electron, runResponse);
    },
  };
};
