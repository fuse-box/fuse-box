import { SocketServer } from "./SocketServer";
import { ensureUserPath } from "../Utils";
import { HTTPServer } from "./HTTPServer";
import { FuseBox } from "../core/FuseBox";
import { utils } from "realm-utils";
import * as process from "process";
import * as https from "https";
import * as path from "path";

export type HotReloadEmitter = (server: Server, sourceChangedInfo: any) => any;

export type SourceChangedEvent = {
	type: "js" | "css" | "css-file" | "hosted-css";
	content?: string;
	path: string;
	dependants?: any;
};

export interface ServerOptions {
	/** Defaults to 4444 if not specified */
	port?: number;

	/** If not specified it uses regular http */
	https?: https.ServerOptions;

	/** 404 fallback */
	fallback?: string;

	/**
	 * - If false nothing is served.
	 * - If string specified this is the folder served from express.static
	 *      It can be an absolute path or relative to `appRootPath`
	 **/
	root?: boolean | string;

	emitter?: HotReloadEmitter;
	httpServer?: boolean;
	socketURI?: string;
	hmr?: boolean;
	open?: boolean | string;
	proxy?: {
		[key: string]: {
			target: string;
			changeOrigin?: boolean;
			pathRewrite: { [key: string]: string };
			router: { [key: string]: string };
		};
	};
}

/**
 * Wrapper around the static + socket servers
 */
export class Server {
	public httpServer: HTTPServer;
	public socketServer: SocketServer;
	constructor(private fuse: FuseBox) {}

	/**
	 * Starts the server
	 * @param str the default bundle arithmetic string
	 */
	public start(opts?: ServerOptions): Server {
		opts = opts || {};

		let rootDir = this.fuse.context.output.dir;

		const root: string | boolean =
			opts.root !== undefined ? (utils.isString(opts.root) ? ensureUserPath(opts.root as string) : false) : rootDir;
		const port = opts.port || 4444;
		const https = opts.https;
		const fallback = root && opts.fallback && path.join(root, opts.fallback);
		if (opts.hmr !== false && this.fuse.context.useCache === true) {
			setTimeout(() => {
				this.fuse.context.log.echo(`HMR is enabled`);
			}, 1000);
		} else {
			setTimeout(() => {
				this.fuse.context.log.echo(`HMR is disabled. Caching should be enabled and {hmr} option should be NOT false`);
			}, 1000);
		}

		this.httpServer = new HTTPServer(this.fuse);

		process.nextTick(() => {
			if (opts.httpServer === false) {
				this.socketServer = SocketServer.startSocketServer(port, this.fuse);
			} else {
				this.socketServer = this.httpServer.launch({ root, port, https, fallback }, opts);
			}
		});
		return this;
	}
}
