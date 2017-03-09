export interface Listener<T> {
  (event: T): any;
}

export interface Disposable {
  dispose();
}

/** A type safe event emitter */
export class EventEmitter<T> {
    private listeners: Listener<T>[] = [];
    private listenersOncer: Listener<T>[] = [];

    on = (listener: Listener<T>): Disposable => {
        this.listeners.push(listener);
        return {
            dispose: () => this.off(listener),
        };
    }

    once = (listener: Listener<T>): void => {
        this.listenersOncer.push(listener);
    }

    off = (listener: Listener<T>) => {
        var callbackIndex = this.listeners.indexOf(listener);
        if (callbackIndex > -1) this.listeners.splice(callbackIndex, 1);
    }

    emit = (event: T) => {
        /** Update any general listeners */
        this.listeners.forEach((listener) => listener(event));

        /** Clear the `once` queue */
        this.listenersOncer.forEach((listener) => listener(event));
        this.listenersOncer = [];
    }
}
