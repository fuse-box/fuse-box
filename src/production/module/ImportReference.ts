import { IVisit } from '../../compiler/Visitor/Visitor';
import { ASTNode } from '../../compiler/interfaces/AST';
import { Module } from '../../core/Module';
import { IProductionContext } from '../ProductionContext';

export type IImportReferences = ReturnType<typeof ImportReferences>;

export enum ImportReferenceType {
  SIDE_EFFECT_IMPORT,
  IMPORT_SPECIFIERS,
  DYNAMIC_IMPORT,
  EXPORT_FROM,
};

export enum ImportSpecifierReferenceType {
  OBJECT_SPECIFIER,
  NAMESPACE_SPECIFIER
}

export interface ImportReferencesProps {
  module: Module;
  productionContext: IProductionContext;
  visit: IVisit;
};

export interface ImportReferenceProps {
  module: Module;
  source: string;
  specifiers?: Array<ASTNode>;
  type: ImportSpecifierReferenceType;
  visit: IVisit;
};

export interface ImportSpecifierReferenceProps {
  local: string;
  name: string;
  specifier: ASTNode;
  type: ImportSpecifierReferenceType;
  visit: IVisit;
};

export function ImportReference(props: ImportReferenceProps) {
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
    target: props.module.moduleSourceRefs[props.source],
    type: props.type,
    visit: props.visit
  };

  return exported;
};

export function ImportSpecifierReference(props: ImportSpecifierReferenceProps) {
  const exported = {
    local: props.local,
    name: props.name,
    remove: function () {
      exported.removed = true;
      // @todo finish this
      if (props.visit.node.specifiers instanceof Array) {
        const index = props.visit.node.specifiers.indexOf(props.specifier);
        if (index > -1) {
          props.visit.node.specifiers.splice(index, 1);
        }
      }
    },
    removed: false,
    specifier: props.specifier,
    type: props.type,
    visit: props.visit
  };

  return exported;
}

function ImportSpecifier(visit: IVisit, specifier: ASTNode): ImportSpecifierReference {
  let local: string;
  let name: string;
  let type: string = ImportSpecifierReferenceType.OBJECT_SPECIFIER;

  if (specifier.type === 'ImportNamespaceSpecifier') {
    // import * as React from 'react'
    local = specifier.local.name;
    type = ImportSpecifierReferenceType.NAMESPACE_SPECIFIER;
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

  return ImportSpecifierReference({
    local,
    name,
    specifier,
    type,
    visit
  });
};


// import './foo';
function sideEffectImport(props: ImportReferencesProps, scope: IImportReferences) {
  const { node } = props.visit;

  scope.references.push(
    ImportReference({
      module: props.module,
      source: node.source.value,
      type: ImportReferenceType.SIDE_EFFECT_IMPORT,
      visit: props.visit
    })
  );
};

// import xx from 'xx';
// import { yy, bb as cc } from 'yy';
// import zz as aa from 'zz'
function regularImport(props: ImportReferencesProps, scope: IImportReferences) {
  let specifiers: Array<ASTNode> = [];
  const { node } = props.visit;

  for (const specifier of node.specifiers) {
    specifiers.push(ImportSpecifier(props.visit, specifier));
  }

  scope.references.push(
    ImportReference({
      module: props.module,
      source: node.source.value,
      specifiers,
      type: ImportReferenceType.IMPORT_SPECIFIERS,
      visit: props.visit
    })
  );
};

// const bar = require('foo');
function regularRequire(props: ImportReferencesProps, scope: IImportReferences) {
  const { node } = props.visit;

  scope.references.push(
    ImportReference({
      module: props.module,
      source: node.arguments[0].value,
      type: ImportReferenceType.SIDE_EFFECT_IMPORT,
      visit: props.visit
    })
  );
};

// import _ = require('foo');
function sideEffectImportRequire(props: ImportReferencesProps, scope: IImportReferences) {
  const { node } = props.visit;

  scope.references.push(
    ImportReference({
      module: props.module,
      source: node.moduleReference.expression.value,
      type: ImportReferenceType.SIDE_EFFECT_IMPORT,
      visit: props.visit
    })
  );
}

// import('./module');
function dynamicImport(props: ImportReferencesProps, scope: IImportReferences) {
  const { node } = props.visit;

  scope.references.push(
    ImportReference({
      module: props.module,
      source: node.source.value,
      type: ImportReferenceType.DYNAMIC_IMPORT,
      visit: props.visit
    })
  );
}

// export * from 'module';
function exportAllImport(props: ImportReferenceProps, scope: IImportReferences) {
  const { node } = props.visit;

  scope.references.push(
    ImportReference({
      module: props.module,
      source: node.source.value,
      type: ImportReferenceType.EXPORT_FROM,
      visit: props.visit
    })
  );
}

// export { foo, bar as baz } from 'module';
function exportSpecifierImport(props: ImportReferenceProps, scope: IImportReferences) {
  let specifiers: Array<ASTNode> = [];
  const { node } = props.visit;

  for (const specifier of node.specifiers) {
    specifiers.push(ImportSpecifier(props.visit, specifier));
  }

  scope.references.push(
    ImportReference({
      module: props.module,
      source: node.source.value,
      specifiers,
      type: ImportReferenceType.EXPORT_FROM,
      visit: props.visit
    })
  );
}

export function ImportReferences(productionContext: IProductionContext, module: Module) {
  const references: Array<IImportReference> = [];

  /**
   * We need to traverse to find the dependant modules of this module
   */
  const dependants = [];
  for (const dependantModule of productionContext.modules) {
    if (
      dependantModule !== module &&
      dependantModule.moduleTree &&
      dependantModule.moduleTree.importReferences.references.length > 0
    ) {
      const { references } = dependantModule.moduleTree.importReferences;
      for (const referencedModule of references) {
        if (referencedModule.target === module) {
          dependants.push({
            type: referencedModule.type,
            module: referencedModule.module
          });
          break;
        }
      }
    }
  }

  const scope = {
    dependants,
    references,
    register: (props: ImportReferencesProps) => {
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
