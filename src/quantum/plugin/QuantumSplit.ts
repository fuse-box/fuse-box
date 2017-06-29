
import { FileAbstraction } from "../core/FileAbstraction";
import { WorkFlowContext } from "../../core/WorkflowContext";
import { string2RegExp, ensurePublicExtension, joinFuseBoxPath } from "../../Utils";

export interface QuantumSplitResolveConfiguration {
    browser?: string;
    server?: string;
    dest?: string;
}


export class QuantumItem {
    public expression: RegExp;
    public name: string;
    public entry: string;
    public entryId: any;
    private abstractions = new Set<FileAbstraction>();
    constructor(rule: string, bundleName: string, entryFile: string) {
        this.expression = string2RegExp(rule);
        this.name = bundleName;
        this.entry = ensurePublicExtension(entryFile);
    }

    public getFiles(): Set<FileAbstraction> {
        return this.abstractions;
    }
    public addFile(file: FileAbstraction) {
        this.abstractions.add(file);
    }

    public matches(path: string) {
        return this.expression.test(path);
    }
}
export class QuantumSplitConfig {
    public items = new Set<QuantumItem>();
    public resolveOptions: QuantumSplitResolveConfiguration = {};
    constructor(context: WorkFlowContext) { }

    public register(rule: string, bundleName: string, entryFile: string) {
        this.items.add(new QuantumItem(rule, bundleName, entryFile));
    }


    public resolve(name: string): string {
        return joinFuseBoxPath(this.resolveOptions.dest ? this.resolveOptions.dest : "", name);
    }
    public getItems(): Set<QuantumItem> {
        return this.items;
    }

    public findByEntry(file: FileAbstraction): QuantumItem {
        let config;
        this.items.forEach(value => {
            if (value.entry === file.fuseBoxPath) {
                config = value;
            }
        });
        return config;
    }

    public matches(path: string): QuantumItem {
        let target: QuantumItem;
        this.items.forEach(item => {
            if (item.matches(path)) {
                target = item;
            }
        });
        return target;
    }
}