import { File } from "../../core/File";
import { WorkFlowContext, Plugin } from "../../core/WorkflowContext";
import { IPathInformation } from '../../core/PathMaster';
import * as fs from "fs";

export abstract class VueBlockFile extends File {
  constructor(
    public context: WorkFlowContext,
    public info: IPathInformation,
    public block: any,
    public scopeId: string,
    public pluginChain: Plugin[]
  ) {
    super(context, info);
    this.ignoreCache = true;
  }

  public loadContents() {
    if (this.isLoaded) {
        return;
    }

    if (this.block.src) {
      this.contents = fs.readFileSync(this.info.absPath).toString();
    } else {
      this.contents = this.block.content;
    }

    this.isLoaded = true;
  }

  public abstract async process(): Promise<void>;
}
