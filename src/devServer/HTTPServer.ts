import { SocketServer } from "./SocketServer";
import * as http from "http";
import * as express from "express";



export class HTTPServer {




    public static start(opts: any): HTTPServer {
        let server: HTTPServer = new HTTPServer();
        server.launch(opts);
        return server;
    }

    public opts: any;

    constructor(
        private app: express.Application = express()
    ) { }


    private setup(): void {
        if (this.opts.root) {
            this.app.use("/", express.static(this.opts.root));
        }
    }



    private launch(opts: any): void {
        this.opts = opts || {};

        const port = this.opts.port || 4444;

        let server = http.createServer();
        SocketServer.createInstance(server);
        this.setup();
        server.on("request", this.app);
        server.listen(port, () => {
            console.info(`App is running on port ${port}`);
        });
    }

}


