import * as ts from "typescript";
import * as WebSocket from "ws";
import { IGenericPoolResource } from "./GenericPool";
export class WorkerConnection implements IGenericPoolResource {
	private socketIsOpened: boolean;
	private isReady: boolean;
	private ws: WebSocket;
	private tasks;
	constructor(public port: number) {
		this.socketIsOpened = false;
		this.isReady = true;
		this.tasks = {};
	}

	initialize(): void {
		this.ws = new WebSocket(`ws://localhost:${this.port}`);
		this.ws.on("open", () => {
			this.socketIsOpened = true;
		});

		this.ws.on("message", data => {
			const response: any = JSON.parse(data);
			if (response.id && this.tasks[response.id]) {
				this.tasks[response.id](response.response);
			}
		});

		this.ws.on("error", data => {
			console.log(`failed to connect ${this.port}`);
			this.ws.close();
		});
	}

	private async sendRequest(method: string, args?: Array<any>): Promise<any> {
		const data: any = { method: method, id: Math.random() };
		if (args) {
			data.args = args;
		}
		const req = JSON.stringify(data);
		this.ws.send(req);
		return new Promise((resolve, reject) => {
			this.tasks[data.id] = resolve;
		});
	}

	public async transpile(contents: string, config: any): Promise<{ success: true; data: ts.TranspileOutput }> {
		this.isReady = false;
		const response = await this.sendRequest("transpile", [contents, config]);
		this.isReady = true;
		if (response.success) {
			return response.data;
		} else {
			throw new Error(response.eror);
		}
	}

	async perform(method: string, args: any[]): Promise<any> {
		this.isReady = false;
		if (this[method]) {
			return this[method].apply(this, args);
		}
	}

	isBusy(): boolean {
		//console.log(`Rady ${this.port} ${this.socketIsOpened} ${this.isReady}`);
		return !(this.socketIsOpened && this.isReady);
	}
}
