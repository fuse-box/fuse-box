import * as moduleFoo from 'foo';
import { another } from './another';
import './another.scss';
import { baz } from './baz';
import './index.scss';
import { recursive1 } from './recursive1';
console.log('moduleFoo', moduleFoo);
console.log('shit!!111');

import './some';

//if (typeof oi !== 'undefined') {
//console.log(oi);
//}

if (process.env.NODE_ENV === 'development') {
  console.log('HEY IS DEV!!');
} else {
  console.log('IS PROD');
}

console.log('recursive1', recursive1);

console.log(baz);

// console.log('hey');
// import * as lodash from 'lodash-es';
// console.log('kakka', lodash);

console.log('another', another);
console.log('hello!');
console.log(__build_env.entries);
console.log('HEY!!');

let result = 0;

document.querySelector('#root').addEventListener('click', () => {
  result++;
  console.log('result hey', result);
  console.log('second result', result);
});
