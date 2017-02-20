
export class HeaderImport {
    constructor(public variable: string, public pkg: string) {

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
    headerCollection = new HeaderImportCollection();;
}
// register native variables
headerCollection.add(new HeaderImport("process", "process"));
headerCollection.add(new HeaderImport("Buffer", "buffer"));
headerCollection.add(new HeaderImport("http", "http"));

export const nativeModules = headerCollection;