import { utils } from "realm-utils";
import { filter } from "../Utils";

export class AutoImportedModule {
    public pkg: string;
    public statement: string;

    constructor(public variable: string, pkg: any) {
        if (utils.isPlainObject(pkg)) {
            let options: any = pkg;
            this.pkg = options.pkg;
            this.statement = options.statement;
        } else {
            this.pkg = pkg;
            this.statement = `require("${this.pkg}")`;
        }
    }

    public getImportStatement() {
        return `/* fuse:injection: */ var ${this.variable} = ${this.statement};`;
    }
}

export function registerDefaultAutoImportModules(userConfig) {
    let nativeImports: any = {};
    nativeImports.stream = new AutoImportedModule("stream", {
        pkg: "stream",
        statement: `require("stream").Stream`,
    })

    nativeImports.process = new AutoImportedModule("process", "process");
    nativeImports.Buffer = new AutoImportedModule("Buffer", {
        pkg: "buffer",
        statement: `require("buffer").Buffer`,
    });
    nativeImports.http = new AutoImportedModule("http", "http");

    return userConfig
        ? filter(nativeImports, (value, key) =>
            userConfig[key] === undefined || userConfig[key] === true)
        : nativeImports;
}
