/// <reference types="node" />
declare const pkg: any;
declare function inspector(message: any): string;
declare function getOpts(opts: any): {
    opts: {};
    keys: string[];
};
declare const execSyncStd: (cmd: any) => Buffer;
declare var _default: {
    execSyncStd: (cmd: any) => Buffer;
    pkg: any;
    getOpts: (opts: any) => {
        opts: {};
        keys: string[];
    };
    inspector: (message: any) => string;
};
export default _default;
export { execSyncStd, pkg, getOpts, inspector };
