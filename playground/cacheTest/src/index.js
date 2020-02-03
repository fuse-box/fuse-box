import * as moduleFoo from 'foo';
import { oi } from 'foo/oi';
import { another } from './another';
import { baz } from './baz';
import { recursive1 } from './recursive1';
console.log('moduleFoo', moduleFoo);
console.log('shit!!111');

//if (typeof oi !== 'undefined') {
//console.log(oi);
//}

import './somethign';
if (process.env.NODE_ENV === 'development') {
  console.log('IS DEV');
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
