"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SocketServer_1 = require("./SocketServer");
const http = require("http");
const express = require("express");
const Utils_1 = require("../Utils");
class HTTPServer {
    constructor(fuse) {
        this.fuse = fuse;
        this.app = express();
    }
    static start(opts, fuse) {
        let server = new HTTPServer(fuse);
        server.launch(opts);
        return server;
    }
    launch(opts) {
        this.opts = opts || {};
        const port = this.opts.port || 4444;
        let server = http.createServer();
        SocketServer_1.SocketServer.createInstance(server, this.fuse);
        this.setup();
        server.on("request", this.app);
        setTimeout(() => {
            server.listen(port, () => {
                this.fuse.context.log.echo(`Launching dev server on port ${port}`);
            });
        }, 10);
    }
    serveStatic(userPath, userFolder) {
        this.app.use(userPath, express.static(Utils_1.ensureUserPath(userFolder)));
    }
    setup() {
        if (this.opts.root) {
            this.app.use("/", express.static(this.opts.root));
        }
    }
}
exports.HTTPServer = HTTPServer;
