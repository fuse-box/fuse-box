const LIST = new Set<string>(
    [
        "assert",
        "buffer",
        "child_process",
        "crypto",
        "events",
        "fs",
        "http",
        "https",
        "module",
        "net",
        "os",
        "path",
        "process",
        "querystring",
        "stream",
        "timers",
        "tls",
        "tty",
        "url",
        "util",
        "zlib"
    ]
);
export function isPolyfilledByFuseBox(name: string) {
    return LIST.has(name);
}