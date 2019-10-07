import { readFileSync } from 'fs';
import { testTranspile } from '../transpilers/testTranspiler';

let file;

//file = readFileSync(__dirname + '/source_test/angular_1.ts').toString();
file = readFileSync(__dirname + '/sample.tsx').toString();
const result = testTranspile({ code: file, bundleProps: { target: 'browser', env: { NODE_ENV: 'development' } } });

console.log(result.code);
