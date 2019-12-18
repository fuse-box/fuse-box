import { ASTNode } from '../../interfaces/AST';
import { ImportType } from '../../interfaces/ImportType';
import { ITransformer } from '../../interfaces/ITransformer';
import { createRequireCallExpression } from '../../Visitor/helpers';
import { IVisit, IVisitorMod } from '../../Visitor/Visitor';

const PropKeys = { templateUrl: 'template', styleUrls: 'styles' };

export function AngularURLTransformer(test: RegExp): ITransformer {
  return {
    target: { test: test },
    commonVisitors: props => {
      return {
        onEachNode: (visit: IVisit): IVisitorMod => {
          const { node } = visit;
          if (node.type === 'Property') {
            if (PropKeys[node.key.name]) {
              const value = node.value as ASTNode;
              let keyTransformRequired = false;
              // transform styleUrls
              if (value.type === 'ArrayExpression') {
                let i = 0;
                while (i < value.elements.length) {
                  const el = value.elements[i] as ASTNode;
                  if (el.type === 'Literal') {
                    keyTransformRequired = true;
                    const req = createRequireCallExpression([el]);
                    // emit require statement
                    if (props.onRequireCallExpression) props.onRequireCallExpression(ImportType.REQUIRE, req);
                    value.elements[i] = req;
                  }
                  i++;
                }
              }
              // transform templateUrl
              else if (value.type === 'Literal') {
                keyTransformRequired = true;
                node.value = createRequireCallExpression([value]);

                // emit require statement
                if (props.onRequireCallExpression) props.onRequireCallExpression(ImportType.REQUIRE, node.value);
              }
              if (keyTransformRequired) node.key.name = PropKeys[node.key.name];
            }
          }
          return;
        },
      };
    },
  };
}
