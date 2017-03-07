import { utils } from 'realm-utils';

export class HeaderImport {
    public pkg: string;
    public statement: string;
    constructor(public variable: string, pkg: any) {
        if (utils.isPlainObject(pkg)) {
            let options : any = pkg;
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

export class HeaderImportCollection {
    public collection = new Map<string, HeaderImport>();

    public add(config: HeaderImport) {
        this.collection.set(config.variable, config);
    }

    public get(variable: string): HeaderImport {
        return this.collection.get(variable);
    }

    public has(variable: string): Boolean {
        return this.collection.get(variable) !== undefined;
    }
}

// Basically initiate it only once
let headerCollection: HeaderImportCollection;
if (!headerCollection) {
    headerCollection = new HeaderImportCollection(); ;
}
// register native variables
headerCollection.add(new HeaderImport('process', 'process'));
headerCollection.add(new HeaderImport('Buffer', {
    pkg: 'buffer',
    statement: `require("buffer").Buffer`,
}));

headerCollection.add(new HeaderImport('http', 'http'));

export const nativeModules = headerCollection;
