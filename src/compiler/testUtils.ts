import { ICompilerOptions } from '../compilerOptions/interfaces';
import { transformModule } from './core/transformModule';
import { generate } from './generator/generator';
import { ASTNode } from './interfaces/AST';
import { ITransformer, ITransformerCommon } from './interfaces/ITransformer';
import { ITransformerRequireStatementCollection } from './interfaces/ITransformerRequireStatements';
import { ImportType } from './interfaces/ImportType';
import { parseTypeScript } from './parser';
import { ISerializableTransformationContext } from './transformer';

function cleanupForTest(node) {
  delete node.loc;
  delete node.raw;
  delete node.range;
}
export function initCommonTransform(props: {
  code: string;
  compilerOptions?: ICompilerOptions;
  jsx?: boolean;
  props?: ISerializableTransformationContext;
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

  const ast = parseTypeScript(props.code, { jsx: props.jsx });
  const userProps: ISerializableTransformationContext = props.props || {};
  userProps.compilerOptions = props.compilerOptions || {};
  const visitorProps: ITransformerCommon = { onRequireCallExpression, transformationContext: userProps };

  const tranformers = [];
  for (const t of props.transformers) {
    if (t.commonVisitors) {
      tranformers.push(t.commonVisitors(visitorProps));
    }
  }

  transformModule({ root: ast, transformers: tranformers });

  const res = generate(ast, {});

  return { code: res, requireStatementCollection };
}
