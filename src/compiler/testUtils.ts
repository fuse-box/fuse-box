import { ICompilerOptions } from '../compilerOptions/interfaces';
import { generate } from './generator/generator';
import { ASTNode } from './interfaces/AST';
import { ITransformer } from './interfaces/ITransformer';
import { ITransformerRequireStatementCollection } from './interfaces/ITransformerRequireStatements';
import { ImportType } from './interfaces/ImportType';
import { parseTypeScript } from './parser';
import { createGlobalContext } from './program/GlobalContext';
import { transpileModule } from './program/transpileModule';
import { GlobalContextTransformer } from './transformers/GlobalContextTransformer';

function cleanupForTest(node) {
  delete node.loc;
  delete node.raw;
  delete node.range;
}
export function initCommonTransform(props: {
  code: string;
  compilerOptions?: ICompilerOptions;
  jsx?: boolean;
  props?: any;
  transformers: Array<ITransformer>;
}) {
  const requireStatementCollection: ITransformerRequireStatementCollection = [];
  function onRequireCallExpression(importType: ImportType, statement: ASTNode) {
    // making sure we have haven't emitted the same property twice
    if (!statement['emitted']) {
      Object.defineProperty(statement, 'emitted', { enumerable: false, value: true });
      cleanupForTest(statement.arguments[0]);
      cleanupForTest(statement);
      cleanupForTest(statement.callee);

      requireStatementCollection.push({ importType, statement });
    }
  }
  const compilerOptions = props.compilerOptions || {};

  const ast = parseTypeScript(props.code, { jsx: props.jsx });
  const tranformers = [GlobalContextTransformer().commonVisitors(props.props)];
  for (const t of props.transformers) {
    if (t.commonVisitors) {
      tranformers.push(t.commonVisitors({ ...props.props, compilerOptions, onRequireCallExpression }));
    }
  }
  transpileModule({
    ast: ast as ASTNode,
    globalContext: createGlobalContext(),
    transformers: tranformers,
  });
  const res = generate(ast, {});

  return { code: res, requireStatementCollection };
}
