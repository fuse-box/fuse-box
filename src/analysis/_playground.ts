import { fastAnalysis } from './fastAnalysis';
//require(/*foo*/"ololo")
const str = `


// single line

/*
	multe
*/

require("foo.js")


`;
const result = fastAnalysis({ input: str });

console.log(result);
