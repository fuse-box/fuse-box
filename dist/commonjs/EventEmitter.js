"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class EventEmitter {
    constructor() {
        this.listeners = [];
        this.listenersOncer = [];
        this.on = (listener) => {
            this.listeners.push(listener);
            return {
                dispose: () => this.off(listener),
            };
        };
        this.once = (listener) => {
            this.listenersOncer.push(listener);
        };
        this.off = (listener) => {
            var callbackIndex = this.listeners.indexOf(listener);
            if (callbackIndex > -1)
                this.listeners.splice(callbackIndex, 1);
        };
        this.emit = (event) => {
            this.listeners.forEach((listener) => listener(event));
            this.listenersOncer.forEach((listener) => listener(event));
            this.listenersOncer = [];
        };
    }
}
exports.EventEmitter = EventEmitter;
