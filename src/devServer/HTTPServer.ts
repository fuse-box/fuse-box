import { FuseBox } from '../';
import { SocketServer } from "./SocketServer";
import * as http from "http";
import * as express from "express";



export class HTTPServer {

    public static start(opts: any, fuse: FuseBox): HTTPServer {
        let server: HTTPServer = new HTTPServer(fuse);
        server.launch(opts);
        return server;
    }


    public app: express.Application;


    public opts: any;

    constructor(
        private fuse: FuseBox
    ) {
        this.app = express.Application = express();
    }


    private setup(): void {
        if (this.opts.root) {
            this.app.use("/", express.static(this.opts.root));
        }
    }



    public launch(opts: any): void {
        this.opts = opts || {};


        const port = this.opts.port || 4444;

        let server = http.createServer();
        SocketServer.createInstance(server, this.fuse);
        this.setup();
        server.on("request", this.app);
        setTimeout(() => {
            server.listen(port, () => {
                this.fuse.context.log.echo(`Launching dev server on port ${port}`);
            });
        }, 10);
    }

}


