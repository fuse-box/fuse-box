import { fastAnalysis } from './fastAnalysis';
import { parseAst } from '../transform/fastTransform/fastTransform';
//require(/*foo*/"ololo")
const str = `
new Worker('./worker/worker.ts')
`;

const res = parseAst(str);
console.log(JSON.stringify(res, null, 2));
