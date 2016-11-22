import { ModuleCollection } from './ModuleCollection';
export declare class Log {
    printLog: boolean;
    private spinnerInterval;
    private timeStart;
    private totalSize;
    constructor(printLog: boolean);
    echoDefaultCollection(collection: ModuleCollection, contents: string, printFiles?: boolean): void;
    echoCollection(collection: ModuleCollection, contents: string, printFiles?: boolean): void;
    end(): void;
}
