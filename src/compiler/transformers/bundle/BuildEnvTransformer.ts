import { ISchema } from '../../core/nodeSchema';
import { ASTNode, ASTType } from '../../interfaces/AST';
import { ITransformer } from '../../interfaces/ITransformer';
import { ITransformerSharedOptions } from '../../interfaces/ITransformerSharedOptions';
import { parseJavascript } from '../../parser';
interface BrowserProcessTransformProps {
  env?: { [key: string]: string };
}
export type IBrowserProcessTransform = BrowserProcessTransformProps & ITransformerSharedOptions;

export const BUILD_ENV_NAME = '__build_env';

const CACHE_AST: Record<string, ASTNode> = {};

function getEnvAST(obj: any) {
  let str;
  if (typeof obj === 'string') str = obj;
  else str = JSON.stringify(obj);
  if (CACHE_AST[str]) return CACHE_AST[str];

  let ast;

  if (typeof obj === 'object') {
    ast = parseJavascript('var a = ' + str);
  } else {
    try {
      ast = parseJavascript(str);
    } catch (e) {
      throw new Error(`Error while parsing string : "${str}".
Make sure you're passing a valid javascript string.
Otherwise pass a javascript object (it will be converting to AST automatically)
`);
    }
  }
  const body = ast.body as Array<ASTNode>;
  const firstItem = body[0];
  if (firstItem) {
    let expression;
    switch (firstItem.type) {
      case ASTType.ExpressionStatement:
        expression = firstItem.expression;
        break;
      case ASTType.VariableDeclaration:
        expression = firstItem.declarations[0].init;
        break;
      default:
        break;
    }
    if (expression) CACHE_AST[str] = expression;
    return expression;
  }
  return CACHE_AST[str];
}

export function BuildEnvTransformer(): ITransformer {
  return {
    commonVisitors: props => {
      const compilerOptions = props.transformationContext.compilerOptions;
      const buildEnv = compilerOptions.buildEnv;

      return {
        onEach: (schema: ISchema) => {
          const { node } = schema;
          if (node.type === ASTType.MemberExpression && node.object.name === BUILD_ENV_NAME) {
            const propertyName = node.property.name;
            if (buildEnv[propertyName] !== undefined) {
              const ast = getEnvAST(buildEnv[propertyName]);
              if (ast) return schema.replace(ast);
            }
            return schema.replace({ name: 'undefined', type: ASTType.Identifier } as ASTNode);
          }
          return;
        },
      };
    },
  };
}
