import { fastAnalysis } from './fastAnalysis';
import { parseAst } from '../transform/fastTransform/fastTransform';
//require(/*foo*/"ololo")
const str = `
foo.process
`;

const res = parseAst(str);
console.log(JSON.stringify(res, null, 2));
