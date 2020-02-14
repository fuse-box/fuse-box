import { generateModuleNameFromSource } from '../helpers/astHelpers';
import { ASTNode } from '../interfaces/AST';
import { IProgramProps } from './transpileModule';

export interface GlobalContext {
  completeCallbacks?: Array<() => void>;
  jsxFactory?: string;
  namespace?: string;
  programProps?: IProgramProps;
  sourceReferences: Record<
    string,
    {
      current: number;
      sources: Record<string, number>;
    }
  >;
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
}

const USE_TEST_ALPHABET = false;
let alphabet = ['a', 'b', 'c', 'd', 'f', 'g', 'h', 'i', 'j', 'k'];
export function createGlobalContext(userContext?: { [key: string]: any }): GlobalContext {
  let VARIABLE_COUNTER = 0;
  let essentialContext = {
    completeCallbacks: [],
    hoisted: {},
    identifierReplacement: {},
    namespace: 'exports',
    sourceReferences: {},
    getModuleName: source => generateModuleNameFromSource(source, essentialContext.sourceReferences),
    getNextSystemVariable: () => {
      if (USE_TEST_ALPHABET) {
        return `_${alphabet[++VARIABLE_COUNTER]}`;
      } else {
        return `_${[++VARIABLE_COUNTER]}_`;
      }
    },
  };
  if (userContext) {
    for (const key in userContext) {
      essentialContext[key] = userContext[key];
    }
  }

  return essentialContext;
}
