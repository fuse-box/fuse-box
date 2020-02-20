const SERVER_POLYFILL = new Set<string>([
  'assert',
  'buffer',
  'child_process',
  'cluster',
  'constants',
  'crypto',
  'dgram',
  'dns',
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
  'string_decoder',
  'timers',
  'tls',
  'tty',
  'url',
  'util',
  'v8',
  'vm',
  'worker_threads',
  'zlib',
]);

const ELECTRON_POLYFILL = new Set<string>(['electron']);

export function isServerPolyfill(name: string) {
  return SERVER_POLYFILL.has(name);
}

export function isElectronPolyfill(name: string) {
  return ELECTRON_POLYFILL.has(name);
}
