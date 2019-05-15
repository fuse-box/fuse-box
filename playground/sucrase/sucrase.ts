import * as path from 'path';
import * as fs from 'fs';

import { transform } from 'sucrase';
require('sucrase/register/ts');

const fpath = path.join(__dirname, 'component.tsx');
const code = fs.readFileSync(path.join(__dirname, 'component.tsx')).toString();

const compiledCode = transform(code, { transforms: ['typescript', 'imports', 'jsx', 'production'], filePath: fpath });
console.log(compiledCode);
