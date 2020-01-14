import { ASTNode } from '../../../interfaces/AST';
import { convertTypeAnnotation, voidZero } from './Annotations';
import { getParamTypes, metatadataAST } from './Metadata';

export const __DECORATE__ = {
  type: 'MemberExpression',
  object: {
    type: 'Identifier',
    name: '__fuse_decorate',
  },
  computed: false,
  property: {
    type: 'Identifier',
    name: 'd',
  },
};

export const FUSEBOX_DECORATOR_META: ASTNode = {
  type: 'MemberExpression',
  object: {
    type: 'Identifier',
    name: '__fuse_decorate',
  },
  computed: false,
  property: {
    type: 'Identifier',
    name: 'm',
  },
};
export function createPropertyDecorator(props: {
  helperModule: string;
  className: ASTNode;
  propertyName: string;
  decorators: Array<ASTNode>;
}): ASTNode {
  return {
    type: 'ExpressionStatement',
    expression: {
      type: 'CallExpression',
      callee: {
        type: 'MemberExpression',
        object: {
          type: 'Identifier',
          name: props.helperModule,
        },
        computed: false,
        property: {
          type: 'Identifier',
          name: 'd',
        },
      },
      arguments: [
        {
          type: 'ArrayExpression',
          elements: props.decorators,
          optional: false,
        },
        {
          type: 'MemberExpression',
          object: {
            type: 'Identifier',
            name: props.className,
          },
          computed: false,
          property: {
            type: 'Identifier',
            name: 'prototype',
          },
        },
        {
          type: 'Literal',
          value: props.propertyName,
        },
        voidZero,
      ],
    },
  };
}

export function createDecoratorRequireHelperStatement(moduleName: string, params: Array<string>) {
  const properties = [];
  for (const name of params) {
    properties.push({
      type: 'Property',
      key: {
        type: 'Identifier',
        name: name,
      },
      value: {
        type: 'Identifier',
        name: name,
      },
      kind: 'init',
      computed: false,
      method: false,
      shorthand: true,
    });
  }
  return {
    type: 'VariableDeclaration',
    kind: 'const',
    declare: false,
    declarations: [
      {
        type: 'VariableDeclarator',
        init: {
          type: 'CallExpression',
          callee: {
            type: 'Identifier',
            name: 'require',
          },
          arguments: [
            {
              type: 'Literal',
              value: './hey',
            },
          ],
        },
        id: {
          type: 'ObjectPattern',
          properties: properties,
        },
      },
    ],
  };
}

export interface IClassDecorator {
  expressionStatement: ASTNode;
  arrayExpression: ASTNode;
}

export function createClassDecorators(props: {
  className: string;
  helperModule: string;
  decorators: Array<ASTNode>;
}): IClassDecorator {
  const arrayExpression: ASTNode = {
    type: 'ArrayExpression',
    elements: props.decorators,
  };
  const expressionStatement: ASTNode = {
    type: 'ExpressionStatement',
    expression: {
      type: 'AssignmentExpression',
      left: {
        type: 'Identifier',
        name: props.className,
      },
      operator: '=',
      right: {
        type: 'CallExpression',
        callee: {
          type: 'MemberExpression',
          object: {
            type: 'Identifier',
            name: props.helperModule,
          },
          computed: false,
          property: {
            type: 'Identifier',
            name: 'd',
          },
        },
        arguments: [
          arrayExpression,
          {
            type: 'Identifier',
            name: props.className,
          },
        ],
      },
    },
  };
  return { expressionStatement, arrayExpression };
}

export function createMethodMetadata(props: {
  node?: ASTNode;
}): { designType: ASTNode; returnType: ASTNode; paramTypes: ASTNode } {
  const node = props.node;
  const designType = metatadataAST('design:type', {
    type: 'Identifier',
    name: 'Function',
  });
  let returnTypeAnnotation;

  if (!node.value.returnType) {
    returnTypeAnnotation = voidZero;
  } else {
    returnTypeAnnotation = convertTypeAnnotation(node.value.returnType);
  }

  const returnType = metatadataAST('design:returntype', returnTypeAnnotation);

  const paramTypes = getParamTypes(node.value);

  return { designType, returnType, paramTypes };
}
export function createMethodDecorator(props: {
  helperModule: string;
  className: ASTNode;
  isStatic?: boolean;
  methodName: string;
  decorators: Array<ASTNode>;
}): ASTNode {
  let id: ASTNode;
  if (props.isStatic) {
    id = {
      type: 'Identifier',
      name: props.className,
    };
  } else {
    id = {
      type: 'MemberExpression',
      object: {
        type: 'Identifier',
        name: props.className,
      },
      computed: false,
      property: {
        type: 'Identifier',
        name: 'prototype',
      },
    };
  }
  return {
    type: 'ExpressionStatement',
    expression: {
      type: 'CallExpression',
      callee: {
        type: 'MemberExpression',
        object: {
          type: 'Identifier',
          name: props.helperModule,
        },
        computed: false,
        property: {
          type: 'Identifier',
          name: 'd',
        },
      },
      arguments: [
        {
          type: 'ArrayExpression',
          elements: props.decorators,
          optional: false,
        },
        id,
        {
          type: 'Literal',
          value: props.methodName,
        },
        {
          type: 'Identifier',
          name: 'null',
        },
      ],
    },
  };
}

export function collectDecorators(opts: {
  helperModule: string;
  expressions: Array<ASTNode>;
  params: Array<ASTNode>;
}): Array<ASTNode> {
  const params = opts.params;
  if (params && params.length) {
    let index = 0;
    while (index < params.length) {
      let p = params[index];
      if (p.decorators && p.decorators.length) {
        for (const dec of p.decorators) {
          opts.expressions.push(
            createMethodArgumentParam({
              helperModule: opts.helperModule,
              decorator: dec.expression,
              index: index,
            }),
          );
        }
      }
      index++;
    }
  }
  return opts.expressions;
}

export function createMethodArgumentParam(props: {
  index?: number;
  decorator: ASTNode;
  helperModule: string;
}): ASTNode {
  return {
    type: 'CallExpression',
    callee: {
      type: 'MemberExpression',
      object: {
        type: 'Identifier',
        name: props.helperModule,
      },
      computed: false,
      property: {
        type: 'Identifier',
        name: 'p',
      },
    },
    arguments: [
      {
        type: 'Literal',
        value: props.index,
      },
      props.decorator,
    ],
  };
}

export function createMethodPropertyDecorator(props: {
  index?: number;
  helperModule: string;
  className: ASTNode;
  isStatic: boolean;
  methodName: string;
  elements: Array<ASTNode>;
}): ASTNode {
  let id: ASTNode;
  if (props.isStatic) {
    id = {
      type: 'Identifier',
      name: props.className,
    };
  } else {
    id = {
      type: 'MemberExpression',
      object: {
        type: 'Identifier',
        name: props.className,
      },
      computed: false,
      property: {
        type: 'Identifier',
        name: 'prototype',
      },
    };
  }
  return {
    type: 'ExpressionStatement',
    expression: {
      type: 'CallExpression',
      callee: {
        type: 'MemberExpression',
        object: {
          type: 'Identifier',
          name: props.helperModule,
        },
        computed: false,
        property: {
          type: 'Identifier',
          name: 'd',
        },
      },
      arguments: [
        {
          type: 'ArrayExpression',
          elements: props.elements,
          typeAnnotation: [],
          optional: false,
        },
        id,
        {
          type: 'Literal',
          value: props.methodName,
        },
        {
          type: 'Literal',
          value: null,
        },
      ],
    },
  };
}
