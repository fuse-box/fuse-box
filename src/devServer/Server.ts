import { SocketServer } from './SocketServer';
import { HotReloadPlugin } from "./../plugins/HotReloadPlugin";
import * as path from "path";
import { ensureUserPath } from "../Utils";
import { HTTPServer } from "./HTTPServer";
import { FuseBox } from "../FuseBox";
const watch = require("watch");

export class Server {
    constructor(private fuse: FuseBox) {

    }
    /**
     * 
     * 
     * @param {string} str
     * 
     * @memberOf Server
     */
    public start(str: string) {
        // adding hot reload plugin
        this.fuse.context.plugins.push(HotReloadPlugin());

        let buildPath = ensureUserPath(this.fuse.context.outFile);
        let rootDir = path.dirname(buildPath);

        HTTPServer.start({
            root: rootDir,
        });
        let socket = SocketServer.getInstance();
        this.fuse.context.emmitter.addListener("source-changed", (info) => {
            socket.send("source-changed", info);
        });


        watch.watchTree(this.fuse.context.homeDir, { interval: 0.2 }, () => {
            this.fuse.initiateBundle(str);
        });
    }
}