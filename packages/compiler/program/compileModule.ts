import * as buntis from "buntis";
import { generate } from "../generator/generator";
import { ASTNode } from "../interfaces/AST";
import { ICompilerOptions } from "../interfaces/ICompilerOptions";
import { ClassConstructorPropertyTransformer } from "../transformers/ClassConstructorPropertyTransformer";
import { ExportTransformer } from "../transformers/ExportTransformer";
import { GlobalContextTransformer } from "../transformers/GlobalContextTransformer";
import { ImportTransformer } from "../transformers/ImportTransformer";
import { InterfaceRemoverTransformer } from "../transformers/InterfaceRemoverTransformer";
import { JSXTransformer } from "../transformers/JSXTransformer";
import { NamespaceTransformer } from "../transformers/NameSpaceTransformer";
import { IVisit, IVisitorMod } from "../Visitor/Visitor";
import { createGlobalContext } from "./GlobalContext";
import { ITransformerList, transpileModule } from "./transpileModule";

export interface ICompileModuleProps {
  code: string;
  globalContext?: any;
  transformers?: Array<(globalContext) => (visit: IVisit) => IVisitorMod>;
  compilerOptions?: ICompilerOptions;
}

export function compileModule(props: ICompileModuleProps) {
  const ast = buntis.parseTSModule(props.code, {
    directives: true,
    jsx: true,
    next: true,
    loc: true,
    ts: true
  });

  const defaultTransformers: ITransformerList = [
    GlobalContextTransformer(),
    ClassConstructorPropertyTransformer(),
    JSXTransformer(),
    NamespaceTransformer(),
    InterfaceRemoverTransformer(),
    ImportTransformer(),
    ExportTransformer()
  ];
  transpileModule({
    ast: ast as ASTNode,
    compilerOptions: props.compilerOptions,
    globalContext: createGlobalContext(props.globalContext),
    transformers: defaultTransformers
  });
  //console.log(JSON.stringify(ast, null, 2));
  const res = generate(ast, {});

  return { code: res };
}
