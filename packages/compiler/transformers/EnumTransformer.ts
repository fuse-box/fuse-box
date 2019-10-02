import { IVisit, IVisitorMod } from '../Visitor/Visitor';
import { ASTNode } from '../interfaces/AST';
import { computeBinaryExpression } from '../static_compute/computeBinaryExpression';

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
      let index = 0;
      const computedValues = {};
      const members = {};
      for (const member of node.members) {
        const memberName = member.id.name;
        members[memberName] = 1;
        let rightValue;
        if (member.initializer) {
          const computed = computeBinaryExpression(member.initializer, computedValues);
          if (!computed.value) {
            // if we couldn't compute a value for the property
            // we still need to check if it has references to our enum
            // an convert it to a member expression
            for (const key in computed.collected) {
              if (members[key]) {
                const n = computed.collected[key];
                // since we don't know the parent (speed wise)
                // we replace the object directly
                n.type = 'MemberExpression';
                n.object = {
                  type: 'Identifier',
                  name: enumName,
                };
                n.property = {
                  type: 'Identifier',
                  name: key,
                };
              }
            }
            rightValue = member.initializer;
          } else {
            // value has been computed correctlu
            // we can replace it with just a value now
            computedValues[memberName] = computed.value;
            rightValue = { type: 'Literal', value: computed.value };
          }
        } else rightValue = { type: 'Literal', value: index++ };

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
              right: rightValue,
            },
          },
          operator: '=',
          right: {
            type: 'Literal',
            value: memberName,
          },
        });
      }

      return { replaceWith: [Declaration, EnumWrapper] };
    }
  };
}
