import { IVisit } from '../../compiler/Visitor/Visitor';
import { ASTNode } from '../../compiler/interfaces/AST';
import { Module } from '../../core/Module';
import { IProductionContext } from '../ProductionContext';

export enum ImportType {
  SIDE_EFFECT_IMPORT,
  IMPORT_SPECIFIERS,
  DYNAMIC_IMPORT,
  EXPORT_FROM,
};

export enum ImportSpecifierType {
  OBJECT_SPECIFIER,
  NAMESPACE_SPECIFIER
}

export type IImportReferences = ReturnType<typeof ImportReferences>;
export type IImport = ReturnType<typeof Import>;
export type IImportSpecifier = ReturnType<typeof ImportSpecifier>;

export interface IImportReferencesProps {
  module: Module;
  productionContext: IProductionContext;
  visit: IVisit;
};

export interface IImportProps {
  module: Module;
  source: string;
  specifiers?: Array<IImportSpecifier>;
  type: ImportType;
  visit: IVisit;
};

function Import(props: IImportProps) {
  const target = props.module.moduleSourceRefs[props.source];
  const exported = {
    module: props.module,
    remove: function () {
      exported.removed = true;
      // @todo finish this
      if (props.visit.property && props.visit.parent) {
        if (props.visit.parent[props.visit.property] instanceof Array) {
          const index = props.visit.parent[props.visit.property].indexOf(props.visit.node);
          if (index > -1) {
            props.visit.parent[props.visit.property].splice(index, 1);
          }
        }
      }
    },
    removed: false,
    source: props.source,
    specifiers: props.specifiers,
    target,
    type: props.type,
    visit: props.visit
  };

  target.moduleTree.dependants.push(exported);

  return exported;
};

function ImportSpecifier(visit: IVisit, specifier: ASTNode) {
  let local: string;
  let name: string;
  let type: ImportSpecifierType = ImportSpecifierType.OBJECT_SPECIFIER;

  if (specifier.type === 'ImportNamespaceSpecifier') {
    // import * as React from 'react'
    local = specifier.local.name;
    type = ImportSpecifierType.NAMESPACE_SPECIFIER;
  } else if (specifier.type === 'ImportDefaultSpecifier') {
    // import styled from '@emotion/styled'
    local = specifier.local.name;
    name = 'default';
  } else if (
    specifier.type === 'ImportSpecifier'
  ) {
    // import { something } from 'some-module'
    local = specifier.local.name;
    name = specifier.imported.name;
  } else if (specifier.type === 'ExportSpecifier') {
    // export { something } from 'some-module'
    local = specifier.local.name;
    name = specifier.exported.name;
  }

  const exported = {
    local,
    name,
    remove: function () {
      exported.removed = true;
      // @todo finish this
      if (visit.node.specifiers instanceof Array) {
        const index = visit.node.specifiers.indexOf(specifier);
        if (index > -1) {
          visit.node.specifiers.splice(index, 1);
        }
      }
    },
    removed: false,
    type,
    visit
  };

  return exported;
};

// import './foo';
function sideEffectImport(props: IImportReferencesProps, scope: IImportReferences) {
  const { node } = props.visit;

  scope.references.push(
    Import({
      module: props.module,
      source: node.source.value,
      type: ImportType.SIDE_EFFECT_IMPORT,
      visit: props.visit
    })
  );
};

// import xx from 'xx';
// import { yy, bb as cc } from 'yy';
// import zz as aa from 'zz'
function regularImport(props: IImportReferencesProps, scope: IImportReferences) {
  let specifiers: Array<IImportSpecifier> = [];
  const { node } = props.visit;

  for (const specifier of node.specifiers) {
    specifiers.push(ImportSpecifier(props.visit, specifier));
  }

  scope.references.push(
    Import({
      module: props.module,
      source: node.source.value,
      specifiers,
      type: ImportType.IMPORT_SPECIFIERS,
      visit: props.visit
    })
  );
};

// const bar = require('foo');
function regularRequire(props: IImportReferencesProps, scope: IImportReferences) {
  const { node } = props.visit;

  scope.references.push(
    Import({
      module: props.module,
      source: node.arguments[0].value,
      type: ImportType.SIDE_EFFECT_IMPORT,
      visit: props.visit
    })
  );
};

// import _ = require('foo');
function sideEffectImportRequire(props: IImportReferencesProps, scope: IImportReferences) {
  const { node } = props.visit;

  scope.references.push(
    Import({
      module: props.module,
      source: node.moduleReference.expression.value,
      type: ImportType.SIDE_EFFECT_IMPORT,
      visit: props.visit
    })
  );
}

// import('./module');
function dynamicImport(props: IImportReferencesProps, scope: IImportReferences) {
  const { node } = props.visit;

  scope.references.push(
    Import({
      module: props.module,
      source: node.source.value,
      type: ImportType.DYNAMIC_IMPORT,
      visit: props.visit
    })
  );
}

// export * from 'module';
function exportAllImport(props: IImportReferencesProps, scope: IImportReferences) {
  const { node } = props.visit;

  scope.references.push(
    Import({
      module: props.module,
      source: node.source.value,
      type: ImportType.EXPORT_FROM,
      visit: props.visit
    })
  );
}

// export { foo, bar as baz } from 'module';
function exportSpecifierImport(props: IImportReferencesProps, scope: IImportReferences) {
  let specifiers: Array<IImportSpecifier> = [];
  const { node } = props.visit;

  for (const specifier of node.specifiers) {
    specifiers.push(ImportSpecifier(props.visit, specifier));
  }

  scope.references.push(
    Import({
      module: props.module,
      source: node.source.value,
      specifiers,
      type: ImportType.EXPORT_FROM,
      visit: props.visit
    })
  );
}

export function ImportReferences(productionContext: IProductionContext, module: Module) {
  const references: Array<IImport> = [];

  const scope = {
    references,
    register: (props: IImportReferencesProps) => {
      const { node } = props.visit;
      if (node.type === 'ImportDeclaration') {
        if (node.specifiers.length === 0) {
          // import './foo';
          sideEffectImport(props, scope);
        } else {
          // import xx from 'xx';
          // import { yy, bb as cc } from 'yy';
          // import zz as aa from 'zz'
          regularImport(props, scope)
        }
      } else if (
        node.type === 'CallExpression' &&
        node.callee.name === 'require'
      ) {
        // const bar = require('foo');
        regularRequire(props, scope);
      } else if (node.type === 'ImportEqualsDeclaration') {
        // import _ = require('foo');
        sideEffectImportRequire(props, scope);
      } else if (node.type === 'ImportExpression') {
        // import('./module');
        dynamicImport(props, scope);
      } else if (node.type === 'ExportAllDeclaration') {
        // export * from 'module';
        exportAllImport(props, scope);
      } else if (node.type === 'ExportNamedDeclaration') {
        // export { foo, bar as baz } from 'module';
        exportSpecifierImport(props, scope);
      }
    }
  };

  return scope;
}
