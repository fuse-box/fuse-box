import { SocketServer } from "./SocketServer";
import { HotReloadPlugin } from "./../plugins/HotReloadPlugin";
import * as path from "path";
import { ensureUserPath } from "../Utils";
import { HTTPServer } from "./HTTPServer";
import { FuseBox } from "../FuseBox";
const watch = require("watch");

export class Server {
    public httpServer: HTTPServer;
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

        opts.root = opts.root ? ensureUserPath(opts.root) : rootDir;
        opts.port = opts.port || 4444;
        this.httpServer = HTTPServer.start(opts, this.fuse);

        let socket = SocketServer.getInstance();
        this.fuse.context.emmitter.addListener("source-changed", (info) => {
            this.fuse.context.log.echo(`Source changed for ${info.path}`);
            socket.send("source-changed", info);
        });


        watch.watchTree(this.fuse.context.homeDir, { interval: 0.2 }, () => {
            this.fuse.initiateBundle(str);
        });
        return this;
    }
}