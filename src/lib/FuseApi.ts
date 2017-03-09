export interface FuseAPI {
    import(str: string, opts?: any)
    exists(path: string);
    remove(path: string);
    dynamic(...args);
    flush(name?: string)
}
