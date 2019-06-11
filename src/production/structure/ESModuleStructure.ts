import {
  ClassDeclaration,
  ExportAssignment,
  ExportDeclaration,
  FunctionDeclaration,
  ImportDeclaration,
  SourceFile,
} from 'ts-morph';
import * as ts from 'typescript';
import {
  createExportAssignment,
  createExportDeclaration,
  createExportObjectDeclaration,
  createImportDeclaration,
  ESLink,
} from './ESLink';
import { ProductionModule } from '../ProductionModule';

export class ESModuleStructure {
  public links: Array<ESLink>;

  constructor(public productionModule: ProductionModule) {
    this.links = [];
  }
  public findFromLinks(): Array<ESLink> {
    return this.links.filter(link => !!link.fromSource);
  }

  public linkConnection(externalLink: ESLink) {
    // checking imports
    // import { foo } from "./homeModule";
    for (const importedExternal of externalLink.imports) {
      for (const homeLink of this.links) {
        const target = homeLink.exports.find(exp => {
          return importedExternal.name === exp.exported;
        });
        if (target) target.dependantVariables.push(importedExternal);
      }
    }

    // checking imports
    // export { foo } from "./homeModule";
    for (const exportedExternal of externalLink.exports) {
      for (const homeLink of this.links) {
        const target = homeLink.exports.find(exp => {
          return exportedExternal.exported === exp.exported;
        });
        if (target) target.dependantExports.push(exportedExternal);
      }
    }
  }

  public toJSON() {
    return this.links.map(link => link.toJSON());
  }
}

export function createESModuleStructure(productionModule: ProductionModule, file: SourceFile) {
  const structure = new ESModuleStructure(productionModule);

  file.getStatements().forEach(statement => {
    const kind = statement.getKind();
    let link: ESLink;

    switch (kind) {
      case ts.SyntaxKind.ImportDeclaration:
        link = createImportDeclaration(productionModule, statement as ImportDeclaration);
        break;
      case ts.SyntaxKind.ExportDeclaration:
        link = createExportDeclaration(productionModule, statement as ExportDeclaration);
        break;
      case ts.SyntaxKind.ExportAssignment:
        link = createExportAssignment(productionModule, statement as ExportAssignment);
        break;
      case ts.SyntaxKind.FunctionDeclaration:
        const functionDeclaration = statement as FunctionDeclaration;
        if (functionDeclaration.hasExportKeyword()) {
          link = createExportObjectDeclaration(productionModule, functionDeclaration);
        }
        break;
      case ts.SyntaxKind.ClassDeclaration:
        const classDeclaration = statement as ClassDeclaration;
        if (classDeclaration.hasExportKeyword()) {
          link = createExportObjectDeclaration(productionModule, classDeclaration);
        }
        break;
      default:
        break;
    }
    if (link) {
      structure.links.push(link);
    }
  });
  return structure;
}
