import { ASTNode } from '../../interfaces/AST';
import { ITransformer } from '../../program/transpileModule';
import { IVisit } from '../../Visitor/Visitor';
import { GlobalContext } from '../../program/GlobalContext';

//const Factories: { [key: string]: () => ASTNode } = {};

function createJSXFactory(props: { first: string; second?: string }): (args: Array<ASTNode>) => ASTNode {
  if (!props.second) {
    return (args: Array<ASTNode>): ASTNode => {
      return {
        type: 'CallExpression',
        callee: {
          type: 'Identifier',
          name: props.first,
        },
        arguments: args,
      };
    };
  }
  return (args: Array<ASTNode>): ASTNode => {
    return {
      type: 'CallExpression',
      callee: {
        type: 'MemberExpression',
        object: {
          type: 'Identifier',
          name: props.first,
        },
        computed: false,
        property: {
          type: 'Identifier',
          name: props.second,
        },
      },
      arguments: args,
    };
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

export interface IJSXTranformerOptions {
  jsxFactory?: string;
}

function parseFactory(factory: string) {
  const [first, second] = factory.split('.');
  const JSXFragment: ASTNode = {
    type: 'MemberExpression',
    object: {
      type: 'Identifier',
      name: first,
    },
    computed: false,
    property: {
      type: 'Identifier',
      name: 'Fragment',
    },
  };

  const createElement = createJSXFactory({ first, second });
  return { JSXFragment, createElement };
}

const FACTORIES = {};
export function JSXTransformer(opts?: IJSXTranformerOptions): ITransformer {
  if (!opts) opts = {};
  if (!opts.jsxFactory) opts.jsxFactory = 'React.createElement';

  return (visit: IVisit) => {
    const node = visit.node;
    const name = node.name as string;
    const globalContext = visit.globalContext as GlobalContext;

    const factory = globalContext.jsxFactory || opts.jsxFactory;
    if (!FACTORIES[factory]) FACTORIES[factory] = parseFactory(factory);

    const { JSXFragment, createElement } = FACTORIES[factory];

    switch (node.type) {
      case 'JSXMemberExpression':
        node.type = 'MemberExpression';
        // it's important to replace it, since it will be re-visited and picked up by other transformers
        // for example Import transformer
        return { replaceWith: node };
      case 'JSXIdentifier':
        if (name[0] === name[0].toLowerCase()) {
          return { replaceWith: { type: 'Literal', value: name } };
        }
        node.type = 'Identifier';
        return { replaceWith: node };
      case 'JSXFragment':
        return {
          replaceWith: createElement([JSXFragment, { type: 'Literal', value: null } as ASTNode].concat(node.children)),
        };
      case 'JSXElement':
        let props: ASTNode;
        let propObjects: Array<ASTNode> = [];
        let propObject: ASTNode;
        let newObj = true;

        let spreaded = false;
        const { openingElement } = node;

        for (const attr of openingElement.attributes) {
          // less member access
          let { type, value } = attr; // call 'attr' once

          if (type === 'JSXAttribute') {
            if (!value) {
              value = { type: 'Literal', value: true };
            }
            let key: ASTNode;
            if (attr.name.name.indexOf('-') > -1) {
              key = { type: 'Literal', value: attr.name.name };
            } else {
              key = { type: 'Identifier', name: attr.name.name };
            }

            const createdProp: ASTNode = {
              type: 'Property',
              key: key,
              value: value,
              kind: 'init',
              computed: false,
              method: false,
              shorthand: false,
            };

            if (newObj) {
              propObject = {
                type: 'ObjectExpression',
                properties: [createdProp],
              };
              newObj = false;
            } else {
              propObject.properties.push(createdProp);
            }
          }

          if (type === 'JSXSpreadAttribute') {
            spreaded = true;
            if (propObject) propObjects.push(propObject);
            else
              propObjects.push({
                type: 'ObjectExpression',
                properties: [],
              });
            newObj = true;
            propObjects.push(attr.argument);
          }
        }

        if (spreaded) {
          props = createObjectAssignExpression();

          props.arguments = propObjects;
        } else if (propObject) {
          props = propObject;
        } else props = { type: 'Literal', value: null };

        return {
          replaceWith: createElement([openingElement.name, props].concat(node.children)),
        };
      case 'JSXSpreadChild':
      case 'JSXExpressionContainer':
        if (node.expression.type === 'JSXEmptyExpression') return { removeNode: true };
        return { replaceWith: node.expression };
      case 'JSXText':
        if (node.value.indexOf('\n') > -1 && !node.value.trim()) {
          return { removeNode: true };
        }
        return {
          replaceWith: { type: 'Literal', value: node.value },
        };
    }
  };
}
