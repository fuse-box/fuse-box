"use strict";
const fs = require("fs");
const path = require("path");
const esprima = require("esprima");
const esquery = require("esquery");
function extractRequires(contents, absPath) {
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
exports.extractRequires = extractRequires;
class File {
    constructor(context, info) {
        this.context = context;
        this.info = info;
        this.isLoaded = false;
        this.isNodeModuleEntry = false;
        this.absPath = info.absPath;
    }
    consume() {
        if (!this.absPath) {
            return [];
        }
        if (!fs.existsSync(this.info.absDir)) {
            this.context.dump.error(this.info.fuseBoxPath, this.absPath, "Not found");
            this.contents = "";
            return [];
        }
        this.contents = fs.readFileSync(this.info.absPath).toString();
        this.isLoaded = true;
        if (this.absPath.match(/\.json$/)) {
            this.contents = "module.exports = " + this.contents;
        }
        if (this.absPath.match(/\.js$/)) {
            let reqs = extractRequires(this.contents, path.join(this.absPath));
            return reqs;
        }
        else {
            this.contents = "module.exports = " + JSON.stringify(this.contents);
            return [];
        }
    }
}
exports.File = File;
