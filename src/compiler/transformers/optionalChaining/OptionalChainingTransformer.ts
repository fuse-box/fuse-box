import { IVisit, IVisitorMod } from '../../Visitor/Visitor';
import { createUndefinedVariable, createVariableDeclaration } from '../../helpers/astHelpers';
import { ASTNode, ASTType } from '../../interfaces/AST';
import { ITransformer } from '../../interfaces/ITransformer';
import { OptionalChainHelper, createOptionalChaningExpression } from './optionalChaningHelpers';

const VALID_NODES = {
  [ASTType.OptionalCallExpression]: 1,
  [ASTType.OptionalMemberExpression]: 1,
};

interface IChainingStep {
  callArguments?: Array<ASTNode>;
  computed?: boolean;
  expression?: ASTNode;
  optional?: boolean;
  uknownCallExpression?: ASTNode;
}

interface IChainItem {
  items: Array<IChainingStep>;
  shouldExtractThis?: boolean;
}
type IChainingCollection = Array<IChainItem>;

function createOptionalContext(visit: IVisit) {
  const steps: Array<IChainingStep> = [];
  const globalContext = visit.globalContext;
  let finalStatement: ASTNode;

  let flatCollection: IChainingCollection;

  const declaration = createVariableDeclaration();
  const self = {
    declaration,
    finalStatement,
    flatCollection,
    steps,
    genId: () => {
      const nextVar = globalContext.getNextSystemVariable();
      declaration.declarations.push(createUndefinedVariable(nextVar));
      return nextVar;
    },
  };
  return self;
}
type OptionalChainContext = ReturnType<typeof createOptionalContext>;

function createPartialExpression(flat: IFlatExpresion, nodes: Array<IChainingStep>) {
  let expression: ASTNode;
  const firstNode = nodes[0];
  if (nodes.length === 1) {
    if (firstNode.callArguments) {
      return { expression: createOptionalCall(flat, firstNode.callArguments) };
    }
    return { expression: firstNode.expression };
  }

  const total = nodes.length;
  let index = 0;

  let thisVariable: string;

  while (index < total) {
    const item = nodes[index];
    const isLast = index === total - 1;

    const computed = item.computed || (item.expression && item.expression.type === ASTType.Literal);

    // call expression
    if (item.callArguments) {
      if (index === 1) {
        expression = createOptionalCall(flat, item.callArguments);
      } else {
        expression = {
          arguments: item.callArguments,
          callee: expression,
          type: 'CallExpression',
        };
      }
    } else {
      if (!expression) {
        expression = {
          computed: true,
          object: item.expression,
          property: null,
          type: 'MemberExpression',
        };
      } else {
        // if we see a next property while having an existing CallExpression, we must
        // converte to a MemberExpression with an object as the current CallExpression
        if (expression.type === 'CallExpression') {
          expression = { object: expression, property: null, type: 'MemberExpression' };
        }
        if (!expression.property) {
          expression.property = item.expression;
          expression.computed = computed;
        } else {
          expression = {
            computed: computed,
            object: expression,
            property: item.expression,
            type: 'MemberExpression',
          };
        }
      }
    }
    if (isLast && flat.shouldExtractThis) {
      // adding an expression statement
      // E.g a statement like a?.b.c.d.e.f?.();
      // The second part b.c.d.e.f, gets converted into
      // (_new_variable = _1_.b.c.d.e).f)
      if (expression.object) {
        thisVariable = flat.context.genId();
        expression.object = {
          left: { name: thisVariable, type: 'Identifier' },
          operator: '=',
          right: expression.object,
          type: 'AssignmentExpression',
        };
      }
    }
    index++;
  }

  return { expression, thisVariable };
}

interface IFlatExpresion {
  alternate?: Array<IChainingStep>;
  conditionSteps?: Array<IChainingStep>;
  context?: OptionalChainContext;
  id?: string;
  initial?: boolean;
  internalId?: number;
  nextFlatExpression?: IFlatExpresion;
  shouldExtractThis?: boolean;
  thisVariable?: string;
  collect?: () => OptionalChainHelper;

  generate?: () => OptionalChainHelper;
}

function createOptionalCall(expression: IFlatExpresion, callArguments: Array<ASTNode>): ASTNode {
  let args: Array<ASTNode> = [];
  if (expression.thisVariable) {
    args.push({
      name: expression.thisVariable,
      type: 'Identifier',
    });
  } else {
    return {
      arguments: callArguments,
      callee: {
        computed: false,
        name: expression.id,
        type: 'Identifier',
      },
      type: 'CallExpression',
    };
  }
  args = args.concat(callArguments);
  return {
    arguments: args,
    callee: {
      computed: false,
      object: {
        name: expression.id,
        type: 'Identifier',
      },
      property: {
        name: 'call',
        type: 'Identifier',
      },
      type: 'MemberExpression',
    },
    type: 'CallExpression',
  };
}

