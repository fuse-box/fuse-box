import { alsoNotSoStaticFunc } from './static/alsoNotSoStatic';
import { notSoStaticFunc } from './static/notSoStatic';
import { staticFunc } from './static/static';

import { path } from './utils/path';

console.log('hi, my name is index.js');

staticFunc();
notSoStaticFunc();
alsoNotSoStaticFunc();

path();
