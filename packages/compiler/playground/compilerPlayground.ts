import { compileModule } from '../program/compileModule';

const result = compileModule({
  code: `

  import MySuperClass, * as everything from "module-name";
  everything.something();

  console.log(everything);
  new MySuperClass();

`,
});
console.log(result.code);
export default abstract class RendererFactory2 {}
