import { ISchema } from '../../core/nodeSchema';
import { createUndefinedVariable, createVariableDeclaration } from '../../helpers/astHelpers';
import { ASTNode, ASTType } from '../../interfaces/AST';
import { ITransformer } from '../../interfaces/ITransformer';
import { OptionalChainHelper, createOptionalChaningExpression } from './optionalChainingHelpers';

const VALID_NODES = {
  [ASTType.AwaitExpression]: 1,
  [ASTType.ChainExpression]: 1,
  [ASTType.OptionalCallExpression]: 1,
  [ASTType.OptionalMemberExpression]: 1,
};

interface IChainingStep {
  callArguments?: Array<ASTNode>;
  computed?: boolean;
  expression?: ASTNode;
  optional?: boolean;
}

interface IChainItem {
  items: Array<IChainingStep>;
}

type IChainingCollection = Array<IChainItem>;

function createOptionalContext(schema: ISchema) {
  const steps: Array<IChainingStep> = [];

  const declaration = createVariableDeclaration();

  const self = {
    declaration,
    schema,
    steps,
    genId: () => {
      const nextVar = schema.context.getNextSystemVariable();
      declaration.declarations.push(createUndefinedVariable(nextVar));
      return nextVar;
    },
  };
  return self;
}
type OptionalChainContext = ReturnType<typeof createOptionalContext>;

