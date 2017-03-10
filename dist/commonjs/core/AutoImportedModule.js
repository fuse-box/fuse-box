"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const realm_utils_1 = require("realm-utils");
const Utils_1 = require("../Utils");
class AutoImportedModule {
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
exports.AutoImportedModule = AutoImportedModule;
function registerDefaultAutoImportModules(userConfig) {
    let nativeImports = {};
    nativeImports.stream = new AutoImportedModule("stream", {
        pkg: "stream",
        statement: `require("stream").Stream`,
    });
    nativeImports.process = new AutoImportedModule("process", "process");
    nativeImports.Buffer = new AutoImportedModule("Buffer", {
        pkg: "buffer",
        statement: `require("buffer").Buffer`,
    });
    nativeImports.http = new AutoImportedModule("http", "http");
    return userConfig ?
        Utils_1.filter(nativeImports, (value, key) => {
            return userConfig[key] === undefined || userConfig[key] === true;
        }) : nativeImports;
}
exports.registerDefaultAutoImportModules = registerDefaultAutoImportModules;
