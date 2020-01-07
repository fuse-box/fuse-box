import { generate } from './generator/generator';
import { ASTNode } from './interfaces/AST';
import { ImportType } from './interfaces/ImportType';
import { ITransformer } from './interfaces/ITransformer';
import { ITransformerRequireStatementCollection } from './interfaces/ITransformerRequireStatements';
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
  jsx?: boolean;
  code: string;
  transformers: Array<ITransformer>;
  props?: any;
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

  const ast = parseTypeScript(props.code, { jsx: props.jsx });

  // const ast = buntis.parseTSModule(props.code, {
  //   directives: true,
  //   jsx: props.jsx,
  //   next: true,
  //   loc: true,
  // });
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
