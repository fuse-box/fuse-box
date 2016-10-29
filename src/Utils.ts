const appRoot = require("app-root-path");
const esprima = require("esprima");
const esquery = require("esquery");
import * as path from "path";
export interface RequireOptions {
    name: string,
    str: string
}

/**
 *
 *
 * @export
 * @param {string} contents
 * @returns
 */
export function extractRequires(contents: string, transform: boolean): RequireOptions[] {


    let ast = esprima.parse(contents);
    let matches = esquery(ast, "CallExpression[callee.name=\"require\"]");
    let results = [];
    matches.map(item => {
        if (item.arguments.length > 0) {
            let name = item.arguments[0].value;
            if (!name) {
                return;
            }
            if (name.match(/\/$/)) {
                name = name + "index.js";
            } else {
                if (!name.match(/^([a-z].*)$/)) { // make sure it's not a node_module
                    if (!name.match(/.js/)) {
                        name = name + ".js";
                    }
                }
            }
            results.push({ name: name });
        }
    });
    return results;
}


export function getAbsoluteEntryPath(entry: string): string {
    if (entry[0] === "/") {
        return path.dirname(entry);
    }
    return path.join(appRoot.path, entry);
}

export function getWorkspaceDir(entry: string): string {
    let p = getAbsoluteEntryPath(entry);
    return path.dirname(p);
}