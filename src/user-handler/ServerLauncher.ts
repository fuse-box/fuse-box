import { spawn, SpawnOptions } from 'child_process';
import { BundleType, IBundleWriteResponse } from '../bundle/Bundle';
import { Context } from '../core/Context';

interface handleEntryProps {
  nodeArgs: Array<string>
  scriptArgs: Array<string>
  options?: SpawnOptions
}

export class ServerLauncher {
  private node;
  constructor(public ctx: Context, public response: Array<IBundleWriteResponse>) {}

  public kill() {
    if (this.node) this.node.kill();
  }
  public handleEntry(props?: handleEntryProps) {
    this.kill();
    const nodeArgs = props && props.nodeArgs || [];
    const scriptArgs = props && props.scriptArgs || [];
    const options = props && props.options || {};
    const serverEntry = this.response.find(item => item.bundle.props.type == BundleType.SERVER_ENTRY);
    if (!serverEntry) {
      return this.ctx.fatal('Server entry was not found', ['Make sure your dist contains server entry']);
    }
    this.node = spawn('node', [...nodeArgs, serverEntry.stat.absPath, ...scriptArgs], {
      stdio: 'inherit',
      ...options,
    });
  }
}
