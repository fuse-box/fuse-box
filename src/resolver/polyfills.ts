const SERVER_POLYFILL = new Set<string>([
  'assert',
  'buffer',
  'child_process',
  'crypto',
  'events',
  'fs',
  'http',
  'http2',
  'https',
  'module',
  'net',
  'os',
  'path',
  'process',
  'querystring',
  'stream',
  'timers',
  'tls',
  'tty',
  'url',
  'util',
  'zlib',
  'constants',
  'worker_threads',
  'v8',
  'vm',
]);

const ELECTRON_POLYFILL = new Set<string>([
  'electron',
  'assert',
  'buffer',
  'child_process',
  'crypto',
  'fs',
  'http',
  'http2',
  'https',
  'module',
  'net',
  'os',
  'path',
  'process',
  'querystring',
  'stream',
  'timers',
  'tls',
  'tty',
  'url',
  'util',
  'zlib',
  'constants',
]);
export function isServerPolyfill(name: string) {
  return SERVER_POLYFILL.has(name);
}

export function isElectronPolyfill(name: string) {
  return ELECTRON_POLYFILL.has(name);
}
