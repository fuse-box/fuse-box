import { fastAnalysis } from './fastAnalysis';
import { parseAst } from '../transform/fastTransform';
//require(/*foo*/"ololo")
const str = `
import * as React from "react";
function render(props){
  return <div></div>;
}
`;

const result = fastAnalysis({ input: str });

console.log(result);

const res = parseAst(str);
console.log(res);
