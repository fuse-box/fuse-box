import { ASTNode } from "../interfaces/AST";
import { ITransformer } from "../program/transpileModule";
import { IVisit } from "../Visitor/Visitor";

export function ClassConstructorPropertyTransformer(): ITransformer {
  return (visit: IVisit) => {
    const node = visit.node;

    switch (node.type) {
      case "ParameterProperty":
        if (node.accessibility) {
          return {
            replaceWith: { type: "Identifier", name: node.parameter.name }
          };
        }

      case "BlockStatement":
        const body = node.body as Array<ASTNode>;
        const firstCallExpression = body[0];
        let insertPosition = 0;

        if (
          firstCallExpression &&
          firstCallExpression.expression &&
          firstCallExpression.expression.callee
        ) {
          insertPosition = 1;
        }

        for (let param of visit.parent.params) {
          if (param.accessibility) {
            body.splice(insertPosition, 0, {
              type: "ExpressionStatement",
              expression: {
                type: "AssignmentExpression",
                left: {
                  type: "MemberExpression",
                  object: { type: "ThisExpression" },
                  computed: false,
                  property: { type: "Identifier", name: param.parameter.name }
                },
                operator: "=",
                right: { type: "Identifier", name: param.parameter.name }
              }
            });
            insertPosition++;
          }
        }
    }
  };
}
