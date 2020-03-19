import { path2RegexPattern } from '../../../utils/utils';
import { ISchema } from '../../core/nodeSchema';
import { ASTNode } from '../../interfaces/AST';
import { ITransformer } from '../../interfaces/ITransformer';

export interface CSSInJSXTransformerOptions {
  autoInject?: boolean;
  autoLabel?: boolean;
  cssPropOptimization?: boolean;
  emotionCoreAlias?: string;
  jsxFactory?: string;
  labelFormat?: string;
  module?: any;
  sourceMap?: boolean;
  test?: RegExp | string;
}

const labelMapping = {
  '[dirname]': '',
  '[filename]': '',
  '[local]': '',
};

/**
 * 1. compare minifiers styled-components and emotion
 * 2. don't reinvent the wheel..
 * 3. find a place for these helper functions..
 */
// From https://github.com/styled-components/babel-plugin-styled-components/blob/master/src/minify/index.js#L58
// Counts occurences of substr inside str
const countOccurences = (str, substr) => str.split(substr).length - 1;
const compressSymbols = code =>
  code.split(/(\s*[;:{},]\s*)/g).reduce((str, fragment, index) => {
    // Even-indices are non-symbol fragments
    if (index % 2 === 0) {
      return str + fragment;
    }

    // Only manipulate symbols outside of strings
    if (countOccurences(str, "'") % 2 === 0 && countOccurences(str, '"') % 2 === 0) {
      return str + fragment.trim();
    }

    return str + fragment;
  }, '');

// Super simple minifier.. doesn't cover any edge cases or side effects
const minify = (value: string): string => compressSymbols(value.replace(/[\n]\s*/g, ''));

/**
 * @todo
 * 1. expand the minify (way to simple :P)
 *
 * 2. Components as selectors
 * 3. Minification
 * 4. Sourcemaps
 * 5. Minify configurable?
 *
 * 5. Dead Code Elimination // not needed??
 */
