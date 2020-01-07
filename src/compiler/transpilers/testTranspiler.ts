import * as buntis from 'buntis';
import * as fs from 'fs';
import * as path from 'path';
import { ITarget } from '../../config/PrivateConfig';
import { createContext } from '../../core/Context';
import { createModule } from '../../core/Module';
import { createPackage } from '../../core/Package';
import { makeFuseBoxPath } from '../../utils/utils';
import { generate } from '../generator/generator';
import { ASTNode } from '../interfaces/AST';
import { transformCommonVisitors } from '../transformer';
import { parseTypeScript } from '../parser';

export interface ICompileModuleProps {
  target?: ITarget;
  env?: { [key: string]: string };
  fileName?: string;
  code?: string;
  emitDecoratorMetadata?: boolean;
}

export function testTranspile(props: ICompileModuleProps) {
  let contents = props.code;
  let fileName = props.fileName || __filename;
  if (!contents) {
    contents = fs.readFileSync(props.fileName).toString();
  }

  const ext = props.fileName ? path.extname(props.fileName) : '.tsx';

  const ast = parseTypeScript(contents, { jsx: ext !== '.ts' });

  const ctx = createContext({
    cache: false,
    devServer: false,
    target: props.target || 'browser',
    env: props.env,
  });

  if (props.emitDecoratorMetadata) {
    ctx.tsConfig.compilerOptions.emitDecoratorMetadata = props.emitDecoratorMetadata;
  }

  const pkg = createPackage({ ctx: ctx, meta: {} as any });
  const module = createModule(
    {
      absPath: __filename,
      ctx: ctx,
      extension: ext,
      fuseBoxPath: makeFuseBoxPath(path.dirname(props.fileName || __filename), props.fileName || __filename),
    },
    pkg,
  );
  module.ast = ast as ASTNode;

  transformCommonVisitors(module);

  const res = generate(ast, {});

  return res;
  //return { code: res, requireStatementCollection };
}
