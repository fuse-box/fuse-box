import * as fs from 'fs';
import { ITarget } from '../../config/PrivateConfig';
import { Context } from '../../core/Context';
import { createModule } from '../../moduleResolver/Module';
import { createPackage } from '../../moduleResolver/Package';
import { generate } from '../generator/generator';
import { ASTNode } from '../interfaces/AST';
import { parseJavascript, parseTypeScript } from '../parser';
import { transformCommonVisitors } from '../transformer';

export interface ICompileModuleProps {
  code?: string;
  emitDecoratorMetadata?: boolean;
  fileName?: string;
  target?: ITarget;
  useMeriyah?: boolean;
  env?: { [key: string]: string };
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

  const ctx = new Context({
    cache: false,
    devServer: false,
    env: props.env,
    target: props.target || 'browser',
  });

  if (props.emitDecoratorMetadata) {
    ctx.tsConfig.compilerOptions.emitDecoratorMetadata = props.emitDecoratorMetadata;
  }

  const pkg = createPackage({ meta: {} as any });
  const module = createModule({
    absPath: __filename,
    ctx,
    pkg,
  });
  module.ast = ast as ASTNode;

  transformCommonVisitors(module);

  const res = generate(ast, {});

  return res;
}
