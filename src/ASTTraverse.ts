export class ASTTraverse {
    public static traverse(root, options) {

        options = options || {};
        const pre = options.pre;
        //        const post = options.post;
        const skipProperty = options.skipProperty;

        let visit = (node, parent, prop?, idx?) => {

            if (!node || typeof node.type !== "string") {
                return;
            }
            if (node._visited) {
                return;
            }
            node.$parent = parent;
            node.$prop = prop;
            node.$idx = idx;
            let res = undefined;
            if (pre) {
                res = pre(node, parent, prop, idx);
            }

            node._visited = true;

            if (typeof res === "object" && res.type) {
                return visit(res, null);
            }

            if (res !== false) {
                for (let prop in node) {
                    if (skipProperty ? skipProperty(prop, node) : prop[0] === "$") {
                        continue;
                    }
                    let child = node[prop];
                    if (Array.isArray(child)) {
                        for (let i = 0; i < child.length; i++) {
                            visit(child[i], node, prop, i);
                        }
                    } else {
                        visit(child, node, prop);
                    }
                }
            }
            // if (post) {
            //     post(node, parent, prop, idx);
            // }
        };
        visit(root, null);
    }
}
