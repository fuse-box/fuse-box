import { ISchema } from '../../core/nodeSchema';
import {
  createASTFromObject,
  createRequireStatement,
  defineVariable,
  isPropertyOrPropertyAccess,
} from '../../helpers/helpers';
import { ASTNode, ASTType } from '../../interfaces/AST';
import { ITransformer } from '../../interfaces/ITransformer';
import { ITransformerSharedOptions } from '../../interfaces/ITransformerSharedOptions';
import { ImportType } from '../../interfaces/ImportType';

interface BrowserProcessTransformProps {
  env?: { [key: string]: string };
}
export type IBrowserProcessTransform = BrowserProcessTransformProps & ITransformerSharedOptions;

const _MaybeCall = {
  [ASTType.CallExpression]: 1,
  [ASTType.MemberExpression]: 1,
  [ASTType.NewExpression]: 1,
};

function findObj(node: ASTNode) {
  if (node.type == ASTType.Identifier) return node.name;
  if (node.type === ASTType.MemberExpression) return findObj(node.object);
}
function getAccessName(node: ASTNode): string {
  if (_MaybeCall[node.type]) {
    let name;
    if (node.callee) name = findObj(node.callee);
    else name = findObj(node);

    return name;
  }
}
export function BrowserProcessTransformer(): ITransformer {
  return {
    commonVisitors: props => {
      const compilerOptions = props.transformationContext.compilerOptions;

      if (compilerOptions.buildTarget !== 'browser') return;

      const env = compilerOptions.processEnv;

      let globalEnvInserted = false;
      let entireEnvInserted = false;
      let ignoreProcess = false;

      return {
        onEach: (schema: ISchema) => {
          if (ignoreProcess) return;

          const { getLocal, node, parent } = schema;

          const accessName = getAccessName(node);
          if (!accessName) return;
          if (accessName !== 'process') return;

          if (getLocal('process')) {
            return;
          }

          const accessList = isPropertyOrPropertyAccess(node, parent, 'process');

          if (accessList) {
            if (parent.type === 'AssignmentExpression') {
              if (!entireEnvInserted) {
                entireEnvInserted = true;
                const statement = createRequireStatement('process', 'process');

                if (props.onRequireCallExpression)
                  props.onRequireCallExpression(ImportType.REQUIRE, statement.reqStatement);

                return schema.bodyPrepend([statement.statement]).ignore();
              }
              return;
            }
            const variableAmount = accessList.length;

            const { replace } = schema;
            if (variableAmount === 3 && accessList[1] === 'env') {
              const keyName = accessList[2];

              if (env && env[keyName] !== undefined) {
                return replace([{ loc: node.loc, type: 'Literal', value: env[keyName].toString() }]);
              }
              return replace([{ type: 'Identifier', value: 'undefined' }]);
            }

            if (variableAmount === 2) {
              switch (accessList[1]) {
                case 'browser':
                  return replace([{ loc: node.loc, type: 'Literal', value: true }]).ignore();
                case 'cwd':
                  return replace([{ type: 'Literal', value: './' }]).ignore();
                case 'title':
                  return replace([{ loc: node.loc, type: 'Literal', value: 'browser' }]).ignore();
                case 'umask':
                  return replace([{ type: 'Literal', value: 0 }]).ignore();
                case 'version':
                  return replace([{ loc: node.loc, type: 'Literal', value: process.version }]).ignore();
                case 'versions':
                  return replace([{ loc: node.loc, properties: [], type: 'ObjectExpression' }]).ignore();
                case 'env':
                  if (env) {
                    if (!globalEnvInserted) {
                      schema.bodyPrepend([defineVariable('___env', createASTFromObject(env))]);
                      globalEnvInserted = true;
                    }
                    return replace([{ name: '___env', type: 'Identifier' }]).ignore();
                  } else return replace([createASTFromObject({})]).ignore();

                default:
                  // inserting require("process")
                  // because we cannot match a known variable

                  if (!entireEnvInserted) {
                    entireEnvInserted = true;
                    const statement = createRequireStatement('process', 'process');
                    if (props.onRequireCallExpression)
                      props.onRequireCallExpression(ImportType.REQUIRE, statement.reqStatement);
                    return schema.bodyPrepend([statement.statement]).ignore();
                  }
                  break;
              }
            }
          }
          return;
        },
      };
    },
  };
}
