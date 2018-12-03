const SERVER_POLYFILL = new Set<string>([
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
	"zlib",
]);

const ELECTRON_POLYFILL = new Set<string>([
	"assert",
	"buffer",
	"child_process",
	"crypto",
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
	"zlib",
]);
export function isServerPolyfill(name: string) {
	return SERVER_POLYFILL.has(name);
}

export function isElectronPolyfill(name: string) {
	return ELECTRON_POLYFILL.has(name);
}
