const events = require('events');

export type OnOpenFn = (client: SocketClient) => void;

export class SocketClient {
    url: string;
    authSent: boolean;
    emitter: any;
    client: WebSocket;

    constructor(opts) {
        opts = opts || {};
        const port = opts.port || window.location.port;
        const protocol = location.protocol === 'https:' ? 'wss://' : 'ws://';
        const domain = location.hostname || 'localhost';
        this.url = opts.host || `${protocol}${domain}:${port}`;
        if (opts.uri) {
            this.url = opts.uri;
        }
        this.authSent = false;
        this.emitter = new events.EventEmitter();
    }
    reconnect(fn) {
        setTimeout(() => {
            this.emitter.emit('reconnect', { message: 'Trying to reconnect' });
            this.connect(fn);
        }, 5000);
    }

    on(event, fn) {
        this.emitter.on(event, fn);
    }

    connect(fn?: OnOpenFn) {
        console.log('%cConnecting to fusebox HMR at ' + this.url, 'color: #237abe');

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


    private error(data: { reason: any, message: string }) {
        this.emitter.emit('error', data);
    }

    /** Wires up the socket client messages to be emitted on our event emitter */
    private bindEvents(fn?: OnOpenFn) {
        this.client.onopen = (event) => {
            console.log('%cConnected', 'color: #237abe');
            if (fn) {
                fn(this);
            }
        };
        this.client.onerror = (event: any) => {
            this.error({ reason: event.reason, message: 'Socket error' });
        };
        this.client.onclose = (event) => {
            this.emitter.emit('close', { message: 'Socket closed' });
            if (event.code !== 1011) {
                this.reconnect(fn);
            }
        };
        this.client.onmessage = (event) => {
            let data = event.data;
            if (data) {
                let item = JSON.parse(data);
                this.emitter.emit(item.type, item.data);
                this.emitter.emit('*', item);
            }
        };
    }
}
