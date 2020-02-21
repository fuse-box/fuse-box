import { copyFile } from '../utils/utils';
import { Context } from './context';

export class ContextTaskManager {
  private copyFilesTask: { [key: string]: string };
  constructor(private ctx: Context) {
    this.copyFilesTask = {};

    ctx.ict.on('complete', props => {
      this.perform();
      return props;
    });
    ctx.ict.on('rebundle', props => {
      this.perform();
      return props;
    });
  }

  public copyFile(original: string, target: string) {
    this.copyFilesTask[original] = target;
  }

  private async perform() {
    const promises = [];
    for (const original in this.copyFilesTask) {
      const target = this.copyFilesTask[original];
      this.ctx.log.verbose('copy', 'from $original to $target', { original, target });
      promises.push(copyFile(original, target));
    }
    return Promise.all(promises)
      .then(() => this.flush())
      .catch(e => {
        this.ctx.log.error('Error while performing a task $error', { error: e.message });
        this.flush();
      });
  }

  private flush() {
    this.copyFilesTask = {};
  }
}

export function createContextTaskManager(ctx: Context) {
  return new ContextTaskManager(ctx);
}
