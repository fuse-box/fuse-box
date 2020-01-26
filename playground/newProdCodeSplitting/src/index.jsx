import * as React from 'react';
import { alsoNotSoStaticFunc } from './static/alsoNotSoStatic';
import { notSoStaticFunc } from './static/notSoStatic';
import { staticFunc } from './static/static';

import { path } from './utils/path';

console.log('hi, my name is index.js');

staticFunc();
notSoStaticFunc();
alsoNotSoStaticFunc();

path();

const test = () => <div>hello</div>;
console.log(test);
