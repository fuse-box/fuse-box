const SERVER_POLYFILL = new Set<string>([
  'assert',
  'buffer',
  'child_process',
  'cluster',
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
  'dgram'
]);

const ELECTRON_POLYFILL = new Set<string>([
  'electron',
  ...SERVER_POLYFILL
]);
export function isServerPolyfill(name: string) {
  return SERVER_POLYFILL.has(name);
}

export function isElectronPolyfill(name: string) {
  return ELECTRON_POLYFILL.has(name);
}
