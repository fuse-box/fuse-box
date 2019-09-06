import { spawn } from 'child_process';
import { BundleType, IBundleWriteResponse } from '../bundle/Bundle';
import { Context } from '../core/Context';

export class ServerLauncher {
  private node;
  constructor(public ctx: Context, public response: Array<IBundleWriteResponse>) {}

  public kill() {
    if (this.node) this.node.kill();
  }
  public handleEntry(props?: { nodeArgs: Array<string>; scriptArgs: Array<string> }) {
    this.kill();
    let nodeArgs = [];
    let scriptArgs = [];
    if (props) {
      if (props.nodeArgs) nodeArgs = props.nodeArgs;
      if (props.scriptArgs) scriptArgs = props.scriptArgs;
    }

    const serverEntry = this.response.find(item => item.bundle.props.type == BundleType.SERVER_ENTRY);
    if (!serverEntry) {
      return this.ctx.fatal('Server entry was not found', ['Make sure your dist contains server entry']);
    }
    this.node = spawn('node', [...nodeArgs, serverEntry.stat.absPath, ...scriptArgs], {
      stdio: 'inherit',
    });
  }
}