export function CSSInJSXTransformer(options?: CSSInJSXTransformerOptions): ITransformer {
  const {
    autoInject = true,
    autoLabel = true,
    // cssPropOptimization = true,
    emotionCoreAlias = '@emotion/core',
    jsxFactory = 'jsx',
    labelFormat = '[dirname]--[local]',
    test = /\.(js|jsx|ts|tsx)$/,
    // sourceMap = true
  } = options;

  const testPathRegex = path2RegexPattern(test);
  const emotionLibraries = [[emotionCoreAlias, 'emotion'], ['@emotion/styled']];
  // const reactLibrary = 'react';

  function renderAutoLabel(): ASTNode {
    return {
      type: 'Literal',
      value: `label:${labelFormat
        .replace(/\[local\]|\[filename\]|\[dirname\]/gi, m => labelMapping[m])
        .replace(/\-\-$/, '')};`,
    };
  }

  return {
    target: { test: testPathRegex },
    commonVisitors: props => {
      const isProduction = false;
      const {
        transformationContext: { compilerOptions, module },
      } = props;

      // Keep track of imported emotion functions.
      // Allows us to look for custom imports
      // import { css as emotionCss } from '@emotion/core'
      const importedEmotionFunctions = [];
      let needsInjection = true;

      // Check if we're executing an emotion call in this file
      function isEmotionCall(node: ASTNode, index: string): boolean {
        return (
          // css('styles')
          importedEmotionFunctions.indexOf(node[index].name) > -1 ||
          // styled('obj')('styles')
          importedEmotionFunctions.indexOf(node[index].callee && node[index].callee.name) > -1 ||
          // styled.div('div')
          importedEmotionFunctions.indexOf(node[index].object && node[index].object.name) > -1
        );
      }

      const compilerJsxFactory = compilerOptions.jsxFactory;

      // Process dirName and fileName only once per file
      const filePath = module.publicPath.replace(/\.([^.]+)$/, '');
      labelMapping['[dirname]'] = filePath.replace(/(\\|\/)/g, '-');
      labelMapping['[filename]'] = filePath.replace(/(.+)(\\|\/)(.+)$/, '$3');

      return {
        onEach: (schema: ISchema) => {
          const { node, parent, replace } = schema;

          switch (node.type) {
            case 'CallExpression':
              // append the css class label
              if (autoLabel && !parent.callee && isEmotionCall(node, 'callee')) {
                labelMapping['[local]'] =
                  (parent.type === 'VariableDeclarator' && parent.id.name) ||
                  (parent.type === 'AssignmentExpression' && parent.left.property.name) ||
                  '';
                node.arguments.push(renderAutoLabel());
              }
              break;

            // case 'JSXElement':
            //   if (!cssPropOptimization) {
            //     break;
            //   }
            //   const {
            //     openingElement: { attributes },
            //   } = node;
            //   const attrLength = attributes.length;
            //   if (attrLength === 0) {
            //     break;
            //   }
            //   for (let i = 0; i < attrLength; i++) {
            //     let { name, type, value } = attributes[i]; // call 'attr' once
            //     if (type !== 'JSXAttribute' || name.name !== 'css') {
            //       continue;
            //     }
            //     if (value.expression.type === 'ObjectExpression' || value.expression.type === 'ArrayExpression') {
            //       // css prop optimization
            //       // console.log(name, value);
            //     }
            //   }
            //   break;

            case 'TaggedTemplateExpression':
              if (isEmotionCall(node, 'tag')) {
                let {
                  quasi: { expressions, quasis },
                  tag: callee,
                } = node;

                // Convert template strings to a literal and put the expressions back at it's position
                const styleProperties = [];
                const quasisLength = quasis.length;
                let i = 0;
                while (i < quasisLength) {
                  if (quasis[i].value.cooked) {
                    // We don't need minification in devMode!
                    styleProperties.push({
                      type: 'Literal',
                      value: isProduction ? quasis[i].value.cooked : minify(quasis[i].value.cooked),
                    });
                  }
                  // Put the expressions back in the place where they belong
                  if (!quasis[i].tail && expressions.length > 0) {
                    styleProperties.push(expressions.shift());
                  }
                  i++;
                }

                // Replace this node with new shiny stuff
                return replace({
                  arguments: styleProperties.filter(Boolean),
                  callee,
                  type: 'CallExpression',
                });
              }
              break;
          }
        },
        onProgramBody: (schema: ISchema) => {
          const { context, node } = schema;

          if (node.type === 'ImportDeclaration') {
            if (compilerJsxFactory === 'jsx') {
              // @todo:
              // fix this, always insert if it's jsx
            }

            if ([].concat(emotionLibraries[0], emotionLibraries[1]).indexOf(node.source.value) > -1) {
              const specifiersLength = node.specifiers.length;
              let i = 0;
              while (i < specifiersLength) {
                if (node.specifiers[i].imported && node.specifiers[i].imported.name === 'jsx') {
                  needsInjection = false;
                  // @todo:
                  // fix this, remove specifier if compilerJsxFactory === 'jsx'

                  // set the globalContext.jsxFactory for the JSXTransformer
                  context.jsxFactory = node.specifiers[i].local.name;
                  // visit.globalContext.jsxFactory = node.specifiers[i].local.name;
                } else {
                  importedEmotionFunctions.push(node.specifiers[i].local.name);
                }
                i++;
              }

              if (autoInject && needsInjection && emotionLibraries[0].indexOf(node.source.value) > -1) {
                needsInjection = false;

                // set the globalContext.jsxFactory for the JSXTransformer
                if (node.source.value === emotionCoreAlias) {
                  // visit.globalContext.jsxFactory = jsxFactory;
                  context.jsxFactory = jsxFactory;
                }
                node.specifiers.push({
                  imported: {
                    name: 'jsx',
                    type: 'Identifier',
                  },
                  local: {
                    name: jsxFactory,
                    type: 'Identifier',
                  },
                  type: 'ImportSpecifier',
                });
              }
            }
          }
        },
      };
    },
  };
}
