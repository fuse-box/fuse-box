import { ChildProcess, spawn, SpawnOptions } from 'child_process';
import { BundleType, IBundleWriteResponse } from '../bundle/Bundle';
import { Context } from '../core/Context';

interface handleEntryProps {
  nodeArgs: Array<string>
  scriptArgs: Array<string>
  options?: SpawnOptions
}

export class ServerLauncher {
  private childProcess: ChildProcess;
  constructor(public ctx: Context, public response: Array<IBundleWriteResponse>) {}

  public kill() {
    if (this.childProcess) this.childProcess.kill();
  }
  public handleEntry(props?: handleEntryProps) {
    this.kill();
    const nodeArgs = props && props.nodeArgs || [];
    const scriptArgs = props && props.scriptArgs || [];
    const options = props && props.options || {};
    const env = {
      ...process.env,
      ...this.ctx.config.env,
      ...options.env
    };

    const serverEntry = this.response.find(item => item.bundle.props.type == BundleType.SERVER_ENTRY);
    if (!serverEntry) {
      return this.ctx.fatal('Server entry was not found', ['Make sure your dist contains server entry']);
    }

    this.childProcess = spawn('node', [...nodeArgs, serverEntry.stat.absPath, ...scriptArgs], {
      stdio: 'inherit',
      ...options,
      env,
    });

    this.childProcess.on('close', code => {
			if (code === 8) {
				this.ctx.fatal('Server quit unexpectedly. Will retry when new changes are bundled.')
			}
		})
  }
}