function createPartialExpression(props: {
  flatExpression: IFlatExpression;
  nodes: Array<IChainingStep>;
  shouldExtractThis: boolean;
}) {
  let expression: ASTNode;
  const { flatExpression, nodes, shouldExtractThis } = props;
  const firstNode = nodes[0];
  let thisVariable: string;

  if (nodes.length === 1) {
    if (shouldExtractThis) {
      if (firstNode.expression.type === 'MemberExpression') {
        thisVariable = flatExpression.context.genId();
        firstNode.expression.object = {
          left: { name: thisVariable, type: 'Identifier' },
          operator: '=',
          right: firstNode.expression.object,
          type: 'AssignmentExpression',
        };
        return { expression: firstNode.expression, thisVariable };
      }
    }
    return { expression: firstNode.expression };
  }

  const total = nodes.length;
  let index = 0;

  while (index < total) {
    const item = nodes[index];
    const isLast = index === total - 1;

    const computed = item.computed || (item.expression && item.expression.type === ASTType.Literal);

    // call expression
    if (item.callArguments) {
      if (index === 1) {
        expression = createOptionalCall(flatExpression, firstNode.expression, item.callArguments);
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
          object: item.expression,
          property: null,
          type: 'MemberExpression',
        };
      } else {
        // if we see a next property while having an existing CallExpression, we must
        // converte to a MemberExpression with an object as the current CallExpression
        if (expression.type === 'CallExpression')
          expression = { object: expression, property: null, type: 'MemberExpression' };

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
    if (isLast && shouldExtractThis) {
      // adding an expression statement
      // E.g a statement like a?.b.c.d.e.f?.();
      // The second part b.c.d.e.f, gets converted into
      // (_new_variable = _1_.b.c.d.e).f)
      if (expression.object) {
        thisVariable = flatExpression.context.genId();
        expression.object = {
          left: { name: thisVariable, type: 'Identifier' },
          operator: '=',
          right: expression.object,
          type: 'AssignmentExpression',
        };
      } else {
      }
    }
    index++;
  }

  return { expression, thisVariable };
}

interface IFlatExpression {
  alternate?: Array<IChainingStep>;
  conditionSteps?: Array<IChainingStep>;
  context?: OptionalChainContext;
  id?: string;
  nextFlatExpression?: IFlatExpression;
  shouldExtractThis?: boolean;
  thisVariable?: string;
  collect?: () => OptionalChainHelper;
  generate?: () => OptionalChainHelper;
}

function createOptionalCall(expression: IFlatExpression, firstNode: ASTNode, callArguments: Array<ASTNode>): ASTNode {
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
        name: expression.id || firstNode.name,
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

function createFlatExpression(context: OptionalChainContext): IFlatExpression {
  const self: IFlatExpression = {
    context,
    collect: (): OptionalChainHelper => {
      let initialLeft;

      if (self.conditionSteps) {
        initialLeft = createPartialExpression({
          flatExpression: self,
          nodes: self.conditionSteps,
          shouldExtractThis: !!self.alternate[0].callArguments,
        });
      }

      self.id = context.genId();
      const targets = self.alternate;
      let expression = createOptionalChaningExpression(self.id);

      if (self.conditionSteps) {
        expression.setLeft(initialLeft.expression);
        if (initialLeft.thisVariable) {
          self.thisVariable = initialLeft.thisVariable;
        }
      }

      // inserting the current identifier

      targets.unshift({ expression: { name: self.id, type: 'Identifier' } });
      const dataRight = createPartialExpression({
        flatExpression: self,
        nodes: targets,
        shouldExtractThis: self.shouldExtractThis,
      });
      expression.setRight(dataRight.expression);

      // should notify the following call expression to use "this" variable
      if (self.nextFlatExpression && dataRight.thisVariable)
        self.nextFlatExpression.thisVariable = dataRight.thisVariable;

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

function createStatement(context: OptionalChainContext) {
  const { steps } = context;
  const flatCollection: IChainingCollection = [];
  let index: number;
  let current: IFlatExpression;

  const amount = steps.length;
  index = amount - 1;
  while (index >= 0) {
    const step = steps[index];
    const prev = flatCollection[flatCollection.length - 1];
    if (!step.optional && prev) prev.items.push(step);
    else flatCollection.push({ items: [step] });
    index--;
  }

  index = flatCollection.length - 1;
  while (index >= 0) {
    const item = flatCollection[index];

    if (index > 0) {
      let flatExpression: IFlatExpression = createFlatExpression(context);
      flatExpression.alternate = item.items;
      if (current) {
        flatExpression.shouldExtractThis = !!current.alternate[0].callArguments;
        flatExpression.nextFlatExpression = current;
      }
      current = flatExpression;
    } else {
      current.conditionSteps = item.items;
    }

    index--;
  }

  const { statement } = current.generate();
  return statement;
}

/**
 * Drill every single property on the OptionalChain
 * Split it into steps and prepare for flattening
 * @param node
 * @param context
 */
export function chainDrill(node: ASTNode, context: OptionalChainContext) {
  let optional = node.optional === true;

  if (node.type === ASTType.ThisExpression) {
    context.steps.push({ computed: false, expression: { name: 'this', type: 'Identifier' }, optional });
    return;
  }
  if (node.type === ASTType.ChainExpression) {
    return chainDrill(node.expression, context);
  }

  if (node.type === ASTType.MemberExpression) {
    if (node.property) {
      context.steps.push({ computed: node.computed, expression: node.property, optional });
    }
    if (node.object) chainDrill(node.object, context);

    return;
  }
  if (node.type === ASTType.CallExpression) {
    if (node.callee) {
      context.steps.push({
        callArguments: node.arguments,
        optional,
      });
      return chainDrill(node.callee, context);
    }
  }
  if ((node.type === ASTType.AsExpression || node.type == ASTType.NonNullExpression) && node.expression) {
    return chainDrill(node.expression, context);
  }

  context.steps.push({ computed: node.computed, expression: node });
}

export function OptionalChaningTransformer(): ITransformer {
  return {
    commonVisitors: (props) => {
      return {
        onEach: (schema: ISchema) => {
          const { node } = schema;
          if (!VALID_NODES[node.type]) return;

          let expressionNode = node;
          let isAwaitExpression = false;
          if (node.type === ASTType.AwaitExpression) {
            // swap the node for await argument
            // since that needs to replace with an expression call
            if (node.argument && VALID_NODES[node.argument.type]) {
              expressionNode = node.argument;
              isAwaitExpression = true;
            } else return;
          }

          const context = createOptionalContext(schema);

          chainDrill(expressionNode, context);

          let statement = createStatement(context);

          if (isAwaitExpression) {
            statement = {
              arguments: [statement],
              callee: { name: 'await', type: 'Identifier' },
              type: 'CallExpression',
            };
          }

          return schema.bodyPrepend([context.declaration]).replace(statement);
        },
      };
    },
  };
}
