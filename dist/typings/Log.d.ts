import { ModuleCollection } from './ModuleCollection';
export declare class Log {
    private spinnerInterval;
    private timeStart;
    private totalSize;
    constructor();
    startSpinning(): void;
    stopSpinning(): void;
    echoDefaultCollection(collection: ModuleCollection, contents: string, printFiles?: boolean): void;
    echoCollection(collection: ModuleCollection, contents: string, printFiles?: boolean): void;
    end(): void;
}
