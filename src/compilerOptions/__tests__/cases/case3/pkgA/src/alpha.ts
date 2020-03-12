import { beta } from 'pkg-b/dist/beta';

export function alpha() {
  return `alpha -> ${beta()}`;
}
