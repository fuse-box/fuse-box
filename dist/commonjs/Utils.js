"use strict";
const Config_1 = require('./Config');
const appRoot = require("app-root-path");
const esprima = require("esprima");
const esquery = require("esquery");
const path = require("path");
const fs = require("fs");
function getPackageInformation(name) {
    let localLib = path.join(Config_1.Config.LOCAL_LIBS, name);
    let modulePath = path.join(Config_1.Config.NODE_MODULES_DIR, name);
    let readMainFile = (folder) => {
        let packageJSONPath = path.join(folder, "package.json");
        if (fs.existsSync(packageJSONPath)) {
            let json = require(packageJSONPath);
            if (json.main) {
                return {
                    entry: path.join(folder, json.main),
                    version: json.version,
                };
            }
            else {
                return {
                    entry: path.join(folder, "index.js"),
                    version: "0.0.0",
                };
            }
        }
        else {
            return {
                entry: path.join(folder, "index.js"),
                version: "0.0.0"
            };
        }
    };
    if (fs.existsSync(localLib)) {
        return readMainFile(localLib);
    }
    else {
        return readMainFile(modulePath);
    }
}
exports.getPackageInformation = getPackageInformation;
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
