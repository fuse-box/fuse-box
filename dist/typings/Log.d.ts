import { ModuleCollection } from './ModuleCollection';
export declare class Log {
    private spinnerInterval;
    private timeStart;
    private totalSize;
    constructor();
    startSpinning(): void;
    stopSpinning(): void;
    echoCollection(collection: ModuleCollection, contents: string): void;
    end(): void;
}
