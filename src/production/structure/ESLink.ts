import {
  ClassDeclaration,
  ExportAssignment,
  ExportDeclaration,
  FunctionDeclaration,
  ImportDeclaration,
  Node,
  ObjectLiteralExpression,
  SourceFile,
} from 'ts-morph';
import * as ts from 'typescript';
import { ProductionModule } from '../ProductionModule';
import { ExportReference, ExportReferenceType } from './ExportReference';
import { ImportVariable } from './ImportVariable';

export enum ESLinkType {
  ExportDeclaration,
  ExportAssignment,
  ImportDeclaration,
  ObjectDeclaration,
}
export class ESLink {
  public type: ESLinkType;

  /**
   * fromSource
   * import .. from "./source"
   * export .. from "./source"
   *
   * @type {string}
   * @memberof ESLink
   */
  public fromSource: string;

  public imports: Array<ImportVariable>;
  public exports: Array<ExportReference>;

  private importDeclarationNode: ImportDeclaration;
  private exportDeclarationNode: ExportDeclaration;
  private exportAssignmentNode: ExportAssignment;
  private exportObjectDeclarationNode: FunctionDeclaration;

  constructor(public productionModule: ProductionModule) {
    this.exports = [];
    this.imports = [];
  }

  /**
   * importDeclaration ********************************************************
   *
   * @param {ImportDeclaration} node
   * @memberof ESLink
   */
  createImportDeclaration(node: ImportDeclaration) {
    this.importDeclarationNode = node;
    this.type = ESLinkType.ImportDeclaration;
    if (node.getModuleSpecifier()) {
      this.fromSource = node.getModuleSpecifier().getLiteralText();
    }
    this.parseNamedImports();
  }

  private parseNamedImports() {
    this.imports = [];
    const node = this.importDeclarationNode;
    const defaultImport = node.getDefaultImport();

    if (defaultImport) {
      const importVariable = new ImportVariable(this);
      importVariable.name = 'default';
      importVariable.defaultImportDeclarationNode = node;
      this.imports.push(importVariable);
    }

    const namedImports = node.getNamedImports();
    if (namedImports) {
      namedImports.forEach(namedImport => {
        let name, local;
        if (namedImport.getAliasNode()) {
          local = namedImport.getAliasNode().getText();
        }
        if (namedImport.getNameNode()) {
          name = namedImport.getNameNode().getText();
        }
        if (name) {
          const importVariable = new ImportVariable(this);
          importVariable.name = name;
          importVariable.local = local;
          importVariable.importSpecifierNode = namedImport;
          this.imports.push(importVariable);
        }
      });
    }
  }
  /**
   * Export assignemnt ******************************************************************
   *
   * @param {ExportAssignment} node
   * @memberof ESLink
   */
  createExportAssignment(node: ExportAssignment) {
    this.exportAssignmentNode = node;
    this.type = ESLinkType.ExportAssignment;
    if (!node.isExportEquals()) {
      const expression = node.getExpression();
      if (expression) {
        const ref = new ExportReference(this);
        ref.name = ref.exported = 'default';
        ref.type = ExportReferenceType.DefaultAssignment;

        if (expression.getKind() === ts.SyntaxKind.ObjectLiteralExpression) {
          const objectLiteralExpression = expression as ObjectLiteralExpression;
          ref.objectLiteralExpressionNode = objectLiteralExpression;
          // const properties = objectLiteralExpression.getProperties();
          // if (properties) {
          //   properties.forEach(item => {
          //     const referenceName = item.getText();
          //     if (item.getKind() === ts.SyntaxKind.ShorthandPropertyAssignment) {
          //       const shortHand = item as ShorthandPropertyAssignment;
          //       const refs = shortHand.findReferencesAsNodes();
          //       refs.forEach(ref => {
          //         const importDeclaration = this.isImportDeclaration(ref);
          //         if (importDeclaration) {
          //         }
          //       });
          //     }
          //   });
          // }
        }
        this.exports.push(ref);
      }
    }
  }

  private isImportDeclaration(node: Node): ImportDeclaration {
    if (node.getParent()) {
      if (node.getParent().getKind() === ts.SyntaxKind.ImportClause) {
        if (node.getParent().getParent()) {
          if (
            node
              .getParent()
              .getParent()
              .getKind() === ts.SyntaxKind.ImportDeclaration
          ) {
            return node.getParent().getParent() as ImportDeclaration;
          }
        }
      }
    }
  }

  /**
   * ExportDeclaration ******************************************************************
   *
   * @param {ExportDeclaration} node
   * @memberof ESLink
   */
  createExportDeclaration(node: ExportDeclaration) {
    this.exportDeclarationNode = node;
    this.type = ESLinkType.ExportDeclaration;
    if (node.getModuleSpecifier()) {
      this.fromSource = node.getModuleSpecifier().getLiteralText();
    }
    this.parseExports();
  }

  private parseExports() {
    const node = this.exportDeclarationNode;

    node.getNamedExports().forEach(en => {
      let local, name;
      if (en.getAliasNode()) {
        local = en.getAliasNode().getText();
      }
      name = en.getNameNode().getText();

      if (name) {
        const ref = new ExportReference(this);
        ref.name = name;
        ref.exported = local || ref.name;
        ref.type = ExportReferenceType.ImportReference;
        ref.exportSpecifierNode = en;
        if (!this.fromSource) {
          const file = node.getSourceFile();
          const decl = this.getLocalDeclaration(file, name);
          if (decl) {
            ref.type = ExportReferenceType.Object;
            ref.objectNode = decl;
          }
        }
        this.exports.push(ref);
      }
    });
  }

  private getLocalDeclaration(file: SourceFile, name: string) {
    const statements = file.getStatements();
    for (const statement of statements) {
      const kind = statement.getKind();
      switch (kind) {
        case ts.SyntaxKind.FunctionDeclaration:
        case ts.SyntaxKind.ClassDeclaration:
          const decl = statement as ClassDeclaration;
          if (decl.getName() === name) {
            return decl;
          }
          break;
      }
    }
  }

  createExportObjectDeclaration(node: FunctionDeclaration) {
    this.exportObjectDeclarationNode = node;
    this.type = ESLinkType.ExportDeclaration;
    const ref = new ExportReference(this);
    ref.name = ref.exported = node.getName();
    if (node.hasDefaultKeyword()) {
      ref.exported = 'default';
    }
    ref.objectNode = node;
    ref.type = ExportReferenceType.Object;
    this.exports.push(ref);
  }

  public toJSON() {
    const obj: any = {};
    if (this.fromSource) {
      obj.fromSource = this.fromSource;
    }
    if (this.imports && this.imports.length) {
      obj.imports = this.imports.map(imp => imp.toJSON());
    }
    if (this.exports && this.exports.length) {
      obj.exports = this.exports.map(item => item.toJSON());
    }
    return obj;
  }
}

export function createImportDeclaration(productionModule: ProductionModule, node: ImportDeclaration): ESLink {
  const link = new ESLink(productionModule);
  link.createImportDeclaration(node);
  return link;
}
export function createExportAssignment(productionModule: ProductionModule, node: ExportAssignment): ESLink {
  const link = new ESLink(productionModule);
  link.createExportAssignment(node);
  return link;
}

export function createExportDeclaration(productionModule: ProductionModule, node: ExportDeclaration): ESLink {
  const link = new ESLink(productionModule);
  link.createExportDeclaration(node);
  return link;
}
export function createExportObjectDeclaration(productionModule: ProductionModule, node): ESLink {
  const link = new ESLink(productionModule);

  link.createExportObjectDeclaration(node);
  return link;
}
