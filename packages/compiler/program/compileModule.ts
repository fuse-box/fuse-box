import * as buntis from 'buntis';
import { generate } from '../generator/generator';
import { ASTNode } from '../interfaces/AST';
import { ICompilerOptions } from '../interfaces/ICompilerOptions';
import { ImportType } from '../interfaces/ImportType';
import { ITransformerRequireStatementCollection } from '../interfaces/ITransformerRequireStatements';
import { BundleEssentialTransformer, IBundleEssentialProps } from '../transformers/bundle/BundleEssentialTransformer';
import { GlobalContextTransformer } from '../transformers/GlobalContextTransformer';
import { DynamicImportTransformer } from '../transformers/shared/DynamicImportTransformer';
import { ExportTransformer } from '../transformers/shared/ExportTransformer';
import { ImportTransformer } from '../transformers/shared/ImportTransformer';
import { JSXTransformer } from '../transformers/shared/JSXTransformer';
import { ClassConstructorPropertyTransformer } from '../transformers/ts/ClassConstructorPropertyTransformer';
import { CommonTSfeaturesTransformer } from '../transformers/ts/CommonTSfeaturesTransformer';
import { EnumTransformer } from '../transformers/ts/EnumTransformer';
import { NamespaceTransformer } from '../transformers/ts/NameSpaceTransformer';
import { IVisit, IVisitorMod } from '../Visitor/Visitor';
import { createGlobalContext } from './GlobalContext';
import { ITransformerList, transpileModule } from './transpileModule';
import { BrowserProcessTransform } from '../transformers/bundle/BrowserProcessTransform';

export interface ICompileModuleProps {
  code: string;
  globalContext?: any;
  transformers?: Array<(globalContext) => (visit: IVisit) => IVisitorMod>;
  compilerOptions?: ICompilerOptions;
  bundleProps?: IBundleEssentialProps;
}

export function compileModule(props: ICompileModuleProps) {
  const ast = buntis.parseTSModule(props.code, {
    directives: true,
    jsx: true,
    next: true,
    loc: true,
  });
  const requireStatementCollection: ITransformerRequireStatementCollection = [];
  function addRequireStatement(importType: ImportType, statement: ASTNode) {
    requireStatementCollection.push({ importType, statement });
  }

  let bundleProps = props.bundleProps || {
    moduleDirName: './',
    moduleFileName: './somefile.ts',
    target: 'browser',
  };

  const defaultTransformers: ITransformerList = [
    GlobalContextTransformer(),
    bundleProps.target === 'browser' &&
      BrowserProcessTransform({ ...bundleProps, onRequireCallExpression: addRequireStatement }),
    BundleEssentialTransformer({ onRequireCallExpression: addRequireStatement, ...bundleProps }),
    DynamicImportTransformer({ onRequireCallExpression: addRequireStatement }),
    EnumTransformer(),
    ClassConstructorPropertyTransformer(),
    JSXTransformer(),
    NamespaceTransformer(),

    // must be before export/import
    CommonTSfeaturesTransformer(),
    ImportTransformer({ onRequireCallExpression: addRequireStatement }),
    ExportTransformer({ onRequireCallExpression: addRequireStatement }),
  ];
  transpileModule({
    ast: ast as ASTNode,
    compilerOptions: props.compilerOptions,
    globalContext: createGlobalContext(props.globalContext),
    transformers: defaultTransformers,
  });
  //console.log(JSON.stringify(ast, null, 2));
  const res = generate(ast, {});

  return { code: res, requireStatementCollection };
}
