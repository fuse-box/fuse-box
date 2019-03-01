import { fastTransform } from "./fastTransform";
const name = 1;

const str = `
require('foo')
`;

const code = fastTransform({ input: str });

console.log(code);
