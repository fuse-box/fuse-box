"use strict";
const appRoot = require("app-root-path");
const esprima = require("esprima");
const esquery = require("esquery");
const path = require("path");
function extractRequires(contents, transform) {
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
            }
            else {
                if (!name.match(/^([a-z].*)$/)) {
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
exports.extractRequires = extractRequires;
function getAbsoluteEntryPath(entry) {
    if (entry[0] === "/") {
        return path.dirname(entry);
    }
    return path.join(appRoot.path, entry);
}
exports.getAbsoluteEntryPath = getAbsoluteEntryPath;
function getWorkspaceDir(entry) {
    let p = getAbsoluteEntryPath(entry);
    return path.dirname(p);
}
exports.getWorkspaceDir = getWorkspaceDir;
