const events = require("events");

class SocketClient {
    constructor(opts) {
        opts = opts || {};
        const port = opts.port || window.location.port;
        const protocol = location.protocol === "https:" ? "wss://" : "ws://";
        const domain = location.hostname || "localhost";
        this.url = opts.host || `${protocol}${domain}:${port}`;
        this.authSent = false;
        this.emitter = new events.EventEmitter();
    }
    reconnect(fn) {
        setTimeout(() => {
            this.emitter.emit("reconnect", { message: "Trying to reconnect" });
            this.connect(fn);
        }, 5000);
    }
    on(event, fn) {
        this.emitter.on(event, fn);
    }
    connect(fn) {
        console.log("connect", this.url);
        setTimeout(() => {
            this.client = new WebSocket(this.url);
            this.bindEvents(fn);
        }, 0);
    }
    close() {
        this.client.close();
    }
    send(eventName, data) {
        if (this.client.readyState === 1) {
            this.client.send(JSON.stringify({ event: eventName, data: data || {} }));
        }
    }
    error(data) {
        this.emitter.emit("error", data);
    }
    bindEvents(fn) {

        this.client.onopen = (event) => {
            if (fn) {
                fn(this);
            }
        };
        this.client.onerror = (event) => {
            this.error({ reason: event.reason, message: "Socket error" });
        };
        this.client.onclose = (event) => {
            this.emitter.emit("close", { message: "Socket closed" });
            if (event.code !== 1011) {
                this.reconnect(fn);
            }
        };
        this.client.onmessage = (event) => {
            let data = event.data;
            if (data) {
                let item = JSON.parse(data);
                this.emitter.emit(item.type, item.data);
                this.emitter.emit("*", item);
            }
        };
    }
}
exports.SocketClient = SocketClient;