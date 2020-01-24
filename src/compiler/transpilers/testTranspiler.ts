import * as fs from 'fs';
import { ICompilerOptions } from '../../compilerOptions/interfaces';
import { ITarget } from '../../config/ITarget';
import { createModule } from '../../moduleResolver/module';
import { createPackage } from '../../moduleResolver/package';
import { createTestContext } from '../../utils/test_utils';
import { generate } from '../generator/generator';
import { ASTNode } from '../interfaces/AST';
import { parseJavascript, parseTypeScript } from '../parser';
import { transformCommonVisitors } from '../transformer';

export interface ICompileModuleProps {
  code?: string;

  compilerOptions: ICompilerOptions;
  fileName?: string;
  target?: ITarget;
  useMeriyah?: boolean;
}

export function testTranspile(props: ICompileModuleProps) {
  let contents = props.code;

  if (!contents) {
    contents = fs.readFileSync(props.fileName).toString();
  }

  let ast;
  if (props.useMeriyah) {
    ast = parseJavascript(contents, { jsx: true });
  } else {
    ast = parseTypeScript(contents, { jsx: true });
  }

  const ctx = createTestContext({
    cache: false,
    devServer: false,
  });

  const pkg = createPackage({ meta: {} as any });
  const module = createModule({
    absPath: __filename,
    ctx,
    pkg,
  });
  module.props.fuseBoxPath = __filename;
  module.ast = ast as ASTNode;

  transformCommonVisitors(module, props.compilerOptions);

  const res = generate(ast, {});

  return res;
}
