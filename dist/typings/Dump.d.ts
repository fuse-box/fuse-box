export declare class FuseBoxDump {
    modules: {};
    log(moduleName: string, file: string, contents: string): void;
    error(moduleName: string, file: string, error: string): void;
    warn(moduleName: string, warning: string): void;
    printLog(endTime: any): void;
}
