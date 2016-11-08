import { Config } from "./Config";
const appRoot = require("app-root-path");
const esprima = require("esprima");
const esquery = require("esquery");
import * as path from "path";
import * as fs from "fs";
export interface RequireOptions {
    name: string,
    str: string
}
export interface IPackageInformation {
    name: string;
    entry: string;
    version: string;
    root: string;
}
let PACKAGE_JSON_CACHE = {};
export function getPackageInformation(name: string, parent?: IPackageInformation): IPackageInformation {

    let localLib = path.join(Config.LOCAL_LIBS, name);
    let modulePath = path.join(Config.NODE_MODULES_DIR, name);
    let readMainFile = (folder) => {
        // package.json path
        let packageJSONPath = path.join(folder, "package.json");
        if (fs.existsSync(packageJSONPath)) {
            // read contents
            let json: any;
            if (PACKAGE_JSON_CACHE[packageJSONPath]) {
                json = PACKAGE_JSON_CACHE[packageJSONPath]
            } else {
                json = JSON.parse(fs.readFileSync(packageJSONPath).toString())// require(packageJSONPath);
                PACKAGE_JSON_CACHE[packageJSONPath] = json;
            }

            // Getting an entry point
            if (json.main) {
                return {
                    name: name,
                    root: folder,
                    entry: path.join(folder, json.main),
                    version: json.version,
                };
            } else {
                return {
                    name: name,
                    root: folder,
                    entry: path.join(folder, "index.js"),
                    version: "0.0.0",
                }
            }
        } else {
            return {
                name: name,
                root: folder,
                entry: path.join(folder, "index.js"),
                version: "0.0.0"
            }
        }
    };

    if (parent) {// handle a conflicting library
        if (parent.root) {
            let nestedNodeModule = path.join(parent.root, "node_modules", name);
            if (fs.existsSync(nestedNodeModule)) {
                return readMainFile(nestedNodeModule);
            }
        }
    }
    if (fs.existsSync(localLib)) {
        return readMainFile(localLib);
    } else {
        return readMainFile(modulePath);
    }
}

export function ensureRelativePath(name: string, absPath: string) {

    // If we have it explicit here, we assume that we are refering to a folder
    if (name.match(/\/$/)) {

        // require("./foo/") becomes ./foo/index.js
        return path.join(name, "index.js")
    } else {
        if (!name.match(/^([a-z].*)$/)) { // make sure it's not a node_module

            if (!name.match(/.js$/)) {

                let folderDir = path.join(path.dirname(absPath), name, "index.js");
                if (fs.existsSync(folderDir)) {
                    let startsWithDot = name[0] === "."; // After transformation we need to bring the dot back
                    name = path.join(name, "/", "index.js"); // detecting a real relative path
                    if (startsWithDot) {
                        // making sure we are not modifying it and converting to
                        // what can be take for node_module
                        // For example: ./foo if a folder, becomes "foo/index.js",
                        // whereas foo can be interpreted as node_module
                        name = `./${name}`;
                    }
                } else {
                    name = name + ".js";
                }
            }
        }
    }
    return name;
}
/**
 *
 *
 * @export
 * @param {string} contents
 * @returns
 */
export function extractRequires(contents: string, absPath: string): string[] {
    let ast = esprima.parse(contents);
    let matches = esquery(ast, "CallExpression[callee.name=\"require\"]");
    let results = [];
    matches.map(item => {
        if (item.arguments.length > 0) {
            let name = item.arguments[0].value;
            if (!name) {
                return;
            }
            results.push(name);
        }
    });
    return results;
}

export interface INodeModuleRequire {
    name: string;
    target?: string;
}
/* getNodeModuleName
    * GEtting a real module name
    * Sometimes a require statement might contain
    * require(lodash/map)
    * In this case we interested only in "lodash" part
    *
    * @param {string} name
    * @returns {string}
    *
    * @memberOf ModuleCollection
    */
export function getNodeModuleName(name: string): INodeModuleRequire {
    if (!name) {
        return;
    }
    let matched = name.match(/^([a-z].*)$/);
    if (matched) {
        let data = name.split(/\/(.+)?/);
        return {
            name: data[0],
            target: data[1],
        }
    }
}

export function getAbsoluteEntryPath(entry: string): string {
    if (entry[0] === "/") {
        return path.dirname(entry);
    }
    return path.join(appRoot.path, entry);
}

// export function getWorkspaceDir(entry: string): string {
//     let p = getAbsoluteEntryPath(entry);
//     return path.dirname(p);
// }