import { SocketServer } from "./SocketServer";
import { HotReloadPlugin } from "./../plugins/HotReloadPlugin";
import * as path from "path";
import { ensureUserPath } from "../Utils";
import { HTTPServer } from "./HTTPServer";
import { FuseBox } from "../FuseBox";
import { utils } from "realm-utils";
import * as process from "process";
const watch = require("watch");

export type HotReloadEmitter = (server: Server, sourceChangedInfo: any) => any;

export type SourceChangedEvent = {
    type: 'js' | 'css',
    content: string,
    path: string
}

export interface ServerOptions {
    /** Defaults to 4444 if not specified */
    port?: number;

    /** 
     * - If false nothing is served.
     * - If string specfied this is the folder served from express.static
     * - It can be an absolute path or relative to `appRootPath`
     **/
    root?: boolean | string;

    emitter?: HotReloadEmitter;
    httpServer?: boolean;
}

/**
 * Wrapper around the static + socket servers
 */
export class Server {
    public httpServer: HTTPServer;
    public socketServer: SocketServer;
    constructor(private fuse: FuseBox) {

    }

    /**
     * Starts the server
     * @param str the default bundle arithmetic string 
     */
    public start(str: string, opts?: ServerOptions): Server {
        opts = opts || {};

        let buildPath = ensureUserPath(this.fuse.context.outFile);
        let rootDir = path.dirname(buildPath);

        const root: string | boolean = opts.root !== undefined
            ? (utils.isString(opts.root) ? ensureUserPath(opts.root as string) : false) : rootDir;
        const port = opts.port || 4444;

        this.fuse.context.plugins.push(
            HotReloadPlugin({ port })
        );

        // allow user to override hot reload emitter
        let emitter: HotReloadEmitter | false = utils.isFunction(opts.emitter) ? opts.emitter : false;

        // let middlewares to connect
        this.httpServer = new HTTPServer(this.fuse);

        process.nextTick(() => {
            if (opts.httpServer === false) {
                SocketServer.startSocketServer(port, this.fuse);
            } else {
                this.httpServer.launch({ root, port });
            }

            this.socketServer = SocketServer.getInstance();

            this.fuse.context.sourceChangedEmitter.on((info) => {
                if (this.fuse.context.isFirstTime() === false) {
                    this.fuse.context.log.echo(`Source changed for ${info.path}`);
                    if (emitter) {
                        emitter(this, info);
                    } else {
                        this.socketServer.send("source-changed", info);
                    }
                }
            });

            /**
             * watches the home directory for changes and trigger re-bundling
             */
            let timeout;
            watch.watchTree(this.fuse.context.homeDir, { interval: 0.2 }, () => {
                clearInterval(timeout);
                timeout = setTimeout(() => {
                    this.fuse.initiateBundle(str);
                }, 70);
            });
        });
        return this;
    }
}