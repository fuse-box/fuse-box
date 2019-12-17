import { second } from './second';
import { hey } from 'foo/hey';
console.log(hey);
export function hello() {
  return hey + 'I am split hello' + second();
}
