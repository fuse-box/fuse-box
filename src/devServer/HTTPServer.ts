import * as http from "http";
import * as express from "express";
import { FuseBox } from "../";
import { SocketServer } from "./SocketServer";
import { ensureUserPath, Spinner } from "../Utils";

export interface HTTPServerOptions {
    /** Defaults to 4444 if not specified */
    port?: number;

    /**
     * If specfied this is the folder served from express.static
     * It can be an absolute path or relative to `appRootPath`
     **/
    root?: string | boolean;
}

export class HTTPServer {
    private spinner?: Spinner;
    public static start(opts: any, fuse: FuseBox): HTTPServer {
        let server: HTTPServer = new HTTPServer(fuse);
        server.launch(opts);
        return server;
    }

    public app: any;
    public opts: HTTPServerOptions;

    constructor(private fuse: FuseBox) {
        this.app = express();
    }

    // @TODO: should add .stop()
    public launch(opts: HTTPServerOptions): void {
        this.opts = opts || {};
        const port = this.opts.port || 4444;
        let server = http.createServer();
        SocketServer.createInstance(server, this.fuse);
        this.setup();
        server.on("request", this.app);
        setTimeout(() => {
            server.listen(port, () => {
                const msg = `dev server running http://localhost:${port}`
                this.spinner = new Spinner(msg);
                this.spinner.start()
            });
        }, 10);
    }

    public serveStatic(userPath, userFolder) {
        this.app.use(userPath, express.static(ensureUserPath(userFolder)));
    }

    private setup(): void {
        if (this.opts.root) {
            this.app.use("/", express.static(this.opts.root));
        }
    }
}
