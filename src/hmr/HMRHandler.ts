import { FuseBox } from "../core/FuseBox";
import { HMRClient } from "./HMRClient";
import { ISourceChangedHMR } from "./interfaces";

export class HMRHandler extends HMRClient {
	constructor(public client: any, public fuse: FuseBox) {
		super(client, fuse);
	}

	public onUpdateBundleErrors(data: any) {
		return data;
	}

	public onBundleError(data: any) {
		return data;
	}

	public onDependencyUpdate(data) {
		this.fuse.context.log.echo(`Sending dependency update`);
		return data;
	}

	public onSourceChanged(data: ISourceChangedHMR) {
		this.fuse.context.log.echo(`Sending an HMR update changed for ${data.path}`);
		return data;
	}
}
