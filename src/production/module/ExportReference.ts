import { ASTNode } from '../../compiler/interfaces/AST';
import { IVisit } from '../../compiler/Visitor/Visitor';
import { Module } from '../../core/Module';
import { IProductionContext } from '../ProductionContext';

export interface ExportReferenceProps {
  module: Module;
  productionContext: IProductionContext;
  visit: IVisit;
}

export enum ExportReferenceType {
  FUNCTION,
  CLASS,
  LOCAL_REFERENCE,
}

export interface IExportReferenceProps {
  scope: IExportReferences;
  type: ExportReferenceType;
  name: string;
  local?: string;
  visit?: IVisit;
  targetObjectAst?: ASTNode;
}
export function ExportReference(props: IExportReferenceProps) {
  const exposed = {
    name: props.name,
    local: props.local,
    type: props.type,
    targetObjectAst: props.targetObjectAst,
    remove: () => {},
  };
  return exposed;
}

export type IExportReference = ReturnType<typeof ExportReference>;

/**
 * Register simple exports
 * export function foo(){}
 * export class Foo {}
 * @param props
 */
function SingeObjectExport(props: ExportReferenceProps, scope: IExportReferences) {
  const { node } = props.visit;
  let type: ExportReferenceType;
  const declaration = node.declaration;

  if (declaration.type === 'FunctionDeclaration') type = ExportReferenceType.FUNCTION;
  else if (declaration.type === 'ClassDeclaration') type = ExportReferenceType.CLASS;
  if (type === undefined) return;

  const name = declaration.id.name;
  scope.references.push(
    ExportReference({ scope, name, targetObjectAst: node.declaration, local: name, visit: props.visit, type: type }),
  );
}

/**
 * Register simple exports
 * export default function foo(){}
 * export default class Foo {}
 * @param props
 */

function SingeDefaultExport(props: ExportReferenceProps, scope: IExportReferences) {
  const { node } = props.visit;
  let type: ExportReferenceType;
  const declaration = node.declaration;

  if (declaration.type === 'FunctionDeclaration') type = ExportReferenceType.FUNCTION;
  else if (declaration.type === 'ClassDeclaration') type = ExportReferenceType.CLASS;
  if (type === undefined) return;

  scope.references.push(
    ExportReference({
      name: 'default',
      scope,
      targetObjectAst: node.declaration,
      local: declaration.id ? declaration.id.name : undefined,
      visit: props.visit,
      type: type,
    }),
  );
}
// export {foo, bar }
export function HandleExportReferences(props: ExportReferenceProps, scope: IExportReferences) {
  const { node } = props.visit;
  for (const specifier of node.specifiers) {
    if (specifier.local.name && specifier.exported.name) {
      scope.references.push(
        ExportReference({
          scope,
          name: specifier.exported.name,
          local: specifier.local.name,
          visit: props.visit,
          type: ExportReferenceType.LOCAL_REFERENCE,
        }),
      );
    }
  }
}
export function ExportReferences(productionContext: IProductionContext, module: Module) {
  const references: Array<IExportReference> = [];

  const scope = {
    references,
    register: (props: ExportReferenceProps) => {
      const { node } = props.visit;
      if (node.type === 'ExportNamedDeclaration') {
        if (!node.source) {
          if (!node.specifiers.length && node.declaration) {
            // export function foo{}
            // export class Foo {}
            SingeObjectExport(props, scope);
          } else {
            // export {foo, bar}
            HandleExportReferences(props, scope);
          }
        }
      } else if (node.type === 'ExportDefaultDeclaration') {
        // export default function a
        // export default class A
        if (node.declaration) {
          SingeDefaultExport(props, scope);
        }
      }
    },
  };
  return scope;
}

export type IExportReferences = ReturnType<typeof ExportReferences>;
