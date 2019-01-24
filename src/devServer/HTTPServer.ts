import * as http from "http";
import * as https from "https";
import * as express from "express";
import { FuseBox } from "../";
import { SocketServer } from "./SocketServer";
import { ensureUserPath, getFuseBoxInfo } from "../Utils";
import { ServerOptions } from "./Server";

export interface HTTPServerOptions {
	/** Defaults to 4444 if not specified */
	port?: number;
	/** Provide https server options to enable https */
	https?: https.ServerOptions;

	/** 404 fallback */
	fallback?: string;

	/**
	 * If specfied this is the folder served from express.static
	 * It can be an absolute path or relative to `appRootPath`
	 **/
	root?: string | boolean;
}

export class HTTPServer {
	public static start(opts: any, fuse: FuseBox): HTTPServer {
		let server: HTTPServer = new HTTPServer(fuse);
		server.launch(opts);
		return server;
	}

	public app: any;
	public opts: HTTPServerOptions;

	constructor(private fuse: FuseBox) {
		this.app = express();
	}

	// @TODO: should add .stop()
	public launch(opts: HTTPServerOptions, userSettings?: ServerOptions): SocketServer {
		this.opts = opts || {};
		const port = this.opts.port || 4444;
		let server = this.createServer();
		const socketServer = SocketServer.createInstance(server, this.fuse);
		this.setup();

		if (userSettings && userSettings.proxy) {
			let proxyInstance;
			try {
				proxyInstance = require("http-proxy-middleware");
			} catch (e) {}
			if (proxyInstance) {
				for (let uPath in userSettings.proxy) {
					this.app.use(uPath, proxyInstance(userSettings.proxy[uPath]));
				}
			} else {
				this.fuse.context.log.echoWarning(
					"You are using development proxy but 'http-proxy-middleware' was not installed",
				);
			}
		}

		if (this.opts.fallback) {
			this.app.use("*", (req, res) => {
				res.sendFile(this.opts.fallback);
			});
		}

		server.on("request", this.app);
		setTimeout(() => {
			const packageInfo = getFuseBoxInfo();
			server.listen(port, () => {
				const msg = `
-----------------------------------------------------------------
Development server running ${opts.https ? "https" : "http"}://localhost:${port} @ ${packageInfo.version}
-----------------------------------------------------------------
`;
				this.fuse.context.log.echoInfo(msg);
				//this.spinner = new Spinner(msg);
				//this.spinner.start()
			});
		}, 10);
		return socketServer;
	}

	private createServer(): http.Server | https.Server {
		let server;
		if (this.opts.https) {
			server = https.createServer(this.opts.https);
		} else {
			server = http.createServer();
		}
		return server;
	}

	public serveStatic(userPath, userFolder) {
		this.app.use(userPath, express.static(ensureUserPath(userFolder)));
	}

	private setup(): void {
		if (this.opts.root) {
			this.app.use("/", express.static(this.opts.root));
			if (!this.fuse.context.inlineSourceMaps && process.env.NODE_ENV !== "production") {
				this.fuse.context.log.echoInfo(`You have chosen not to inline source maps`);
				this.fuse.context.log.echoInfo("You source code is exposed at src/");
				this.fuse.context.log.echoWarning("Make sure you are not using dev server for production!");
				this.app.use(this.fuse.context.sourceMapsRoot, express.static(this.fuse.context.homeDir));
			}
		}
	}
}
