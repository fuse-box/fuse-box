import { IPublicConfig } from '../../config/IConfig';
import { fastHash } from '../../utils/utils';
import { IWebWorkerProcessProps } from './interfaces';

export class WebWorkerProcess {
  public bundleName: string;
  public isRunning: boolean;
  constructor(public props: IWebWorkerProcessProps) {
    //this.props.item.worker = this;
    this.isRunning = false;
    const amount = 1; //Object.keys(props.ctx.webWorkers).length + 1;
    this.bundleName = `worker${amount}_${fastHash(this.props.item.absPath)}`;
  }

  public resolveWebWorkerBundlePath(): string {
    // making it resolve properly
    if (this.props.ctx.webIndex && this.props.ctx.webIndex.resolve) {
      this.props.item.bundlePath = this.props.ctx.webIndex.resolve(this.bundleName) + '.js';
    }
    return this.props.item.bundlePath;
  }

  public async run(customConfig?: IPublicConfig) {
    //   if (this.isRunning) return;
    //   this.isRunning = true;
    //   const ctx = this.props.ctx;
    //   ctx.log.info('worker', 'Worker process start $path', { path: this.props.item.absPath });
    //   let config: IPublicConfig = {
    //     // share the same cache object
    //     // cacheObject: ctx.cache,
    //     cache: ctx.config.cache && ctx.config.cache.enabled,
    //     devServer: false,
    //     entry: this.props.item.absPath,
    //     hmr: false,
    //     homeDir: ctx.config.homeDir,
    //     logging: { level: 'disabled' },
    //     plugins: [
    //       localCtx => {
    //         localCtx.ict.on('rebundle_complete', p => {
    //           ctx.log.info('worker', 'Worker re-bundled $worker', {
    //             worker: this.props.item.absPath,
    //           });
    //           return p;
    //         });
    //         // localCtx.ict.on('before_bundle_write', p => {
    //         //   p.bundle.name = this.bundleName;
    //         //   return p;
    //         // });
    //       },
    //     ],
    //     target: 'web-worker',
    //     watch: ctx.config.watch.enabled,
    //   };
    //   if (customConfig) {
    //     // add missing stuff to the configuartion
    //     // but don't allow override the compulsory configuration
    //     config = { ...customConfig, ...config };
    //     // need to add plugins here if exist
    //     if (ctx.config.webWorkers.config.plugins) {
    //       config.plugins = config.plugins.concat(customConfig.plugins);
    //     }
    //     // allow override watch property
    //     if (ctx.config.webWorkers.config.watch) {
    //       config.watch = customConfig.watch;
    //     }
    //   }
    //   const fuse = fusebox(config);
    //   if (ctx.config.production) {
    //     await fuse.runProd(ctx.config.production);
    //     ctx.log.info('worker', 'Worker bundled (production) $worker', {
    //       worker: this.props.item.absPath,
    //     });
    //   } else {
    //     ctx.log.info('worker', 'Worker bundled (development) $worker', {
    //       worker: this.props.item.absPath,
    //     });
    //     await fuse.runDev();
    //   }
  }
}
export function registerWebWorkerProcess(props: IWebWorkerProcessProps) {
  const workerProcess = new WebWorkerProcess(props);
  props.ctx.log.info('worker', 'registered ' + props.item.absPath);
  //props.ctx.webWorkers[props.item.absPath] = workerProcess;
  return workerProcess;
}
