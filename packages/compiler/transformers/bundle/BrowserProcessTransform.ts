import { IVisit, IVisitorMod } from '../../Visitor/Visitor';
import { ITransformerSharedOptions } from '../../interfaces/ITransformerSharedOptions';
import { isPropertyOrPropertyAccess } from '../../Visitor/helpers';

interface BrowserProcessTransformProps {
  env?: { [key: string]: string };
}
export type IBrowserProcessTransform = BrowserProcessTransformProps & ITransformerSharedOptions;
export function BrowserProcessTransform(options: IBrowserProcessTransform) {
  options = options || {};
  return (visit: IVisit): IVisitorMod => {
    const { node, parent } = visit;

    const accessList = isPropertyOrPropertyAccess(node, parent, 'process');
    if (accessList) {
      //console.log(accessList, node);
    }
    return;
  };
}
