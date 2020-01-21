import { IVisit } from '../../compiler/Visitor/Visitor';
import { getDynamicImport } from '../../compiler/helpers/importHelpers';
import { ASTNode } from '../../compiler/interfaces/AST';
import { ASTType } from '../../compiler/interfaces/AST';
import { IModule } from '../../module-resolver/Module';
import { IProductionContext } from '../ProductionContext';

export enum ImportType {
  SIDE_EFFECT_IMPORT,
  IMPORT_SPECIFIERS,
  DYNAMIC_IMPORT,
  EXPORT_FROM,
}

export enum ImportSpecifierType {
  OBJECT_SPECIFIER,
  NAMESPACE_SPECIFIER,
}

export interface IImportReferencesProps {
  module: IModule;
  productionContext: IProductionContext;
  visit: IVisit;
}

export interface IImportProps {
  module: IModule;
  source: string;
  specifiers?: Array<IImportSpecifier>;
  type: ImportType;
  visit: IVisit;
}

export interface IImport {
  module: IModule;
  removed: boolean;
  source: string;
  specifiers: Array<IImportSpecifier>;
  target: IModule;
  type: ImportType;
  visit: IVisit;
  remove: () => void;
}

function Import(props: IImportProps): IImport {
  const target = props.module.moduleSourceRefs[props.source];
  const importReference = {
    module: props.module,
    remove: function() {
      importReference.removed = true;
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
    visit: props.visit,
  };

  target.moduleTree.dependants.push(importReference);

  return importReference;
}

export interface IImportSpecifier {
  local: string;
  name: string;
  removed: boolean;
  type: ImportSpecifierType;
  visit: IVisit;
  remove: () => void;
}

function ImportSpecifier(visit: IVisit, specifier: ASTNode): IImportSpecifier {
  let local: string;
  let name: string;
  let type: ImportSpecifierType = ImportSpecifierType.OBJECT_SPECIFIER;

  if (specifier.type === ASTType.ImportNamespaceSpecifier) {
    // import * as React from 'react'
    local = specifier.local.name;
    type = ImportSpecifierType.NAMESPACE_SPECIFIER;
  } else if (specifier.type === ASTType.ImportDefaultSpecifier) {
    // import styled from '@emotion/styled'
    local = specifier.local.name;
    name = 'default';
  } else if (specifier.type === ASTType.ImportSpecifier) {
    // import { something } from 'some-module'
    local = specifier.local.name;
    name = specifier.imported.name;
  } else if (specifier.type === ASTType.ExportSpecifier) {
    // export { something } from 'some-module'
    local = specifier.local.name;
    name = specifier.exported.name;
  }

  const importSpecifier = {
    local,
    name,
    remove: function() {
      importSpecifier.removed = true;
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
    visit,
  };

  return importSpecifier;
}

// import './foo';
function sideEffectImport(props: IImportReferencesProps, scope: IImportReferences) {
  const { node } = props.visit;

  scope.references.push(
    Import({
      module: props.module,
      source: node.source.value,
      type: ImportType.SIDE_EFFECT_IMPORT,
      visit: props.visit,
    }),
  );
}

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
      visit: props.visit,
    }),
  );
}

// const bar = require('foo');
function regularRequire(props: IImportReferencesProps, scope: IImportReferences) {
  const { node } = props.visit;

  scope.references.push(
    Import({
      module: props.module,
      source: node.arguments[0].value,
      type: ImportType.SIDE_EFFECT_IMPORT,
      visit: props.visit,
    }),
  );
}

// import _ = require('foo');
function sideEffectImportRequire(props: IImportReferencesProps, scope: IImportReferences) {
  const { node } = props.visit;

  scope.references.push(
    Import({
      module: props.module,
      source: node.moduleReference.expression.value,
      type: ImportType.SIDE_EFFECT_IMPORT,
      visit: props.visit,
    }),
  );
}

// import('./module');
function dynamicImport(props: IImportReferencesProps, scope: IImportReferences) {
  const { node } = props.visit;
  const { source } = getDynamicImport(node);

  scope.references.push(
    Import({
      module: props.module,
      source,
      type: ImportType.DYNAMIC_IMPORT,
      visit: props.visit,
    }),
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
      visit: props.visit,
    }),
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
      visit: props.visit,
    }),
  );
}

export interface IImportReferences {
  references: Array<IImport>;
  register: (props: IImportReferencesProps) => void;
}

export function ImportReferences(productionContext: IProductionContext, module: Module): IImportReferences {
  const scope = {
    references: [],
    register: (props: IImportReferencesProps) => {
      const { node } = props.visit;
      if (node.type === ASTType.ImportDeclaration) {
        if (node.specifiers.length === 0) {
          // import './foo';
          sideEffectImport(props, scope);
        } else {
          // import xx from 'xx';
          // import { yy, bb as cc } from 'yy';
          // import zz as aa from 'zz'
          regularImport(props, scope);
        }
      } else if (node.type === ASTType.CallExpression && node.callee && node.callee.name === 'require') {
        // const bar = require('foo');
        regularRequire(props, scope);
      } else if (node.type === ASTType.ImportEqualsDeclaration) {
        // import _ = require('foo');
        sideEffectImportRequire(props, scope);
      } else if (
        // meriyah
        node.type === ASTType.ImportExpression ||
        // ts-parser
        (node.type === ASTType.CallExpression && node.callee && node.callee.type === 'Import')
      ) {
        // import('./module');
        dynamicImport(props, scope);
      } else if (node.type === ASTType.ExportAllDeclaration) {
        // export * from 'module';
        exportAllImport(props, scope);
      } else if (node.type === ASTType.ExportNamedDeclaration) {
        // export { foo, bar as baz } from 'module';
        exportSpecifierImport(props, scope);
      }
    },
  };

  return scope;
}
