export interface Listener<T> {
    (event: T): any;
}
export interface Disposable {
    dispose(): any;
}
/** A type safe event emitter */
export declare class EventEmitter<T> {
    private listeners;
    private listenersOncer;
    on: (listener: Listener<T>) => Disposable;
    once: (listener: Listener<T>) => void;
    off: (listener: Listener<T>) => void;
    emit: (event: T) => void;
}
