import { ASTNode } from '../interfaces/AST';
import { IProgramProps } from './transpileModule';

export interface GlobalContext {
  getNextIndex: () => number;
  getNextSystemVariable: () => string;
  hoisted: { [key: string]: number };
  exportAfterDeclaration?: {
    [key: string]: {
      targets?: Array<string>;
    };
  };
  jsxFactory?: string;
  programProps?: IProgramProps;
  identifierReplacement: {
    [key: string]: {
      first?: string;
      second?: string;
      insertAfter?: ASTNode;
      inUse?: boolean;
    };
  };
  namespace?: string;
  completeCallbacks?: Array<() => void>;
}

export function createGlobalContext(userContext?: { [key: string]: any }): GlobalContext {
  let VARIABLE_COUNTER = 0;
  let index = 1;
  let essentialContext = {
    completeCallbacks: [],
    hoisted: {},
    getNextIndex: () => index++,
    identifierReplacement: {},
    namespace: 'exports',
    getNextSystemVariable: () => {
      return `_${++VARIABLE_COUNTER}_`;
    },
  };
  if (userContext) {
    for (const key in userContext) {
      essentialContext[key] = userContext[key];
    }
  }

  return essentialContext;
}
