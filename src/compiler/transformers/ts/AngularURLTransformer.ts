import { IVisit } from '../../Visitor/Visitor';
import { ITransformer } from '../../program/transpileModule';
import { ITransformerSharedOptions } from '../../interfaces/ITransformerSharedOptions';
import { ASTNode } from '../../interfaces/AST';
import { createRequireCallExpression } from '../../Visitor/helpers';
import { ImportType } from '../../interfaces/ImportType';

const PropKeys = { templateUrl: 'template', styleUrls: 'styles' };
export function AngularURLTransformer(opts: ITransformerSharedOptions): ITransformer {
  opts = opts || {};
  return (visit: IVisit) => {
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
              if (opts.onRequireCallExpression) opts.onRequireCallExpression(ImportType.REQUIRE, req);
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
          if (opts.onRequireCallExpression) opts.onRequireCallExpression(ImportType.REQUIRE, node.value);
        }
        if (keyTransformRequired) node.key.name = PropKeys[node.key.name];
      }
    }
  };
}
