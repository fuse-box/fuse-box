"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const HotReloadPlugin_1 = require("./../plugins/HotReloadPlugin");
const SocketServer_1 = require("./SocketServer");
const Utils_1 = require("../Utils");
const HTTPServer_1 = require("./HTTPServer");
const realm_utils_1 = require("realm-utils");
const process = require("process");
const path = require("path");
const watch = require("watch");
class Server {
    constructor(fuse) {
        this.fuse = fuse;
    }
    start(str, opts) {
        opts = opts || {};
        let buildPath = Utils_1.ensureUserPath(this.fuse.context.outFile);
        let rootDir = path.dirname(buildPath);
        const root = opts.root !== undefined
            ? (realm_utils_1.utils.isString(opts.root) ? Utils_1.ensureUserPath(opts.root) : false) : rootDir;
        const port = opts.port || 4444;
        if (opts.hmr !== false && this.fuse.context.useCache === true) {
            setTimeout(() => {
                this.fuse.context.log.echo(`HMR is enabled`);
            }, 1000);
            this.fuse.context.plugins.push(HotReloadPlugin_1.HotReloadPlugin({ port, uri: opts.socketURI }));
        }
        else {
            setTimeout(() => { this.fuse.context.log.echo(`HMR is disabled. Caching should be enabled and {hmr} option should be NOT false`); }, 1000);
        }
        let emitter = realm_utils_1.utils.isFunction(opts.emitter) ? opts.emitter : false;
        this.httpServer = new HTTPServer_1.HTTPServer(this.fuse);
        process.nextTick(() => {
            if (opts.httpServer === false) {
                SocketServer_1.SocketServer.startSocketServer(port, this.fuse);
            }
            else {
                this.httpServer.launch({ root, port });
            }
            this.socketServer = SocketServer_1.SocketServer.getInstance();
            this.fuse.context.sourceChangedEmitter.on((info) => {
                if (this.fuse.context.isFirstTime() === false) {
                    this.fuse.context.log.echo(`Source changed for ${info.path}`);
                    if (emitter) {
                        emitter(this, info);
                    }
                    else {
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
exports.Server = Server;
