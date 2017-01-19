import { Server } from "ws";


export class SocketServer {

    public static server: SocketServer;

    public static createInstance(server?: any) {
        if (!this.server) {
            this.server = this.start(server);
        }
        return this.server;
    }

    public static getInstance(): SocketServer {
        return this.server;
    }

    public static start(server: any) {
        let wss = new Server({ server: server });
        let ss = new SocketServer(wss);
        return ss;
    }


    public cursor: any;
    public clients = new Set<any>();

    constructor(public server: any) {
        server.on("connection", (ws) => {
            console.log("connected");
            this.clients.add(ws);

            ws.on("message", message => {
                let input = JSON.parse(message);
                if (input.event) {
                    this.onMessage(ws, input.event, input.data);
                }
            });
            ws.on("close", () => {
                console.log("close..");
                this.clients.delete(ws);
            });
        });
    }


    public send(type: string, data: any) {
        this.clients.forEach(client => {
            client.send(JSON.stringify({ type: type, data: data }));
        });
    }

    protected onMessage(client: any, type: string, data: any) {

    }
}