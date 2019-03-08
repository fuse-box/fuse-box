import { fastTransform } from './fastTransform';
import * as ts from 'typescript';
const name = 1;

const str = `
require('foo')
`;

const tsString = `
import * as a from "a";
const shit = 1;
export class Some<T> {
	constructor() {}
	public start() : boolean{
		return true;
	}
}

`;

const data = ts.createSourceFile('oi.ts', tsString, ts.ScriptTarget.ESNext);
console.log(data);
// const code = fastTransform({ input: str });

// console.log(code);
