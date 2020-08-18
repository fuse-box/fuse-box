import { ISchema } from '../../core/nodeSchema';
import { htmlEntitiesToUnicode } from '../../helpers/entities';
import { ASTNode, ASTType } from '../../interfaces/AST';
import { ITransformer } from '../../interfaces/ITransformer';

//const Factories: { [key: string]: () => ASTNode } = {};

function createJSXFactory(props: { first: string; second?: string }): (args: Array<ASTNode>) => ASTNode {
  if (!props.second) {
    return (args: Array<ASTNode>): ASTNode => {
      return {
        arguments: args,
        callee: {
          name: props.first,
          type: 'Identifier',
        },
        type: 'CallExpression',
      };
    };
  }
  return (args: Array<ASTNode>): ASTNode => {
    return {
      arguments: args,
      callee: {
        computed: false,
        object: {
          name: props.first,
          type: 'Identifier',
        },
        property: {
          name: props.second,
          type: 'Identifier',
        },
        type: 'MemberExpression',
      },
      type: 'CallExpression',
    };
  };
}

function createObjectAssignExpression(): ASTNode {
  return {
    arguments: [],
    callee: {
      computed: false,
      object: {
        name: 'Object',
        type: 'Identifier',
      },
      property: {
        name: 'assign',
        type: 'Identifier',
      },
      type: 'MemberExpression',
    },
    type: 'CallExpression',
  };
}

export interface IJSXTranformerOptions {
  jsxFactory?: string;
}

function parseFactory(factory: string) {
  const [first, second] = factory.split('.');
  const JSXFragment: ASTNode = {
    computed: false,
    object: {
      name: first,
      type: 'Identifier',
    },
    property: {
      name: 'Fragment',
      type: 'Identifier',
    },
    type: 'MemberExpression',
  };

  const createElement = createJSXFactory({ first, second });
  return { JSXFragment, createElement };
}

function convertJSXMemberExpression(expression: ASTNode) {
  if (expression.type === ASTType.JSXMemberExpression) expression.type = 'MemberExpression';

  if (expression.type === ASTType.JSXIdentifier) expression.type = 'Identifier';

  if (expression.property && expression.property.type === ASTType.JSXIdentifier)
    expression.property.type = 'Identifier';

  if (expression.object) {
    if (expression.object.type === ASTType.JSXMemberExpression) {
      return convertJSXMemberExpression(expression.object);
    }
    if (expression.object.type === ASTType.JSXIdentifier) expression.object.type = 'Identifier';
  }
}

export function JSXTransformer(): ITransformer {
  return {
    commonVisitors: props => {
      const {
        transformationContext: {
          compilerOptions: { jsxFactory },
          module: { extension },
        },
      } = props;

      // we don't need this for normal TypeScript files
      if (extension === '.ts') return;

      // prepare for setting up the jsxFactory
      let initJsxFactory = false;
      let JSXFragment;
      let createElement;

      return {
        onEach: (schema: ISchema) => {
          const { context, node, replace } = schema;
          const name = node.name as string;

          // We only want to setup the jsxFacory once for this module
          if (!initJsxFactory) {
            const factory = context.jsxFactory;

            ({ JSXFragment, createElement } = parseFactory(factory || jsxFactory));
            initJsxFactory = true;
          }

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
                let { type, value } = attr; // call 'attr' once

                if (type === 'JSXAttribute') {
                  if (!value) {
                    value = { type: 'Literal', value: true };
                  }
                  let key: ASTNode;
                  if (attr.name.name.indexOf('-') > -1) {
                    key = { type: 'Literal', value: attr.name.name };
                  } else {
                    key = { name: attr.name.name, type: 'Identifier' };
                  }

                  const createdProp: ASTNode = {
                    computed: false,
                    key: key,
                    kind: 'init',
                    method: false,
                    shorthand: false,
                    type: 'Property',
                    value: value,
                  };

                  if (newObj) {
                    propObject = {
                      properties: [createdProp],
                      type: 'ObjectExpression',
                    };
                    newObj = false;
                  } else {
                    propObject.properties.push(createdProp);
                  }
                }

                if (type === 'JSXSpreadAttribute') {
                  spreaded = true;
                  if (propObject) {
                    propObjects.push(propObject);
                    // reset for attributes after spread operator
                    propObject = undefined;
                  } else {
                    propObjects.push({
                      properties: [],
                      type: 'ObjectExpression',
                    });
                  }
                  newObj = true;
                  propObjects.push(attr.argument);
                }
              }

              if (spreaded) {
                props = createObjectAssignExpression();
                if (propObject) {
                  propObjects.push(propObject);
                }

                props.arguments = propObjects;
              } else if (propObject) {
                props = propObject;
              } else props = { type: 'Literal', value: null };

              return replace(createElement([openingElement.name, props].concat(node.children)));

            case 'JSXExpressionContainer':
            case 'JSXSpreadChild':
              if (node.expression.type === 'JSXEmptyExpression') return schema.remove();
              return replace(node.expression);
            case 'JSXFragment':
              return replace(
                createElement([JSXFragment, { type: 'Literal', value: null } as ASTNode].concat(node.children)),
              );

            case 'JSXIdentifier':
              if (name[0] === name[0].toLowerCase()) {
                return replace({ type: 'Literal', value: name });
              }
              node.type = 'Identifier';
              return replace(node);
            case 'JSXMemberExpression':
              convertJSXMemberExpression(node);
              return replace(node);
            case 'JSXText':
              if (node.value.indexOf('\n') > -1 && !node.value.trim()) {
                return schema.remove();
              }
              const jsonString = JSON.stringify(node.value);
              return replace({ raw: htmlEntitiesToUnicode(jsonString), type: 'Literal', value: node.value });
          }
        },
      };
    },
  };
}
