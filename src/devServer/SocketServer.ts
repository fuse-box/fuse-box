import { FuseBox } from "../core/FuseBox";
import { Server } from "ws";
import { HMRHandler } from "../hmr/HMRHandler";

export class SocketServer {
	public static server: SocketServer;
	public cursor: any;
	public clients = new Set<HMRHandler>();

	constructor(public server: any, public fuse: FuseBox) {
		// emit only for this producer
		this.fuse.producer.sharedEvents.emit("SocketServerReady", this);
		server.on("connection", ws => {
			const hmr = new HMRHandler(ws, fuse);
			this.clients.add(hmr);

			ws.on("close", () => {
				this.clients.delete(hmr);
			});
		});
	}

	public emit(eventName: string, data: any) {
		this.clients.forEach(client => {
			client.emit(eventName, data);
		});
	}

	public static createInstance(server: any, fuse: FuseBox) {
		if (!this.server) {
			this.server = this.start(server, fuse);
		}

		return this.server;
	}

	public static getInstance(): SocketServer {
		return this.server;
	}

	public static start(server: any, fuse: FuseBox) {
		let wss = new Server({ server });
		let ss = new SocketServer(wss, fuse);

		return ss;
	}

	public static startSocketServer(port: number, fuse: FuseBox) {
		let wss = new Server({ port });
		this.server = new SocketServer(wss, fuse);
		fuse.context.log.echo(`Launching socket server on ${port}`);

		return this.server;
	}

	protected onMessage(client: any, type: string, data: any) {
		if (type === "request-dependency") {
			if (this.fuse.context) {
				this.fuse.context.onHMRRequestDependency(JSON.parse(data));
			}
		}
	}
}
