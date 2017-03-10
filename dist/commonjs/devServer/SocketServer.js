"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
class SocketServer {
    constructor(server, fuse) {
        this.server = server;
        this.fuse = fuse;
        this.clients = new Set();
        server.on("connection", (ws) => {
            this.fuse.context.log.echo("Client connected");
            this.clients.add(ws);
            ws.on("message", message => {
                let input = JSON.parse(message);
                if (input.event) {
                    this.onMessage(ws, input.event, input.data);
                }
            });
            ws.on("close", () => {
                this.fuse.context.log.echo("Connection closed");
                this.clients.delete(ws);
            });
        });
    }
    static createInstance(server, fuse) {
        if (!this.server) {
            this.server = this.start(server, fuse);
        }
        return this.server;
    }
    static getInstance() {
        return this.server;
    }
    static start(server, fuse) {
        let wss = new ws_1.Server({ server });
        let ss = new SocketServer(wss, fuse);
        return ss;
    }
    static startSocketServer(port, fuse) {
        let wss = new ws_1.Server({ port });
        this.server = new SocketServer(wss, fuse);
        fuse.context.log.echo(`Launching socket server on ${port}`);
        return this.server;
    }
    send(type, data) {
        this.clients.forEach(client => {
            client.send(JSON.stringify({ type, data }));
        });
    }
    onMessage(client, type, data) {
    }
    ;
}
exports.SocketServer = SocketServer;
