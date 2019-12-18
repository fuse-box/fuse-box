import * as buntis from 'buntis';
import { generate } from './generator/generator';
import { ASTNode } from './interfaces/AST';
import { ITransformer } from './interfaces/ITransformer';
import { ITransformerRequireStatementCollection } from './interfaces/ITransformerRequireStatements';
import { ImportType } from './interfaces/ImportType';
import { createGlobalContext } from './program/GlobalContext';
import { transpileModule } from './program/transpileModule';
import { GlobalContextTransformer } from './transformers/GlobalContextTransformer';

export function initCommonTransform(props: {
  code: string;
  jsx?: boolean;
  props?: any;
  transformers: Array<ITransformer>;
}) {
  const requireStatementCollection: ITransformerRequireStatementCollection = [];
  function onRequireCallExpression(importType: ImportType, statement: ASTNode) {
    // making sure we have haven't emitted the same property twice
    if (!statement['emitted']) {
      Object.defineProperty(statement, 'emitted', { enumerable: false, value: true });
      requireStatementCollection.push({ importType, statement });
    }
  }

  const ast = buntis.parseTSModule(props.code, {
    directives: true,
    jsx: props.jsx,
    loc: true,
    next: true,
  });
  const tranformers = [GlobalContextTransformer().commonVisitors(props.props)];
  for (const t of props.transformers) {
    if (t.commonVisitors) {
      tranformers.push(t.commonVisitors({ ...props.props, onRequireCallExpression }));
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
