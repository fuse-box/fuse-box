/**
 * Matches assignment
 * foo.bar = 1
 * @param node ast
 * @param part1 
 * @param part2 
 */
export function matchesAssignmentExpression(node: any, part1: string, part2: string): boolean {
    if (node.type === "ExpressionStatement") {
        if (node.expression && node.expression.type === "AssignmentExpression") {
            const expr = node.expression;

            if (expr.left && expr.left.type === "MemberExpression") {
                const left = expr.left;

                let part1Matched = false;
                let part2Matched = false;
                if (left.object && left.object.type === "Identifier") {
                    if (left.object.name === part1) {
                        part1Matched = true;
                    }
                }
                if (left.property && left.property.type === "Identifier") {
                    if (left.property.name === part2) {
                        part2Matched = true;
                    }
                }
                return part1Matched && part2Matched;
            }
        }
    }
}

export function matchesLiteralStringExpression(node: any, text: string) {
    return node.type === "ExpressionStatement"
        && node.expression.type === "Literal"
        && node.expression.value === text
}

export function matchesSingleFunction(node: any, name: string) {
    return node.callee && node.callee.type === "Identifier" && node.callee.name === "require"
}

export function matchesDoubleMemberExpression(node: any, part1: string, part2?: string) {
    const matches = node.type === "MemberExpression"
        && node.object
        && node.object.type === "Identifier"
        && node.object && node.object.name === part1 && node.property

    if (!part2) {
        return matches;
    }

    return node.property && node.property.name === part2;
}
export function matcheObjectDefineProperty(node, name: string) {
    if (astQuery(node, ["/ExpressionStatement", ".expression", "/CallExpression",
        ".callee", "/MemberExpression",
        ".object",
        ".name"], "Object")) {
        return astQuery(node, ["/ExpressionStatement", ".expression", "/CallExpression", ".arguments", 0, ".name"], name)
    }
}

export function astQuery(node, args: any[], value: string) {
    let obj = node;
    for (const i in args) {
        if (obj === undefined) {
            return;
        }
        let spec = args[i];
        let item;

        let lookForType = false;
        let lookForProp = false;
        if (typeof spec === "number") {
            item = spec;

            lookForProp = true;
        } else {
            item = spec.slice(1);

            if (spec.charAt(0) === "/") {
                lookForType = true;
            }
            if (spec.charAt(0) === ".") {
                lookForProp = true;
            }
        }

        if (lookForType) {
            if (!obj.type) {
                return;
            }
            if (obj.type !== item) {
                obj = undefined;
            }
        }
        if (lookForProp) {
            obj = obj[item];
        }
    }
    return obj === value;
}