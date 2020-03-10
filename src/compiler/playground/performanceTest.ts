import { readFileSync } from 'fs';
import { measureTime } from '../../utils/utils';
import { testTranspile } from '../transpilers/testTranspiler';
import { bench } from './bench';

const b = bench({ iterations: 10 });
const fileName = __dirname + '/source_test/react.dom.development.js';

const file = readFileSync(fileName).toString();

const tm = measureTime('start');

testTranspile({ code: file, useMeriyah: true, fileName: fileName });

console.log('Took', tm.end('ms'));
