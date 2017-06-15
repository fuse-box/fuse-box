/** Defers a callback
 *
 * A callback will be called once requested and unlocked
 */
export class Defer {
    public queued: Map<string, any>;
    public locked = false;

    constructor() {
        this.reset();
    }

    /** Flush the map */
    public reset() {
        this.queued = new Map<string, any>();
    }

    /** Queue a callback */
    public queue(id: string, fn: any) {
        if (this.locked === false) {
            return fn();
        }
        if (!this.queued.get(id)) {
            this.queued.set(id, fn);
        }
    }

    /** Release all pending calls */
    public release() {
        this.queued.forEach((fn, key) => {
            fn();
        });
        this.reset();
    }

    public lock() {
        this.locked = true;
    }
    public unlock() {
        this.locked = false;
        this.release();
    }
}
