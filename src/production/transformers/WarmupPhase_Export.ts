import { ISchema } from '../../compiler/core/nodeSchema';
import { ITransformer } from '../../compiler/interfaces/ITransformer';
import { ExportReferenceType } from '../module/ExportReference';

const NODES_OF_INTEREST = {
  ExportAllDeclaration: 1,
  ExportDefaultDeclaration: 1,
  ExportNamedDeclaration: 1,
};

const OBJECT_DECLARATIONS = {
  ClassDeclaration: 1,
  FunctionDeclaration: 1,
};

// function isObjectDefineLocally(node: ASTNode) {
//   if (OBJECT_DECLARATIONS[node.type]) {
//     if (node.id) return [{ init: true, name: node.id.name }];
//   }
// }

export function Phase_1_ExportLink(): ITransformer {
  return {
    productionWarmupPhase: ({ module, productionContext }) => {
      return {
        onEach: (schema: ISchema) => {
          const { node } = schema;
          const tree = module.moduleTree;
          const refs = tree.exportReferences.references;

          // trying to find an object by local ref type
          // fro example:
          // if we had export { foo }
          // we should be able to trace that function foo()
          if (OBJECT_DECLARATIONS[node.type] && node.id && node.id.name) {
            for (const ref of refs) {
              if (ref.type === ExportReferenceType.LOCAL_REFERENCE && ref.local === node.id.name) {
                ref.targetObjectAst = node;
              }
            }
          }
          return;
        },
        onProgramBody: (schema: ISchema) => {
          const { node } = schema;
          const tree = module.moduleTree;

          if (NODES_OF_INTEREST[node.type]) {
            tree.exportReferences.register({ module: module, productionContext: productionContext, schema: schema });
          }
        },
      };
    },
  };
}
