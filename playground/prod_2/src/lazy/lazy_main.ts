import { lazyTwo } from './lazy_two';
let i = 0;
export function lazyMain() {
  i++;
  return lazyTwo();
}
