import * as buntis from 'buntis';
import { generate } from '../generator/generator';
import { ASTNode } from '../interfaces/AST';
import { ICompilerOptions } from '../interfaces/ICompilerOptions';
import { ImportType } from '../interfaces/ImportType';
import { ITransformerRequireStatementCollection } from '../interfaces/ITransformerRequireStatements';
import { createGlobalContext } from '../program/GlobalContext';
import { ITransformerList, transpileModule } from '../program/transpileModule';
import { BrowserProcessTransformer } from '../transformers/bundle/BrowserProcessTransformer';
import { BundleFastConditionUnwrapper } from '../transformers/bundle/BundleFastConditionTransformer';
import { BundlePolyfillTransformer, IBundleEssentialProps } from '../transformers/bundle/BundlePolyfillTransformer';
import { RequireStatementInterceptor } from '../transformers/bundle/RequireStatementInterceptor';
import { GlobalContextTransformer } from '../transformers/GlobalContextTransformer';
import { DynamicImportTransformer } from '../transformers/shared/DynamicImportTransformer';
import { ExportTransformer } from '../transformers/shared/ExportTransformer';
import { ImportTransformer } from '../transformers/shared/ImportTransformer';
import { JSXTransformer } from '../transformers/shared/JSXTransformer';
import { OptionalChaningTransformer } from '../transformers/shared/OptionalChaningTransformer';
import { AngularURLTransformer } from '../transformers/ts/AngularURLTransformer';
import { ClassConstructorPropertyTransformer } from '../transformers/ts/ClassConstructorPropertyTransformer';
import { CommonTSfeaturesTransformer } from '../transformers/ts/CommonTSfeaturesTransformer';
import { DecoratorTransformer } from '../transformers/ts/decorators/DecoratorTransformer';
import { EnumTransformer } from '../transformers/ts/EnumTransformer';
import { NamespaceTransformer } from '../transformers/ts/NameSpaceTransformer';
import { IVisit, IVisitorMod } from '../Visitor/Visitor';

export interface ICompileModuleProps {
  code: string;
  withJSX?: boolean;
  globalContext?: any;
  transformers?: Array<(globalContext) => (visit: IVisit) => IVisitorMod>;
  compilerOptions?: ICompilerOptions;
  bundleProps?: IBundleEssentialProps;
  emitDecoratorMetadata?: boolean;
}

export function testTranspile(props: ICompileModuleProps) {
  if (props.withJSX === undefined) {
    props.withJSX = true;
  }

  const ast = buntis.parseTSModule(props.code, {
    directives: true,
    jsx: props.withJSX,
    next: true,
    loc: true,
  });
  const requireStatementCollection: ITransformerRequireStatementCollection = [];
  function onRequireCallExpression(importType: ImportType, statement: ASTNode) {
    // making sure we have haven't emitted the same property twice
    if (!statement['emitted']) {
      Object.defineProperty(statement, 'emitted', { enumerable: false, value: true });
      requireStatementCollection.push({ importType, statement });
    }
  }

  let bundleProps: IBundleEssentialProps = props.bundleProps || {
    moduleFileName: './somefile.ts',
    target: 'browser',
  };

  const defaultTransformers: ITransformerList = [
    GlobalContextTransformer(),
    //ObfuscationTransformer(),
    OptionalChaningTransformer(),
    AngularURLTransformer({ onRequireCallExpression }),
    BundleFastConditionUnwrapper({
      env: bundleProps.env,
      isBrowser: bundleProps.isBrowser,
      isServer: bundleProps.isServer,
    }),
    DecoratorTransformer({ emitDecoratorMetadata: props.emitDecoratorMetadata }),
    RequireStatementInterceptor({ onRequireCallExpression }),
    bundleProps.target === 'browser' && BrowserProcessTransformer({ ...bundleProps, onRequireCallExpression }),
    BundlePolyfillTransformer({ ...bundleProps, onRequireCallExpression }),

    DynamicImportTransformer({ onRequireCallExpression }),
    EnumTransformer(),
    ClassConstructorPropertyTransformer(),
    JSXTransformer(),
    NamespaceTransformer(),

    // must be before export/import
    CommonTSfeaturesTransformer(),
    ImportTransformer({ onRequireCallExpression }),
    ExportTransformer({ onRequireCallExpression }),
  ];
  transpileModule({
    ast: ast as ASTNode,
    compilerOptions: props.compilerOptions,
    globalContext: createGlobalContext(props.globalContext),
    transformers: defaultTransformers,
  });

  const res = generate(ast, {});

  return { code: res, requireStatementCollection };
}
