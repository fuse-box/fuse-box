import { isRegExp, path2RegexPattern } from '../utils/utils';

const CACHED_PATHS = {};

export function testPath(input: string, target: string | RegExp) {
  if (typeof target === 'string') {
    if (!CACHED_PATHS[target]) {
      CACHED_PATHS[target] = path2RegexPattern(target);
    }
    return CACHED_PATHS[target].test(input);
  }
  return target.test(input);
}

export function parsePluginOptions<T>(a, b?, defaultValue?): [T, RegExp] {
  const opts = b ? b : typeof a === 'object' ? a : defaultValue;
  const rex = b || typeof a === 'string' || isRegExp(a) ? path2RegexPattern(a) : undefined;
  return [opts, rex];
}
