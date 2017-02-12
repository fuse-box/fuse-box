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

export interface ServerOptions {
    port?: number;
    root?: boolean | string;
    emitter?: HotReloadEmitter;
    httpServer?: boolean;
}

export class Server {
    public httpServer: HTTPServer;
    public socketServer: SocketServer;
    constructor(private fuse: FuseBox) {

    }
    /**
     * 
     * 
     * @param {string} str
     * 
     * @memberOf Server
     */
    public start(str: string, opts?: ServerOptions): Server {
        // adding hot reload plugin

        opts = opts || {};

        let buildPath = ensureUserPath(this.fuse.context.outFile);
        let rootDir = path.dirname(buildPath);

        opts.root = opts.root !== undefined
            ? (utils.isString(opts.root) ? ensureUserPath(opts.root as string) : false) : rootDir;
        opts.port = opts.port || 4444;
        this.fuse.context.plugins.push(
            HotReloadPlugin({ port: opts.port })
        );

        // allow user to override hot reload emitter
        let emitter: HotReloadEmitter | false = utils.isFunction(opts.emitter) ? opts.emitter : false;

        // let middlewares to connect
        this.httpServer = new HTTPServer(this.fuse);

        process.nextTick(() => {
            if (opts.httpServer === false) {
                SocketServer.startSocketServer(opts.port, this.fuse);
            } else {
                this.httpServer.launch(opts);
            }

            this.socketServer = SocketServer.getInstance();

            this.fuse.context.emmitter.addListener("source-changed", (info) => {

                // type: "js",
                // content: file.contents,
                // path: file.info.fuseBoxPath,
                if (this.fuse.context.isFirstTime() === false) {
                    this.fuse.context.log.echo(`Source changed for ${info.path}`);
                    if (emitter) {
                        emitter(this, info);
                    } else {
                        this.socketServer.send("source-changed", info);
                    }
                }

            });


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