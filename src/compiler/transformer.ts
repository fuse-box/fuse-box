import * as path from 'path';
import { ICompilerOptions } from '../compilerOptions/interfaces';
import { TS_EXTENSIONS } from '../config/extensions';
import { ASTNode } from './interfaces/AST';
import { ITransformerResult } from './interfaces/ITranformerResult';
import {
  IRequireStatementModuleOptions,
  ITransformer,
  ITransformerCommon,
  ITransformerVisitors,
} from './interfaces/ITransformer';
import { ITransformerRequireStatementCollection } from './interfaces/ITransformerRequireStatements';
import { ImportType } from './interfaces/ImportType';
import { createGlobalContext } from './program/GlobalContext';
import { transpileModule } from './program/transpileModule';
import { GlobalContextTransformer } from './transformers/GlobalContextTransformer';
import { BrowserProcessTransformer } from './transformers/bundle/BrowserProcessTransformer';
import { BuildEnvTransformer } from './transformers/bundle/BuildEnvTransformer';
import { BundleFastConditionUnwrapper } from './transformers/bundle/BundleFastConditionTransformer';
import { BundlePolyfillTransformer } from './transformers/bundle/BundlePolyfillTransformer';
import { RequireStatementInterceptor } from './transformers/bundle/RequireStatementInterceptor';
import { OptionalChaningTransformer } from './transformers/optionalChaining/OptionalChainingTransformer';
import { DynamicImportTransformer } from './transformers/shared/DynamicImportTransformer';
import { ExportTransformer } from './transformers/shared/ExportTransformer';
import { ImportTransformer } from './transformers/shared/ImportTransformer';
import { JSXTransformer } from './transformers/shared/JSXTransformer';
import { ClassConstructorPropertyTransformer } from './transformers/ts/ClassConstructorPropertyTransformer';
import { CommonTSfeaturesTransformer } from './transformers/ts/CommonTSfeaturesTransformer';
import { EnumTransformer } from './transformers/ts/EnumTransformer';
import { NamespaceTransformer } from './transformers/ts/NameSpaceTransformer';
import { DecoratorTransformer } from './transformers/ts/decorators/DecoratorTransformer';

export const USER_CUSTOM_TRANSFORMERS: Record<string, ITransformer> = {};
/**
 * Order of those transformers MATTER!
 */
export const BASE_TRANSFORMERS: Array<ITransformer> = [
  // this should always come first
  GlobalContextTransformer(),

  BuildEnvTransformer(),

  OptionalChaningTransformer(),

  BundleFastConditionUnwrapper(),

  DecoratorTransformer(),
  RequireStatementInterceptor(),

  BrowserProcessTransformer(),
  BundlePolyfillTransformer(),

  DynamicImportTransformer(),
  EnumTransformer(),
  ClassConstructorPropertyTransformer(),
  JSXTransformer(),
  NamespaceTransformer(),

  // must be before export/import
  CommonTSfeaturesTransformer(),
  ImportTransformer(),
  ExportTransformer(),
];

export function isTransformerEligible(absPath: string, transformer: ITransformer) {
  const isTypescript = TS_EXTENSIONS.includes(path.extname(absPath));
  if (transformer.target) {
    if (transformer.target.type) {
      if (transformer.target.type === 'js_ts') return true;
      if (transformer.target.type === 'js' && !isTypescript) return true;
      if (transformer.target.type === 'ts' && isTypescript) return true;
    } else if (transformer.target.test) {
      return transformer.target.test.test(absPath);
    }
    return false;
  }
  return true;
}

export interface ISerializableTransformationContext {
  compilerOptions?: ICompilerOptions;
  userTransformers?: Array<ITransformer>;
  module?: {
    absPath?: string;
    extension?: string;
    publicPath?: string;
  };
}

export function registerTransformer(name: string, transformer: ITransformer) {
  USER_CUSTOM_TRANSFORMERS[name] = transformer;
}

export function transformCommonVisitors(props: ISerializableTransformationContext, ast: ASTNode): ITransformerResult {
  const requireStatementCollection: ITransformerRequireStatementCollection = [];
  function onRequireCallExpression(
    importType: ImportType,
    statement: ASTNode,
    moduleOptions?: IRequireStatementModuleOptions,
  ) {
    // making sure we have haven't emitted the same property twice
    if (!statement['emitted']) {
      Object.defineProperty(statement, 'emitted', { enumerable: false, value: true });
      requireStatementCollection.push({ importType, moduleOptions, statement });
    }
  }
  const userTransformers = props.userTransformers || [];

  const commonVisitors: Array<ITransformerVisitors> = [];

  let index = 0;
  const visitorProps: ITransformerCommon = { onRequireCallExpression, transformationContext: props };
  while (index < BASE_TRANSFORMERS.length) {
    const transformer = BASE_TRANSFORMERS[index];
    // user transformer need to be executed after the first transformers
    if (index === 1) {
      for (const userTransformer of userTransformers) {
        if (userTransformer.commonVisitors && isTransformerEligible(props.module.absPath, userTransformer))
          commonVisitors.push(userTransformer.commonVisitors(visitorProps));
      }
    }
    if (transformer.commonVisitors && isTransformerEligible(props.module.absPath, transformer))
      commonVisitors.push(transformer.commonVisitors(visitorProps));
    index++;
  }

  transpileModule({
    ast: ast,
    globalContext: createGlobalContext(),
    transformers: commonVisitors,
  });

  return { ast, requireStatementCollection };
}
