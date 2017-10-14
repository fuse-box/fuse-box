//Adopted from standard-things/esm
//https://github.com/standard-things/esm

function wrap(func, wrapper) {
  return function (...args) {
    return wrapper.call(this, func, args)
  }
}

module.exports = function inject(acorn: any) {
  var tt = acorn.tokTypes;

  // modified version of parseObj from acorn/src/expression.js
  // with rest/spread code from https://github.com/babel/babylon/blob/master/src/parser/expression.js
  function parseObj(func, args) {
    let first = true
    const [isPattern, refDestructuringErrors] = args
    const node = this.startNode()
    node.properties = []
    this.next()
    
    while (!this.eat(tt.braceR)) {
      if (first) {
        first = false
      } else {
        this.expect(tt.comma)
        if (this.afterTrailingComma(tt.braceR)) {
          break
        }
      }

      let startLoc
      let startPos
      let propNode = this.startNode()
  
      if (isPattern ||
          refDestructuringErrors) {
        startPos = this.start
        startLoc = this.startLoc
      }
  
      // The rest/spread code is adapted from Babylon.
      // Copyright Babylon contributors. Released under MIT license:
      // https://github.com/babel/babylon/blob/master/src/parser/expression.js
      if (this.type === tt.ellipsis) {
        propNode = this.parseSpread()
        propNode.type = "SpreadElement"
  
        if (isPattern) {
          propNode.type = "RestElement"
          propNode.value = this.toAssignable(propNode.argument, true)
        }
  
        node.properties.push(propNode)
        continue
      }
  
      propNode.method =
      propNode.shorthand = false
  
      const isGenerator = ! isPattern && this.eat(tt.star)
  
      this.parsePropertyName(propNode)
  
      let isAsync = false
  
      if (! isPattern &&
          ! isGenerator &&
          isAsyncProp(this, propNode)) {
        isAsync = true
        this.parsePropertyName(propNode)
      }
  
      this.parsePropertyValue(propNode, isPattern, isGenerator, isAsync, startPos, startLoc, refDestructuringErrors)
      node.properties.push(this.finishNode(propNode, "Property"))
    }
  
    return this.finishNode(node, isPattern ? "ObjectPattern" : "ObjectExpression")
  }

  function toAssignable(func, args) {
    const [node] = args
  
    if (node && node.type === "ObjectExpression") {
      node.type = "ObjectPattern"
      const { properties } = node
  
      for (const propNode of properties) {
        if (propNode.kind === "init") {
          this.toAssignable(propNode.value)
        } else if (propNode.type === "SpreadElement") {
          propNode.value = this.toAssignable(propNode.argument)
        } else {
          this.raise(propNode.key.start, "Object pattern can't contain getter or setter")
        }
      }
  
      return node
    }
  
    return func.apply(this, args)
  }
  
  acorn.plugins.objRestSpread = function objectRestSpreadPlugin(parser) {
    parser.parseObj = wrap(parser.parseObj, parseObj)
    parser.toAssignable = wrap(parser.toAssignable, toAssignable)
  };

  return acorn;
};

function isAsyncProp(parser, propNode) {
  return typeof parser.isAsyncProp === "function"
    ? parser.isAsyncProp(propNode)
    : parser.toks.isAsyncProp(propNode)
}
