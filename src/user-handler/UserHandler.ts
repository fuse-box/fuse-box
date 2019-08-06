import { EventEmitter } from 'events';
import { IBundleWriteResponse } from '../bundle/Bundle';
import { Context } from '../core/Context';
import { ElectronLauncher } from './ElectronLauncher';

export class UserHandlerComplete {
  result: Array<IBundleWriteResponse>;
  private electronLauncher;

  constructor(public initial: boolean, public ctx: Context, public bundles: Array<IBundleWriteResponse>) {}

  get electron(): ElectronLauncher {
    if (this.electronLauncher) {
      return this.electronLauncher;
    }
    if (this.ctx.config.target !== 'electron') {
      this.ctx.log.error('Cannot create Electron launchet. Target must be electron');
    } else if (this.bundles.length !== 1) {
      this.ctx.log.error('Cannot create Electron launcher. Toggle useSingleBundle = true in your configuration');
    } else {
      try {
        const electronPath = require('electron');

        this.electronLauncher = new ElectronLauncher(this.ctx, this.bundles, electronPath);
        return this.electronLauncher;
      } catch (e) {
        this.ctx.log.error('Cannot create Electron launcher. Install electron package first');
      }
    }
  }
}

export class UserHandler {
  private events: EventEmitter;

  private completeHandler: UserHandlerComplete;

  constructor(public ctx: Context) {
    this.events = new EventEmitter();
    ctx.ict.on('complete', props => {
      this.events.emit('complete', [this.createDeveloperHandlerComplete(true, ctx, props.bundles)]);
      return props;
    });

    ctx.ict.on('rebundle_complete', props => {
      this.events.emit('complete', [this.createDeveloperHandlerComplete(false, ctx, props.bundles)]);
      return props;
    });
  }

  private createDeveloperHandlerComplete(initial: boolean, ctx: Context, bundles: Array<IBundleWriteResponse>) {
    if (!this.completeHandler) {
      this.completeHandler = new UserHandlerComplete(initial, ctx, bundles);
    }
    return this.completeHandler;
  }

  public onComplete(fn: (props: UserHandlerComplete) => void) {
    this.events.addListener('complete', args => fn(args[0]));
  }

  public onChange(fn: (props: UserHandlerComplete) => void) {
    this.events.addListener('complete', args => fn(args[0]));
  }
}
