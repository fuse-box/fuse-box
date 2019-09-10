import { isRegExp } from '../utils/utils';

const CACHED_PATHS = {};

export function testPath(input: string, target: string | RegExp) {
  if (typeof target === 'string') {
    if (!CACHED_PATHS[target]) {
      CACHED_PATHS[target] = simplifiedRegExp(target);
    }
    return CACHED_PATHS[target].test(input);
  }
  return target.test(input);
}

export function parsePluginOptions<T>(a, b?, defaultValue?): [T, RegExp] {
  const opts = b ? b : typeof a === 'object' ? a : defaultValue;
  const rex = b || typeof a === 'string' || isRegExp(a) ? simplifiedRegExp(a) : undefined;
  return [opts, rex];
}

export function simplifiedRegExp(input: undefined | string | RegExp): RegExp {
  if (!input) {
    return;
  }

  if (typeof input === 'string') {
    let r = '';
    for (let i = 0; i < input.length; i++) {
      switch (input[i]) {
        case '.':
          r += '(\\.|.)';
          break;
        case '/':
          r += '(\\/|\\\\)';
          break;
        case '\\':
          r += '\\\\';
          break;
        case '*':
          r += '.*';
          break;
        default:
          r += input[i];
      }
    }
    return new RegExp(r);
  }
  return input;
}
