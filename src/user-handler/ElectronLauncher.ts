import { IBundleWriteResponse } from '../bundle/Bundle';
import { Context } from '../core/Context';
import { spawn } from 'child_process';
import { onExit } from '../utils/exit';

export class ElectronLauncher {
  private node;
  constructor(public ctx: Context, public response: Array<IBundleWriteResponse>, public electronPath: string) {}

  public kill() {
    if (this.node) this.node.kill();
  }
  public handleMainProcess() {
    this.kill();
    const firstBundle = this.response[0];
    this.node = spawn(this.electronPath, [firstBundle.stat.absPath], {
      stdio: 'inherit',
    });
    onExit('ElectronLauncher', () => {
      this.kill();
    });
  }
}
