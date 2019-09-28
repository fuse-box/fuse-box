import { IVisit, IVisitorMod } from '../Visitor/Visitor';

export function InterfaceRemoverTransformer() {
  return (visit: IVisit): IVisitorMod => {
    const node = visit.node;

    // ****************************************************
    // export interface HelloWorld{}
    if (node.type === 'ExportNamedDeclaration') {
      if (node.declaration && node.declaration.type === 'InterfaceDeclaration') {
        return { removeNode: true };
      }
    }
    // interface Foo {}
    if (node.type === 'InterfaceDeclaration') {
      return { removeNode: true };
    }
    return;
  };
}
