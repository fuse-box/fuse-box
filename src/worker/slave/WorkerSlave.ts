import * as ts from "typescript";
import { Server } from "ws";

const PORT = process.argv[2] ? parseInt(process.argv[2]) : 1800;
class SocketWorker {
	private isAvailableForTranspilation: boolean;
	private wss: Server;

	constructor() {
		this.isAvailableForTranspilation = false;
	}

	startServer() {
		this.wss = new Server({ port: PORT });
		console.log("start on ", PORT);
		this.isAvailableForTranspilation = true;
		this.wss.on("connection", ws => {
			ws.on("message", message => {
				const json = JSON.parse(message);

				if (json.method) {
					this.callMethod(ws, json);
				}
			});
		});
	}

	public test() {
		return "Hello from socket";
	}

	private async callMethod(client, json: { method: string; args: Array<any>; id: string }) {
		if (this[json.method]) {
			const response = await this[json.method].apply(this, json.args);
			if (json.id) {
				client.send(JSON.stringify({ id: json.id, response: response }));
			}
		}
	}

	public isReady() {
		return this.isAvailableForTranspilation;
	}

	transpile(contents, config: any): any {
		this.isAvailableForTranspilation = false;

		let response;
		console.log(">>>>>>>>>>>>");
		console.time("transpile");
		try {
			response = { success: true, data: ts.transpileModule(contents, config) };
		} catch (e) {
			console.log("error");
			response = { success: false, error: e.message };
		}
		console.timeEnd("transpile");
		console.log("ended");

		this.isAvailableForTranspilation = true;
		return response;
	}
}

const worker = new SocketWorker();
worker.startServer();
