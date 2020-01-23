import { bar } from 'bar';
import { other } from './other';
export function foo() {
  console.log(bar());
  console.log(other);
  return 'I am package foo yeah!!';
}
