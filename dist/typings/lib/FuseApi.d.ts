export interface FuseAPI {
    import(str: string, opts?: any): any;
    exists(path: string): any;
    remove(path: string): any;
    dynamic(...args: any[]): any;
    flush(name?: string): any;
}
