import { ISchema } from '../../compiler/core/nodeSchema';
import { ASTNode } from '../../compiler/interfaces/AST';
import { IModule } from '../../moduleResolver/module';
import { IProductionContext } from '../ProductionContext';

export interface ExportReferenceProps {
  module: IModule;
  productionContext: IProductionContext;
  schema: ISchema;
}

export enum ExportReferenceType {
  FUNCTION,
  CLASS,
  LOCAL_REFERENCE,
}

export interface IExportReferenceProps {
  local?: string;
  name: string;
  schema?: ISchema;
  scope: IExportReferences;
  targetObjectAst?: ASTNode;
  type: ExportReferenceType;
}
export function ExportReference(props: IExportReferenceProps) {
  const exposed = {
    local: props.local,
    name: props.name,
    targetObjectAst: props.targetObjectAst,
    type: props.type,
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
  const { node } = props.schema;
  let type: ExportReferenceType;
  const declaration = node.declaration;

  if (declaration.type === 'FunctionDeclaration') type = ExportReferenceType.FUNCTION;
  else if (declaration.type === 'ClassDeclaration') type = ExportReferenceType.CLASS;
  if (type === undefined) return;

  const name = declaration.id.name;
  scope.references.push(
    ExportReference({ local: name, name, schema: props.schema, scope, targetObjectAst: node.declaration, type: type }),
  );
}

/**
 * Register simple exports
 * export default function foo(){}
 * export default class Foo {}
 * @param props
 */

function SingeDefaultExport(props: ExportReferenceProps, scope: IExportReferences) {
  const { node } = props.schema;
  let type: ExportReferenceType;
  const declaration = node.declaration;

  if (declaration.type === 'FunctionDeclaration') type = ExportReferenceType.FUNCTION;
  else if (declaration.type === 'ClassDeclaration') type = ExportReferenceType.CLASS;
  if (type === undefined) return;

  scope.references.push(
    ExportReference({
      local: declaration.id ? declaration.id.name : undefined,
      name: 'default',
      schema: props.schema,
      scope,
      targetObjectAst: node.declaration,
      type: type,
    }),
  );
}
// export {foo, bar }
export function HandleExportReferences(props: ExportReferenceProps, scope: IExportReferences) {
  const { node } = props.schema;
  for (const specifier of node.specifiers) {
    if (specifier.local.name && specifier.exported.name) {
      scope.references.push(
        ExportReference({
          local: specifier.local.name,
          name: specifier.exported.name,
          schema: props.schema,
          scope,
          type: ExportReferenceType.LOCAL_REFERENCE,
        }),
      );
    }
  }
}
export function ExportReferences(productionContext: IProductionContext, module: IModule) {
  const references: Array<IExportReference> = [];

  const scope = {
    references,
    register: (props: ExportReferenceProps) => {
      const { node } = props.schema;
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
