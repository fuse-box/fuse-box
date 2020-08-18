import { ASTNode, ASTType } from '../../../interfaces/AST';
import { convertTypeAnnotation } from './Annotations';
import { FUSEBOX_DECORATOR_META } from './decorator_helpers';

// constructors have:
// ONLY: design:paramtypes

// methods:

// design:type  Function
// design:paramtypes and Array OR params [  ]
// design:returntype

export function metatadataAST(type: string, arg): ASTNode {
  return {
    type: 'CallExpression',
    callee: {
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
    },
    arguments: [
      {
        type: 'Literal',
        value: type,
      },
      arg,
    ],
  };
}

export function getPropertyMetadata(annotation: ASTNode): ASTNode {
  return {
    type: 'CallExpression',
    callee: FUSEBOX_DECORATOR_META,
    arguments: [
      {
        type: 'Literal',
        value: 'design:type',
      },
      convertTypeAnnotation(annotation),
    ],
  };
}

export function getMethodPropertiesMetadata(node: ASTNode) {
  const expressions = [];
  for (const item of node.value.params) {
    expressions.push(convertTypeAnnotation(item.typeAnnotation));
  }
  return expressions;
}

export function getParamTypes(node: ASTNode): ASTNode {
  const arrayExpression = {
    type: 'ArrayExpression',
    elements: [],
  };
  for (const p of node.params) {
    let target: ASTNode = p;
    if (p.type === ASTType.ParameterProperty) {
      target = target.parameter;
    }
    arrayExpression.elements.push(convertTypeAnnotation(target.typeAnnotation));
  }
  return metatadataAST('design:paramtypes', arrayExpression);
}
