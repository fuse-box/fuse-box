import { ASTNode } from '../interfaces/AST';
import { ImportType } from '../interfaces/ImportType';
import { ITransformerResult } from '../interfaces/ITranformerResult';
import { ITransformerRequireStatementCollection } from '../interfaces/ITransformerRequireStatements';
import { ITranspiler } from '../interfaces/ITranspiler';
import { createGlobalContext } from '../program/GlobalContext';
import { ITransformerList, transpileModule } from '../program/transpileModule';
import { BrowserProcessTransformer } from '../transformers/bundle/BrowserProcessTransformer';
import { BundleFastConditionUnwrapper } from '../transformers/bundle/BundleFastConditionTransformer';
import { BundlePolyfillTransformer } from '../transformers/bundle/BundlePolyfillTransformer';
import { RequireStatementInterceptor } from '../transformers/bundle/RequireStatementInterceptor';
import { GlobalContextTransformer } from '../transformers/GlobalContextTransformer';
import { DynamicImportTransformer } from '../transformers/shared/DynamicImportTransformer';
import { ExportTransformer } from '../transformers/shared/ExportTransformer';
import { ImportTransformer } from '../transformers/shared/ImportTransformer';
import { JSXTransformer } from '../transformers/shared/JSXTransformer';
import { ClassConstructorPropertyTransformer } from '../transformers/ts/ClassConstructorPropertyTransformer';
import { CommonTSfeaturesTransformer } from '../transformers/ts/CommonTSfeaturesTransformer';
import { DecoratorTransformer } from '../transformers/ts/decorators/DecoratorTransformer';
import { EnumTransformer } from '../transformers/ts/EnumTransformer';
import { NamespaceTransformer } from '../transformers/ts/NameSpaceTransformer';

export function typescriptTranspiler(props: ITranspiler): ITransformerResult {
  const requireStatementCollection: ITransformerRequireStatementCollection = [];
  function onRequireCallExpression(importType: ImportType, statement: ASTNode) {
    // making sure we have haven't emitted the same property twice
    if (!statement['emitted']) {
      Object.defineProperty(statement, 'emitted', { enumerable: false, value: true });
      requireStatementCollection.push({ importType, statement });
    }
  }

  const defaultTransformers: ITransformerList = [
    GlobalContextTransformer(),
    BundleFastConditionUnwrapper({
      env: props.env,
      isBrowser: props.isBrowser,
      isServer: props.isServer,
    }),
    DecoratorTransformer({ onRequireCallExpression, emitDecoratorMetadata: props.emitDecoratorMetadata }),
    RequireStatementInterceptor({ onRequireCallExpression }),
    props.target === 'browser' && BrowserProcessTransformer({ env: props.env, onRequireCallExpression }),
    BundlePolyfillTransformer({ ...props, onRequireCallExpression }),

    DynamicImportTransformer({ onRequireCallExpression }),
    EnumTransformer(),
    ClassConstructorPropertyTransformer(),
    JSXTransformer(),
    NamespaceTransformer(),

    CommonTSfeaturesTransformer(),
    ImportTransformer({ onRequireCallExpression }),
    ExportTransformer({ onRequireCallExpression }),
  ];
  if (props.transformers && props.transformers.length) {
    const opts = { module: props.module, onRequireCallExpression };
    for (const transformer of props.transformers) {
      defaultTransformers.unshift(transformer(opts));
    }
  }

  transpileModule({
    ast: props.ast as ASTNode,
    globalContext: createGlobalContext({}),
    transformers: defaultTransformers,
  });

  return { ast: props.ast, requireStatementCollection };
}
