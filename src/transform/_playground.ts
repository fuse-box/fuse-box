import { parseAst } from './fastTransform/fastTransform';

const str = `
export { version, parse, parseExpressionAt, tokenizer, parse_dammit, LooseParser, pluginsLoose, addLooseExports, Parser, plugins, defaultOptions, Position, SourceLocation, getLineInfo, Node, TokenType, types as tokTypes, keywords$1 as keywordTypes, TokContext, types$1 as tokContexts, isIdentifierChar, isIdentifierStart, Token, isNewLine, lineBreak, lineBreakG, nonASCIIwhitespace };
`;

const tsString = `

(function (LogLevel) {
})(exports.FooBar || (exports.FooBar = {}));
`;

const o = parseAst(tsString);

// fastWalk(o, {
//   withScope: true,
//   visit: (node, props, context) => {
//     if (node.type === 'Identifier') {
//       console.log(node, context);
//     }
//   },
// });
console.log(JSON.stringify(o, null, 2));

// console.log(code);

// {
//   "type": "ExpressionStatement",
//   "expression": {
//     "type": "NewExpression",
//     "callee": {
//       "type": "Identifier",
//       "name": "foobar"
//     },
//     "arguments": []
//   }
// }

// {
//   "type": "ExpressionStatement",
//   "expression": {
//     "type": "NewExpression",
//     "callee": {
//       "type": "MemberExpression",
//       "object": {
//         "type": "Identifier",
//         "name": "o"
//       },
//       "computed": false,
//       "property": {
//         "type": "Identifier",
//         "name": "foobar"
//       }
//     },
//     "arguments": []
//   }
// }

export var HubConnectionState;
(function(HubConnectionState) {
})(HubConnectionState || (HubConnectionState = {}));
var HubConnection = /** @class */ function() {
  function HubConnection(connection, logger, protocol) {
    this.connectionState = HubConnectionState.Disconnected;
  }
};
