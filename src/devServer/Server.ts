import { SocketServer } from "./SocketServer";
import { HotReloadPlugin } from "./../plugins/HotReloadPlugin";
import * as path from "path";
import { ensureUserPath } from "../Utils";
import { HTTPServer } from "./HTTPServer";
import { FuseBox } from "../FuseBox";
import { utils } from "realm-utils";
import * as process from "process";
const watch = require("watch");

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
    public start(str: string, opts: any): Server {
        // adding hot reload plugin
        this.fuse.context.plugins.push(HotReloadPlugin());
        opts = opts || {};

        let buildPath = ensureUserPath(this.fuse.context.outFile);
        let rootDir = path.dirname(buildPath);

        opts.root = opts.root ? (utils.isString(opts.root) ? ensureUserPath(opts.root) : false) : rootDir;
        opts.port = opts.port || 4444;


        // allow user to override hot reload emitter
        let emitter = utils.isFunction(opts.emitter) ? opts.emitter : false;

        // let middlewares to connect
        this.httpServer = new HTTPServer(this.fuse);

        process.nextTick(() => {

            this.httpServer.launch(opts);
            this.socketServer = SocketServer.getInstance();

            this.fuse.context.emmitter.addListener("source-changed", (info) => {

                // type: "js",
                // content: file.contents,
                // path: file.info.fuseBoxPath,

                this.fuse.context.log.echo(`Source changed for ${info.path}`);
                if (emitter) {
                    emitter(this, info);
                } else {
                    this.socketServer.send("source-changed", info);
                }
            });

            watch.watchTree(this.fuse.context.homeDir, { interval: 0.2 }, () => {
                this.fuse.initiateBundle(str);
            });
        });
        return this;
    }
}