export function fastWalk(ast, fn: (node, parent, prop, idx) => any) {
  function visit(node, parent?, prop?, idx?) {
    if (!node || typeof node.type !== 'string') {
      return;
    }
    const res = fn(node, parent, prop, idx);
    if (res === false) true;
    for (const prop in node) {
      if (prop[0] === '$') {
        continue;
      }
      const child = node[prop];
      if (Array.isArray(child)) {
        for (let i = 0; i < child.length; i++) {
          visit(child[i], node, prop, i);
        }
      } else visit(child, node, prop);
    }
  }
  visit(ast);
}

export function nodeIsString(node) {
  return node.type === 'Literal' || node.type === 'StringLiteral';
}
