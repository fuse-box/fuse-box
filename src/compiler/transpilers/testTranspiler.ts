import * as fs from 'fs';
import * as path from 'path';
import { ICompilerOptions } from '../../compilerOptions/interfaces';
import { EnvironmentType } from '../../config/EnvironmentType';
import { ITarget } from '../../config/ITarget';
import { createContext } from '../../core/context';
import { createModule } from '../../moduleResolver/module';
import { createPackage } from '../../moduleResolver/package';
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

  const ctx = createContext({
    envType: EnvironmentType.DEVELOPMENT,

    publicConfig: { cache: false, devServer: false, entry: __filename },
    runProps: {},
  });

  const pkg = createPackage({ meta: {} as any });
  const module = createModule({
    absPath: __filename,
    ctx,
    pkg,
  });

  module.ast = ast as ASTNode;
  const targetFileName = props.fileName || __filename;
  transformCommonVisitors(
    {
      compilerOptions: ctx.compilerOptions,
      module: { absPath: targetFileName, extension: path.extname(targetFileName), publicPath: targetFileName },
    },
    ast,
  );

  const res = generate(ast, {});

  return res;
}
