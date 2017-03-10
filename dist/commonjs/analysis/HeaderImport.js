"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const realm_utils_1 = require("realm-utils");
class HeaderImport {
    constructor(variable, pkg) {
        this.variable = variable;
        if (realm_utils_1.utils.isPlainObject(pkg)) {
            let options = pkg;
            this.pkg = options.pkg;
            this.statement = options.statement;
        }
        else {
            this.pkg = pkg;
            this.statement = `require("${this.pkg}")`;
        }
    }
    getImportStatement() {
        return `/* fuse:injection: */ var ${this.variable} = ${this.statement};`;
    }
}
exports.HeaderImport = HeaderImport;
class HeaderImportCollection {
    constructor() {
        this.collection = new Map();
    }
    add(config) {
        this.collection.set(config.variable, config);
    }
    get(variable) {
        return this.collection.get(variable);
    }
    has(variable) {
        return this.collection.get(variable) !== undefined;
    }
}
exports.HeaderImportCollection = HeaderImportCollection;
let headerCollection;
if (!headerCollection) {
    headerCollection = new HeaderImportCollection();
    ;
}
headerCollection.add(new HeaderImport("stream", {
    pkg: "stream",
    statement: `require("stream").Stream`,
}));
headerCollection.add(new HeaderImport("process", "process"));
headerCollection.add(new HeaderImport("Buffer", {
    pkg: "buffer",
    statement: `require("buffer").Buffer`,
}));
headerCollection.add(new HeaderImport("http", "http"));
exports.nativeModules = headerCollection;
