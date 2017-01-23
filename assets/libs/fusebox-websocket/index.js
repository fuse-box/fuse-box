const events = require("events");

const getSocketURL = (host) => {
    
        const isBrowser = FuseBox.isBrowser
        if (host && /^ws(s):\/\//.test(host)) {
            return host;
        }
        let protocol = "ws://";
        let port = isBrowser ? (!host &&
            window.location.port ? window.location.port : "") : "";
        host = host ? host : (isBrowser ? window.location.origin : "localhost");
        let portInHost = new RegExp(":\\d{1,}.*$");
        if (portInHost.test(host)) {
            port = "";
            host = host.replace(port, "");
        }
        let http = new RegExp("^http(s)?://");
        if (http.test(host)) {
            protocol = host.indexOf("https") > -1 ? "wss://" : "ws://";
            host = host.replace(http, "");
        }
        return `${protocol}${host}${port ? `:${port}` : ""}`;
}


class SocketClient {
    constructor(host) {
        this.authSent = false;
        this.emitter = new events.EventEmitter();
        this.host = host;
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
        let url = getSocketURL(this.host);
        setTimeout(() => {
            this.client = new WebSocket(url);
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