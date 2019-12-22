import { ProductionContext } from '../../____production/ProductionContext';
import { IVisit, IVisitorMod } from '../../compiler/Visitor/Visitor';
import { ASTNode } from '../../compiler/interfaces/AST';
import { ITransformer } from '../../compiler/interfaces/ITransformer';
import { Module } from '../../core/Module';

export enum ModuleRefType {
  SIDE_EFFECT_IMPORT,
  IMPORT_SPECIFIERS,
  DYNAMIC_IMPORT,
  EXPORT,
};

function ImportSpecifier(visit: IVisit, specifier: ASTNode): ASTNode {
  let local: string;
  let name: string;

  if (specifier.type === 'ImportNamespaceSpecifier') {
    // import * as React from 'react'
    local = specifier.local.name;
    name = 'default';
  } else if (specifier.type === 'ImportDefaultSpecifier') {
    // import styled from '@emotion/styled'
    local = specifier.local.name;
    name = 'default';
  } else if (specifier.type === 'ImportSpecifier') {
    // import { something } from 'some-module'
    local = specifier.local.name;
    name = specifier.imported.name;
  }

  return {
    local,
    name,
    remove: function () {
      if (visit.node.specifiers instanceof Array) {
        const index = visit.node.specifiers.indexOf(specifier);
        if (index > -1) {
          visit.node.specifiers.splice(index, 1);
        }
      }
    }
  };
};

function ImportReference(props: {
  module: Module,
  productionContext: ProductionContext,
  visit: IVisit
}) {
  let type: ModuleRefType;
  let specifiers: Array<ASTNode> = [];
  let source: ASTNode;

  const node = props.visit.node;

  if (node.type === 'ImportDeclaration') {
    // set the source
    source = node.source;
    if (node.specifiers.length === 0) {
      // import './foo';
      type = ModuleRefType.SIDE_EFFECT_IMPORT;
    } else {
      // import xx from 'xx';
      // import { yy, bb as cc } from 'yy';
      // import zz as aa from 'zz'
      for (const specifier of node.specifiers) {
        specifiers.push(ImportSpecifier(props.visit, specifier));
      }
      type = ModuleRefType.IMPORT_SPECIFIERS;
    }

  } else if (
    node.type === 'CallExpression' &&
    node.callee.name === 'require'
  ) {
    // const bar = require('foo');
    type = {
      type: 'Literal',
      value: ModuleRefType.SIDE_EFFECT_IMPORT
    };
    source = node.arguments[0].value;

  } else if (node.type === 'ImportEqualsDeclaration') {
    // import _ = require('foo');
    type = ModuleRefType.SIDE_EFFECT_IMPORT;
    source = {
      type: 'Literal',
      value: node.moduleReference.expression.value
    };
  }

  if (ModuleRefType[type]) {
    return {
      remove: function () {
        if (props.visit.property && props.visit.parent) {
          if (props.visit.parent[props.visit.property] instanceof Array) {
            const index = props.visit.parent[props.visit.property].indexOf(node);
            if (index > -1) {
              props.visit.parent[props.visit.property].splice(index, 1);
            }
          }
        }
      },
      source,
      specifiers,
      type
    };
  }
  return;
}

export function Phase_1_ImportLink(): ITransformer {
  return {
    productionWarmupPhase: ({ ctx, module, productionContext }) => {
      const tree = module.moduleTree;
      const refs = module.moduleSourceRefs;
      return {
        onEachNode: (visit: IVisit): IVisitorMod => {
          return;
        },
        onTopLevelTraverse: (visit: IVisit) => {
          const importReference = ImportReference({ module, productionContext, visit });
          // console.log(importReference);
          return;
        },
      };
    },
  };
}
