import { IVisit, IVisitorMod } from '../../Visitor/Visitor';
import { ITransformerSharedOptions } from '../../interfaces/ITransformerSharedOptions';
import {
  isPropertyOrPropertyAccess,
  createASTFromObject,
  defineVariable,
  createRequireStatement,
} from '../../Visitor/helpers';
import { ImportType } from '../../interfaces/ImportType';
import { GlobalContext } from '../../program/GlobalContext';

interface BrowserProcessTransformProps {
  env?: { [key: string]: string };
}
export type IBrowserProcessTransform = BrowserProcessTransformProps & ITransformerSharedOptions;
export function BrowserProcessTransformer(options: IBrowserProcessTransform) {
  options = options || {};

  let globalEnvInserted = false;
  let entireEnvInserted = false;
  let ignoreProcess = false;
  return (visit: IVisit): IVisitorMod => {
    if (ignoreProcess) return;
    const globalContext = visit.globalContext as GlobalContext;

    if (globalContext.hoisted['process']) {
      ignoreProcess = true;
      return;
    }

    const { node, parent } = visit;
    const locals = visit.scope && visit.scope.locals ? visit.scope.locals : {};

    const accessList = isPropertyOrPropertyAccess(node, parent, 'process');

    if (accessList) {
      if (locals['process'] === 1) return;
      if (visit.parent.type === 'AssignmentExpression') {
        if (!entireEnvInserted) {
          entireEnvInserted = true;
          const statement = createRequireStatement('process', 'process');
          if (options.onRequireCallExpression)
            options.onRequireCallExpression(ImportType.REQUIRE, statement.reqStatement);
          return {
            ignoreChildren: true,
            avoidReVisit: true,
            prependToBody: [statement.statement],
          };
        }
        return;
      }
      const variableAmount = accessList.length;
      if (variableAmount === 3 && accessList[1] === 'env') {
        const keyName = accessList[2];

        if (options.env && options.env[keyName] !== undefined) {
          return { replaceWith: { type: 'Literal', value: options.env[keyName].toString(), loc: node.loc } };
        }
        return { replaceWith: { type: 'Identifier', value: 'undefined' } };
      }
      if (variableAmount === 2) {
        switch (accessList[1]) {
          case 'version':
            return { replaceWith: { loc: node.loc, type: 'Literal', value: process.version }, avoidReVisit: true };
          case 'versions':
            return { replaceWith: { loc: node.loc, type: 'ObjectExpression', properties: [] }, avoidReVisit: true };
          case 'title':
            return { replaceWith: { loc: node.loc, type: 'Literal', value: 'browser' }, avoidReVisit: true };
          case 'umask':
            return { replaceWith: { type: 'Literal', value: 0 }, avoidReVisit: true };
          case 'browser':
            return { replaceWith: { loc: node.loc, type: 'Literal', value: true }, avoidReVisit: true };
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