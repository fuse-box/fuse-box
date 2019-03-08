export function walkAST(
  root,
  options: { onNode?: (node, parent, prop, idx) => any; skipProperty?: (prop, node) => boolean },
) {
  options = options || {};

  //        const post = options.post;
  const skipProperty = options.skipProperty;

  let visit = (node, parent, prop?, idx?) => {
    if (!node || typeof node.type !== 'string') {
      return;
    }
    if (node._visited) {
      return;
    }
    //node.$parent = parent;
    node.$prop = prop;
    node.$idx = idx;
    const res = options.onNode(node, parent, prop, idx);
    node._visited = true;

    if (typeof res === 'object' && res.type) {
      return visit(res, null);
    }

    if (res !== false) {
      for (let prop in node) {
        if (skipProperty ? skipProperty(prop, node) : prop[0] === '$') {
          continue;
        }
        let child = node[prop];
        if (Array.isArray(child)) {
          for (let i = 0; i < child.length; i++) {
            const shiftIndex = visit(child[i], node, prop, i);
            if (shiftIndex && typeof shiftIndex === 'number') {
              i = i + shiftIndex;
            }
          }
        } else {
          visit(child, node, prop);
        }
      }
    }
  };
  visit(root, null);
}
