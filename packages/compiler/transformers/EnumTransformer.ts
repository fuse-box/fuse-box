import { IVisit, IVisitorMod } from '../Visitor/Visitor';
import { ASTNode } from '../interfaces/AST';

export function EnumTransformer() {
  return (visit: IVisit): IVisitorMod => {
    const node = visit.node;

    if (node.type === 'EnumDeclaration') {
      const enumName = node.id.name;

      const Declaration: ASTNode = {
        type: 'VariableDeclaration',
        kind: 'var',
        declarations: [
          {
            type: 'VariableDeclarator',
            init: null,
            id: {
              type: 'Identifier',
              name: enumName,
            },
          },
        ],
      };

      const enumBody: Array<ASTNode> = [];

      const EnumWrapper: ASTNode = {
        type: 'CallExpression',
        callee: {
          type: 'FunctionExpression',
          params: [
            {
              type: 'Identifier',
              name: enumName,
            },
          ],
          body: {
            type: 'BlockStatement',
            body: enumBody,
          },
          async: false,
          generator: false,
          id: null,
        },
        arguments: [
          {
            type: 'LogicalExpression',
            left: {
              type: 'Identifier',
              name: enumName,
            },
            right: {
              type: 'AssignmentExpression',
              left: {
                type: 'Identifier',
                name: enumName,
              },
              operator: '=',
              right: {
                type: 'ObjectExpression',
                properties: [],
              },
            },
            operator: '||',
          },
        ],
      };

      for (const member of node.members) {
        const memberName = member.id.name;
        if (!member.initializer) {
          enumBody.push({
            type: 'AssignmentExpression',
            left: {
              type: 'MemberExpression',
              object: {
                type: 'Identifier',
                name: enumName,
              },
              computed: true,
              property: {
                type: 'AssignmentExpression',
                left: {
                  type: 'MemberExpression',
                  object: {
                    type: 'Identifier',
                    name: enumName,
                  },
                  computed: true,
                  property: {
                    type: 'Literal',
                    value: memberName,
                  },
                },
                operator: '=',
                right: {
                  type: 'Literal',
                  value: 0,
                },
              },
            },
            operator: '=',
            right: {
              type: 'Literal',
              value: memberName,
            },
          });
        }
      }

      return { replaceWith: [Declaration, EnumWrapper] };
    }
  };
}
