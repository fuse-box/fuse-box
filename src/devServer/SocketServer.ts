import { FuseBox } from "../core/FuseBox";
import { Server } from "ws";

export class SocketServer {

    public static server: SocketServer;

    public static createInstance(server: any, fuse: FuseBox) {
        if (!this.server) {
            this.server = this.start(server, fuse);
        }

        return this.server;
    }

    public static getInstance(): SocketServer {
        return this.server;
    }

    public static start(server: any, fuse: FuseBox) {
        let wss = new Server({ server });
        let ss = new SocketServer(wss, fuse);

        return ss;
    }

    public static startSocketServer(port: number, fuse: FuseBox) {
        let wss = new Server({ port });
        this.server = new SocketServer(wss, fuse);
        fuse.context.log.echo(`Launching socket server on ${port}`);

        return this.server;
    }

    public cursor: any;
    public clients = new Set<any>();

    constructor(public server: any, public fuse: FuseBox) {
        // emit only for this producer
        this.fuse.producer.sharedEvents.emit("SocketServerReady", this);

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

    public send(type: string, data: any) {
        this.clients.forEach(client => {
            client.send(JSON.stringify({ type, data }));
        });
    }

    protected onMessage(client: any, type: string, data: any) {

    };
}
