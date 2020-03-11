import { IVisit } from '../Visitor/Visitor';
import { generateModuleNameFromSource } from '../helpers/astHelpers';
import { ASTNode } from '../interfaces/AST';
import { IProgramProps } from './transpileModule';

type IRefInterceptor = (node: ASTNode, visit: IVisit) => any;
export interface GlobalContext {
  completeCallbacks?: Array<() => void>;
  esModuleStatementInjected?: boolean;
  jsxFactory?: string;
  namespace?: string;
  programProps?: IProgramProps;
  refInterceptors: Map<string, IRefInterceptor>;
  sourceReferences: Record<
    string,
    {
      current: number;
      sources: Record<string, number>;
    }
  >;
  tracedReferences: Map<string, number>;
  exportAfterDeclaration?: {
    [key: string]: {
      targets?: Array<string>;
    };
  };
  hoisted: { [key: string]: number };
  identifierReplacement: {
    [key: string]: {
      first?: string;
      second?: string;
      insertAfter?: ASTNode;
      inUse?: boolean;
    };
  };
  getModuleName: (source: string) => string;
  getNextSystemVariable: () => string;
  onRef: (name: string, fn: IRefInterceptor) => any;
}

export function createGlobalContext(userContext?: { [key: string]: any }): GlobalContext {
  let VARIABLE_COUNTER = 0;
  const refInterceptors = new Map<string, IRefInterceptor>();
  let essentialContext = {
    completeCallbacks: [],
    hoisted: {},
    identifierReplacement: {},
    namespace: 'exports',
    refInterceptors,
    sourceReferences: {},
    tracedReferences: new Map(),
    getModuleName: source => generateModuleNameFromSource(source, essentialContext.sourceReferences),
    getNextSystemVariable: () => `_${[++VARIABLE_COUNTER]}_`,
    onRef: (name: string, fn: IRefInterceptor) => {
      refInterceptors.set(name, fn);
    },
  };
  if (userContext) {
    for (const key in userContext) {
      essentialContext[key] = userContext[key];
    }
  }

  return essentialContext;
}
