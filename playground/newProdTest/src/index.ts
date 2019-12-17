//import * as oi from 'foo';

import './index.scss';
import { util } from './utils';
console.log('hello world');

async function aaaa() {
  const res = await import('./split');
  console.log(res);
}
util();
