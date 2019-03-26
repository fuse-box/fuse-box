import { fastAnalysis } from './fastAnalysis';
//require(/*foo*/"ololo")
const str = `
require('./foo') require('./bar')
`;
const result = fastAnalysis({ input: str });

console.log(result);
