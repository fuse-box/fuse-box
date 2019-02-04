import { FuseBox } from "../core/FuseBox";
import { WorkFlowContext } from "../core/WorkflowContext";
import { IDependencyRequestHMR } from "./interfaces";
import { File } from "../core/File";
export class HMRClient {
	public context: WorkFlowContext;
	constructor(public client: any, public fuse: FuseBox) {
		this.context = this.fuse.context;
		this.onClientConnectionEstablished();
	}

	public onClientConnectionEstablished() {
		this.fuse.context.log.echo("Client connected");

		this.client.on("message", message => {
			let input = JSON.parse(message);
			if (input.event) {
				this.onMessage(input.event, input.data);
			}
		});
	}

	protected onMessage(type: string, data: any) {
		if (type === "request-dependency") {
			if (this.fuse.context) {
				this.onHMRRequestDependency(JSON.parse(data));
			}
		}
	}

	public emit(eventName, data: any) {
		const events = {
			"hosted-css": "onSourceChanged",
			css: "onSourceChanged",
			"source-changed": "onSourceChanged",
			"update-bundle-errors": "onUpdateBundleErrors",
			"bundle-error": "onBundleError",
			"dependency-update": "onDependencyUpdate",
		};
		let result: any;
		if (events[eventName]) {
			if (typeof this[events[eventName]] === "function") {
				result = this[events[eventName]](data);
			}
		}
		if (result) {
			this.client.send(JSON.stringify({ event: eventName, data: result }));
		}
	}

	private onHMRRequestDependency(input: IDependencyRequestHMR) {
		const defaultCollection = this.fuse.producer.defaultCollection;
		const vendors = [];
		const updateList: any = [];
		const walkFiles = (files: Array<File>) => {
			files.forEach(file => {
				if (!file.info.isNodeModule) {
					const hmrContent = file.getHMRContent();
					if (hmrContent) {
						updateList.push({
							content: hmrContent,
							path: file.info.fuseBoxPath,
							package: this.context.defaultPackageName,
						});
					}
					if (file.resolvedDependencies) {
						walkFiles(file.resolvedDependencies);
					}
				} else {
					vendors.push(file.info.nodeModuleName);
				}
			});
		};

		// missing node modules
		input.files.map(f => {
			if (f.module !== defaultCollection.name) {
				vendors.push(f.module);
			}
		});
		defaultCollection.dependencies.forEach(file => {
			const info = file.info;
			if (!info.isNodeModule) {
				const target = input.files.find(i => i.path === info.fuseBoxPath);
				if (target) {
					walkFiles([file]);
				}
			} else {
				vendors.push(file.info.nodeModuleName);
			}
		});
		this.emit("dependency-update", { originalHMRRequest: input.original, files: updateList, vendors });
	}
}
