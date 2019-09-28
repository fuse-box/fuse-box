import { ASTNode } from '../interfaces/AST';
import { ITransformer } from '../program/transpileModule';
import { createLiteral } from '../Visitor/helpers';
import { IVisit } from '../Visitor/Visitor';

//const Factories: { [key: string]: () => ASTNode } = {};

function createJSXFactory(
  jsxFactory: string,

  args: Array<ASTNode>,
): ASTNode {
  return {
    type: 'CallExpression',
    callee: {
      type: 'MemberExpression',
      object: {
        type: 'Identifier',
        name: 'React',
      },
      computed: false,
      property: {
        type: 'Identifier',
        name: 'createElement',
      },
    },
    arguments: args,
  };
}

function createObjectAssignExpression(): ASTNode {
  return {
    type: 'CallExpression',
    callee: {
      type: 'MemberExpression',
      object: {
        type: 'Identifier',
        name: 'Object',
      },
      computed: false,
      property: {
        type: 'Identifier',
        name: 'assign',
      },
    },
    arguments: [],
  };
}

function createProperty(key: string, value: ASTNode): ASTNode {
  return {
    type: 'Property',
    key: {
      type: 'Identifier',
      name: key,
    },
    value: value,
    kind: 'init',
    computed: false,
    method: false,
    shorthand: false,
  };
}

export interface IJSXTranformerOptions {
  use;
}
export function JSXTransformer(opts?: IJSXTranformerOptions): ITransformer {
  return (visit: IVisit) => {
    const node = visit.node;

    switch (node.type) {
      case 'JSXElement':
        let props: ASTNode;
        let propObjects: Array<ASTNode> = [];
        let propObject: ASTNode;
        let newObj = true;

        let spreaded = false;
        const { openingElement } = node;

        for (const attr of openingElement.attributes) {
          // less member access
          const { type, name, value } = attr; // call 'attr' once
          if (type === 'JSXAttribute') {
            const createdProp = createProperty(name.name, value);
            if (newObj) {
              propObject = {
                type: 'ObjectExpression',
                properties: [createdProp],
              };
            } else {
              newObj = false;
              propObject.properties.push(createdProp);
            }
          }

          if (type === 'JSXSpreadAttribute') {
            spreaded = true;
            propObjects.push(propObject);
            newObj = true;
            propObjects.push(attr.argument);
          }
        }

        if (spreaded) {
          props = createObjectAssignExpression();
          props.arguments = propObjects;
        } else if (propObject) {
          props = propObject;
        } else props = createLiteral(null);

        return {
          replaceWith: createJSXFactory(
            'React.createElement',
            [createLiteral(node.openingElement.name.name), props].concat(node.children),
          ),
        };
      case 'JSXExpressionContainer':
        return { replaceWith: node.expression };
      case 'JSXText':
        return {
          replaceWith: createLiteral(node.value),
        };
    }
  };
}
