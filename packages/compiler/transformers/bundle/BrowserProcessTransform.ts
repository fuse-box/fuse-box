import { IVisit, IVisitorMod } from '../../Visitor/Visitor';
import { ITransformerSharedOptions } from '../../interfaces/ITransformerSharedOptions';
import {
  isPropertyOrPropertyAccess,
  createASTFromObject,
  defineVariable,
  createRequireStatement,
} from '../../Visitor/helpers';
import { ImportType } from '../../interfaces/ImportType';

interface BrowserProcessTransformProps {
  env?: { [key: string]: string };
}
export type IBrowserProcessTransform = BrowserProcessTransformProps & ITransformerSharedOptions;
export function BrowserProcessTransform(options: IBrowserProcessTransform) {
  options = options || {};

  let globalEnvInserted = false;
  let entireEnvInserted = false;
  return (visit: IVisit): IVisitorMod => {
    const { node, parent } = visit;

    const accessList = isPropertyOrPropertyAccess(node, parent, 'process');
    if (accessList) {
      const variableAmount = accessList.length;
      if (variableAmount === 3 && accessList[1] === 'env') {
        const keyName = accessList[2];
        if (options.env && options.env[keyName] !== undefined) {
          return { replaceWith: { type: 'Literal', value: options.env[keyName].toString() } };
        }
      }
      if (variableAmount === 2) {
        switch (accessList[1]) {
          case 'version':
            return { replaceWith: { type: 'Literal', value: process.version }, avoidReVisit: true };
          case 'versions':
            return { replaceWith: { type: 'ObjectExpression', properties: [] }, avoidReVisit: true };
          case 'title':
            return { replaceWith: { type: 'Literal', value: 'browser' }, avoidReVisit: true };
          case 'umask':
            return { replaceWith: { type: 'Literal', value: 0 }, avoidReVisit: true };
          case 'browser':
            return { replaceWith: { type: 'Literal', value: true }, avoidReVisit: true };
          case 'cwd':
            return { replaceWith: { type: 'Literal', value: './' }, avoidReVisit: true };
          case 'env':
            if (options.env) {
              const response: IVisitorMod = {};
              if (!globalEnvInserted) {
                response.prependToBody = [defineVariable('___env', createASTFromObject(options.env))];
                globalEnvInserted = true;
              }
              response.replaceWith = { type: 'Identifier', name: '___env' };
              return response;
            } else return { replaceWith: createASTFromObject({}), avoidReVisit: true };

          default:
            // inserting require("process")
            // because we cannot match a know variable
            if (!entireEnvInserted) {
              entireEnvInserted = true;
              const statement = createRequireStatement('process', 'process');
              if (options.onRequireCallExpression)
                options.onRequireCallExpression(ImportType.REQUIRE, statement.reqStatement);
              return {
                avoidReVisit: true,
                prependToBody: [statement.statement],
              };
            }
            break;
        }
      }
    }
    return;
  };
}
