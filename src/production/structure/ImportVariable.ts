import { ImportDeclaration, ImportSpecifier } from 'ts-morph';
import { ESLink } from './ESLink';

export class ImportVariable {
  public name: string;
  public local: string;
  public importSpecifierNode: ImportSpecifier;
  public defaultImportDeclarationNode: ImportDeclaration;
  public isDynamicImport: boolean;
  constructor(public link: ESLink) {}

  public getText() {
    if (this.importSpecifierNode) return this.importSpecifierNode.getText();
    if (this.defaultImportDeclarationNode) return this.defaultImportDeclarationNode.getText();
  }

  public toJSON() {
    const obj: any = {};
    if (this.name) obj.name = this.name;
    if (this.local) obj.local = this.local;
    if (this.importSpecifierNode) obj.importSpecifierNode = true;
    if (this.defaultImportDeclarationNode) obj.defaultImportDeclarationNode = true;
    return obj;
  }
}
