import { QuantumCore } from '../plugin/QuantumCore';

export class QuantumTask {
    private tasks = new Set<() => void>();
    constructor(public core: QuantumCore) { }

    public add(fn: () => void) {
        this.tasks.add(fn);
    }
    public async execute() {
        for (const task of this.tasks) {
            await task();
        }
    }
}