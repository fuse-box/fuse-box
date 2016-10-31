import { Config } from './Config';
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
    entry: string;
    version: string
}
let PACKAGE_JSON_CACHE = {};
export function getPackageInformation(name: string): IPackageInformation {

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
                    entry: path.join(folder, json.main),
                    version: json.version,
                };
            } else {
                return {
                    entry: path.join(folder, "index.js"),
                    version: "0.0.0",
                }
            }
        } else {
            return {
                entry: path.join(folder, "index.js"),
                version: "0.0.0"
            }
        }
    };
    if (fs.existsSync(localLib)) {
        return readMainFile(localLib);
    } else {
        return readMainFile(modulePath);
    }
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