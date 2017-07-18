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

const ES6_TYPES = new Set([
    "ClassDeclaration",
    "SpreadElement",
    "ArrowFunctionExpression"
]);

export function matchesIfStatementProcessEnv(node): string {
    if (node.type && node.type === "IfStatement") {
        if (node.test && node.test.type === "BinaryExpression") {
            if (node.test.left) {
                const variableName = matchesNodeEnv(node.test.left);
                return variableName;
            }
        }
    }
}

export function matchesIfStatementFuseBoxIsEnvironment(node) {
    if (node.type && node.type === "IfStatement") {
        if (node.test && node.test.type === "MemberExpression") {
            const test = node.test;
            if (test.object.type === "Identifier" && test.object.name === "FuseBox" && test.property) {
                return test.property.name;
            }
        }
    }
}
export function compareStatement(node: any, input: string | undefined) {
    const right = node.test.right;

    if (right) {
        const operator = node.test.operator;
        if (right.type === "Literal") {
            const value = right.value;


            if (operator === "===" || operator === "==") {
                //if ( "production" === "production" ) {}
                return value === input;
            }
            if (operator === "!==" || operator === "!=") {
                //if ( "production" !== "production" ) {}
                return value !== input;
            }
        }
        if (right.type === "Identifier" && right.name === "undefined") {
            if (operator === "!==" || operator === "!=") {
                return input !== undefined;
            }
            if (operator === "===" || operator === "==") {
                return input === undefined;
            }
        }

    }
}

export function matchesNodeEnv(node, veriableName?: string) {
    let isProcess, isEnv;
    isProcess = astQuery(node,
        ["/MemberExpression", ".object", "/MemberExpression", ".object", ".name"], 'process')
    if (!isProcess) {
        return false
    }
    isEnv =
        astQuery(node, ["/MemberExpression", ".object", "/MemberExpression", ".property", ".name"], "env");
    if (!isEnv) {
        return false;
    }
    if (node.property) {
        let value;
        if (node.property.type === "Literal") {
            value = node.property.value;
        }
        if (node.property.type === "Identifier") {
            value = node.property.name;
        }
        return veriableName !== undefined ? veriableName === value : value;
    }
}


export function matchesEcmaScript6(node) {
    if (node) {
        if (ES6_TYPES.has(node.type)) {
            return true;
        }
        if (node.type === "VariableDeclaration" && node.kind !== "var") {
            return true;
        }
    }
    return false;
}
export function matchesSingleFunction(node: any, name: string) {
    return node.callee && node.callee.type === "Identifier" && node.callee.name === name
}

export function trackRequireMember(node: any, name: string): string {
    if (node && node.type === "MemberExpression") {
        if (node.object && node.object.type === "Identifier" && node.object.name === name) {
            if (node.property && node.property.type === "Identifier") {
                return node.property.name;
            }
        }
    }
}

export function matchRequireIdentifier(node: any): string {
    let name;
    if (node && node.type === "VariableDeclarator") {
        if (node.id && node.id.type === "Identifier") {
            name = node.id.name;
            if (node.init && node.init.type === "CallExpression") {
                if (matchesSingleFunction(node.init, "require")) {
                    return name;
                }
            }
        }
    }
}

export function matchesTypeOf(node: any, name: string) {
    return node && node.operator === "typeof"
        && node.argument && node.argument.type === "Identifier" && node.argument.name === name;
}


export function isExportComputed(node: any, fn: { (result: boolean) }) {
    if (astQuery(node, [
        "/MemberExpression", ".object", ".name"
    ], "exports")) {
        return fn(node.computed === true);
    }
}

export function isExportMisused(node: any, fn: { (name: string) }) {
    const isMisused = astQuery(node, [
        "/MemberExpression", ".object", "/MemberExpression",
        ".object", ".name"
    ], "exports");
    if (isMisused) {
        if (node.object.property && node.object.property.name) {
            return fn(node.object.property.name);
        }
    }
}
export function matchNamedExport(node: any, fn: any) {
    if (astQuery(node, ["/ExpressionStatement",
        ".expression", "/AssignmentExpression", ".left", "/MemberExpression",
        ".object", ".name"], "exports")) {
        if (node.expression.left.property.type === "Identifier") {
            fn(node.expression.left.property.name);
            return true;
        }
    }
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

export function matchesExportReference(node: any): string {
    if (node.type === "MemberExpression"
        && node.object
        && node.object.type === "Identifier"
        && node.object && node.object.name === "exports" && node.property) {
        if (node.property.type === "Identifier") {
            return node.property.name;
        }
    }
}
export function matcheObjectDefineProperty(node, name: string) {
    if (astQuery(node, ["/ExpressionStatement", ".expression", "/CallExpression",
        ".callee", "/MemberExpression",
        ".object",
        ".name"], "Object")) {
        return astQuery(node, ["/ExpressionStatement", ".expression", "/CallExpression", ".arguments", 0, ".name"], name)
    }
}

export function astQuery(node, args: any[], value?: string) {
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
    if (value !== undefined) {
        return obj === value;
    }
    return obj;
}