function createFlatExpression(context: OptionalChainContext, index: number): IFlatExpresion {
  const self: IFlatExpresion = {
    context,
    collect: (): OptionalChainHelper => {
      self.id = context.genId();

      const targets = self.alternate;
      let expression = createOptionalChaningExpression(self.id);

      // in case of a single optional call things to differently
      const callTarget = targets[0];
      if (callTarget.callArguments) {
        // const thatExpression = createOptionalCall(self, callTarget.callArguments);
        // expression.setRight(thatExpression);
        targets.unshift({ expression: { name: self.id, type: 'Identifier' } });
        const thatExpression = createPartialExpression(self, targets);
        expression.setRight(thatExpression.expression);
      } else {
        targets.unshift({ expression: { name: self.id, type: 'Identifier' } });

        const dataRight = createPartialExpression(self, targets);
        expression.setRight(dataRight.expression);

        // should notify the following call expression to use "this" variable
        if (self.nextFlatExpression && dataRight.thisVariable) {
          self.nextFlatExpression.thisVariable = dataRight.thisVariable;
        }
      }

      if (self.conditionSteps) {
        const dataLeft = createPartialExpression(self, self.conditionSteps);
        expression.setLeft(dataLeft.expression);
      }
      return expression;
    },

    generate: (): OptionalChainHelper => {
      let expression = self.collect();
      let next = self.nextFlatExpression;
      while (next) {
        const data = next.collect();
        data.setLeft(expression.statement);
        expression = data;
        next = next.nextFlatExpression;
      }
      return expression;
    },
  };
  return self;
}

function processFlatCollection(context: OptionalChainContext) {
  const flatCollection = context.flatCollection;
  const total = flatCollection.length;
  let index = 0;
  let startFlatExpression: IFlatExpresion;
  let current: IFlatExpresion;

  const flatExpressions = [];
  while (index < total) {
    const item = flatCollection[index];
    if (index === 0) {
      current = createFlatExpression(context, index);
      flatExpressions.push(current);
      current.conditionSteps = item.items;
      startFlatExpression = current;
    } else if (current) {
      if (index === 1) {
        current.alternate = item.items;
      } else {
        const newFlatExpression = createFlatExpression(context, index);
        flatExpressions.push(newFlatExpression);
        current.nextFlatExpression = newFlatExpression;
        newFlatExpression.alternate = item.items;
        current = newFlatExpression;
      }
    }

    index++;
  }
  let i = 0;
  while (i < flatExpressions.length) {
    const f = flatExpressions[i];
    if (f.alternate[0].callArguments) {
      if (flatExpressions[i - 1]) flatExpressions[i - 1].shouldExtractThis = true;
    }
    i++;
  }
  const data = startFlatExpression.generate();
  context.finalStatement = data.statement;
}

function flatten(context: OptionalChainContext) {
  const { steps } = context;
  const amount = steps.length;

  const collection: IChainingCollection = [];

  let index = amount - 1;
  while (index >= 0) {
    const step = steps[index];
    if (!step.optional && collection[collection.length - 1]) {
      collection[collection.length - 1].items.push(step);
    } else {
      const shouldExtractThis = !!step.callArguments;
      const prev = collection[collection.length - 1];
      if (shouldExtractThis && prev) prev.shouldExtractThis = true;
      collection.push({ items: [step] });
    }
    index--;
  }
  context.flatCollection = collection;
  processFlatCollection(context);
}

/**
 * Drill every single property on the OptionalChain
 * Split it into steps and prepare for flattening
 * @param node
 * @param context
 */
export function chainDrill(node: ASTNode, context: OptionalChainContext) {
  const optional = node.optional === true;

  if (node.type === ASTType.Identifier || node.type === ASTType.MemberExpression) {
    context.steps.push({ expression: node, optional });
  }

  if (node.type === ASTType.OptionalMemberExpression) {
    if (node.property) {
      context.steps.push({ computed: node.computed, expression: node.property, optional });
    }
    if (node.object) {
      if (node.object.type === ASTType.CallExpression) {
        context.steps.push({ expression: node.object });
      } else chainDrill(node.object, context);
    }
  }

  // Regardless of the "optional" status calls should be separated since the call to those
  // will handled on a system variable e.g _1_.call(_1_, args)
  if (node.type === ASTType.OptionalCallExpression) {
    if (node.callee) {
      context.steps.push({
        callArguments: node.arguments,
        optional,
      });
      chainDrill(node.callee, context);
    }
  }
}

export function OptionalChaningTransformer(): ITransformer {
  return {
    commonVisitors: props => {
      return {
        onEachNode: (visit: IVisit): IVisitorMod => {
          const node = visit.node;
          if (!VALID_NODES[node.type]) return;
          const context = createOptionalContext(visit);

          chainDrill(node, context);
          flatten(context);

          return { prependToBody: [context.declaration], replaceWith: context.finalStatement };
        },
      };
    },
  };
}
