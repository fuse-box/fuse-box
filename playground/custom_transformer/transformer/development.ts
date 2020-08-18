import * as fs from 'fs';
import { testTransform } from '../../../src';
import MyAwesomeTransformer from './MyAwesomeTransformer';

import * as path from 'path';

const testFile = path.join(__dirname, '../testFile.ts');

const result = testTransform({
  code: fs.readFileSync(testFile).toString(),
  compilerOptions: {},
  transformers: [MyAwesomeTransformer({})],
});
console.log(result.code);
