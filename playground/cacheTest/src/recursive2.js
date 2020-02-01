import { another } from './another';
import { recursive1 } from './recursive1';

export function recursive2() {
  recursive1();
  another();
}
//11
