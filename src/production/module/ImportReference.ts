import { ISchema } from '../../compiler/core/nodeSchema';
import { getDynamicImport } from '../../compiler/helpers/importHelpers';
import { ASTNode, ASTType } from '../../compiler/interfaces/AST';
import { IModule } from '../../moduleResolver/module';
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
  schema: ISchema;
}

export interface IImportProps {
  module: IModule;
  schema: ISchema;
  source: string;
  specifiers?: Array<IImportSpecifier>;
  type: ImportType;
}

export interface IImport {
  module: IModule;
  removed: boolean;
  schema: ISchema;
  source: string;
  specifiers: Array<IImportSpecifier>;
  target: IModule;
  type: ImportType;
  remove: () => void;
}

function Import(props: IImportProps): IImport {
  const target = props.module.moduleSourceRefs[props.source];
  const importReference = {
    module: props.module,
    remove: function() {
      importReference.removed = true;
      // @todo finish this
      if (props.schema.property && props.schema.parent) {
        if (props.schema.parent[props.schema.property] instanceof Array) {
          const index = props.schema.parent[props.schema.property].indexOf(props.schema.node);
          if (index > -1) {
            props.schema.parent[props.schema.property].splice(index, 1);
          }
        }
      }
    },
    removed: false,
    schema: props.schema,
    source: props.source,
    specifiers: props.specifiers,
    target,
    type: props.type,
  };

  target.moduleTree.dependants.push(importReference);

  return importReference;
}

export interface IImportSpecifier {
  local: string;
  name: string;
  removed: boolean;
  schema: ISchema;
  type: ImportSpecifierType;
  remove: () => void;
}

function ImportSpecifier(schema: ISchema, specifier: ASTNode): IImportSpecifier {
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
      if (schema.node.specifiers instanceof Array) {
        const index = schema.node.specifiers.indexOf(specifier);
        if (index > -1) {
          schema.node.specifiers.splice(index, 1);
        }
      }
    },
    removed: false,
    schema,
    type,
  };

  return importSpecifier;
}

// import './foo';
function sideEffectImport(props: IImportReferencesProps, scope: IImportReferences) {
  const { node } = props.schema;

  scope.references.push(
    Import({
      module: props.module,
      schema: props.schema,
      source: node.source.value,
      type: ImportType.SIDE_EFFECT_IMPORT,
    }),
  );
}

// import xx from 'xx';
// import { yy, bb as cc } from 'yy';
// import zz as aa from 'zz'
function regularImport(props: IImportReferencesProps, scope: IImportReferences) {
  let specifiers: Array<IImportSpecifier> = [];
  const { node } = props.schema;

  for (const specifier of node.specifiers) {
    specifiers.push(ImportSpecifier(props.schema, specifier));
  }

  scope.references.push(
    Import({
      module: props.module,
      schema: props.schema,
      source: node.source.value,
      specifiers,
      type: ImportType.IMPORT_SPECIFIERS,
    }),
  );
}

// const bar = require('foo');
function regularRequire(props: IImportReferencesProps, scope: IImportReferences) {
  const { node } = props.schema;

  scope.references.push(
    Import({
      module: props.module,
      schema: props.schema,
      source: node.arguments[0].value,
      type: ImportType.SIDE_EFFECT_IMPORT,
    }),
  );
}

// import _ = require('foo');
function sideEffectImportRequire(props: IImportReferencesProps, scope: IImportReferences) {
  const { node } = props.schema;

  scope.references.push(
    Import({
      module: props.module,
      schema: props.schema,
      source: node.moduleReference.expression.value,
      type: ImportType.SIDE_EFFECT_IMPORT,
    }),
  );
}

// import('./module');
function dynamicImport(props: IImportReferencesProps, scope: IImportReferences) {
  const { node } = props.schema;
  const { source } = getDynamicImport(node);

  scope.references.push(
    Import({
      module: props.module,
      schema: props.schema,
      source,
      type: ImportType.DYNAMIC_IMPORT,
    }),
  );
}

// export * from 'module';
function exportAllImport(props: IImportReferencesProps, scope: IImportReferences) {
  const { node } = props.schema;

  scope.references.push(
    Import({
      module: props.module,
      schema: props.schema,
      source: node.source.value,
      type: ImportType.EXPORT_FROM,
    }),
  );
}

// export { foo, bar as baz } from 'module';
function exportSpecifierImport(props: IImportReferencesProps, scope: IImportReferences) {
  let specifiers: Array<IImportSpecifier> = [];
  const { node } = props.schema;

  for (const specifier of node.specifiers) {
    specifiers.push(ImportSpecifier(props.schema, specifier));
  }

  scope.references.push(
    Import({
      module: props.module,
      schema: props.schema,
      source: node.source.value,
      specifiers,
      type: ImportType.EXPORT_FROM,
    }),
  );
}

export interface IImportReferences {
  references: Array<IImport>;
  register: (props: IImportReferencesProps) => void;
}

export function ImportReferences(productionContext: IProductionContext, module: IModule): IImportReferences {
  const scope = {
    references: [],
    register: (props: IImportReferencesProps) => {
      const { node } = props.schema;
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
