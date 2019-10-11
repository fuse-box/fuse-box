import { ExportSpecifier, FunctionDeclaration, ClassDeclaration, ObjectLiteralExpression } from 'ts-morph';
import { ImportVariable } from './ImportVariable';
import { ESLink } from './ESLink';
export enum ExportReferenceType {
  ImportReference = 'ImportReference',
  Object = 'Object',
  DefaultAssignment = 'DefaultAssignment',
}
export class ExportReference {
  public type: ExportReferenceType;
  public name: string;
  public exported: string;
  public objectNode: FunctionDeclaration | ClassDeclaration;
  public objectLiteralExpressionNode: ObjectLiteralExpression;
  public exportSpecifierNode: ExportSpecifier;

  public dependantVariables: Array<ImportVariable>;
  public dependantExports: Array<ExportReference>;

  constructor(public link: ESLink) {
    this.dependantVariables = [];
    this.dependantExports = [];
  }

  public hasExternalDependants() {
    for (const _exp of this.dependantExports) {
      if (_exp.link.productionModule.productionPackage !== this.link.productionModule.productionPackage) {
        return true;
      }
    }
    for (const _var of this.dependantVariables) {
      if (_var.link.productionModule.productionPackage !== this.link.productionModule.productionPackage) {
        return true;
      }
    }
  }

  public findObject() {}

  public getText() {
    if (this.objectNode) {
      return this.objectNode.getText();
    }
    if (this.exportSpecifierNode) {
      return this.exportSpecifierNode.getText();
    }
    if (this.objectLiteralExpressionNode) {
      return this.objectLiteralExpressionNode.getText();
    }
  }

  public toJSON() {
    const obj: any = {};
    if (this.type) obj.type = this.type;
    if (this.name) obj.name = this.name;
    if (this.objectNode) {
      obj.objectNode = this.objectNode.getKindName();
    }
    if (this.exported) obj.exported = this.exported;
    if (this.exportSpecifierNode) obj.exportSpecifierNode = true;
    if (this.objectLiteralExpressionNode) obj.objectLiteralExpressionNode = true;
    return obj;
  }
}
