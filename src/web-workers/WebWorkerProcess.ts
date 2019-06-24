import { Context } from '../core/Context';
import { IResolver } from '../resolver/resolver';
import { fusebox } from '../core/fusebox';

export interface IWebWorkerProcessProps {
  ctx: Context;
  resolved: IResolver;
}
export class WebWorkerProcess {
  constructor(public props: IWebWorkerProcessProps) {}

  public async startDev() {
    const ctx = this.props.ctx;
    const fuse = fusebox({
      homeDir: ctx.config.homeDir,
      target: 'web-worker',
      entry: this.props.resolved.absPath,
      devServer: false,
      hmr: false,
      logging: { level: 'disabled' },
      watch: true,
    });
    await fuse.runDev();
    ctx.log.print('<magenta>Worker bundled </magenta><dim> $worker</dim>', { worker: this.props.resolved.absPath });
  }
}
export function registerWebWorkerProcess(props: IWebWorkerProcessProps) {
  const workerProcess = new WebWorkerProcess(props);
  props.ctx.registerWebWorker(workerProcess);
}
