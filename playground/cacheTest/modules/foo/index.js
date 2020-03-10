import { bar } from 'bar';
import { hi } from './hi';
import { other } from './other';
export function foo() {
  console.log(bar());
  console.log(other);
  return 'I am package foo yeah!!';
}

hi();
