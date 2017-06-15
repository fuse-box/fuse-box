import { WorkFlowContext } from "./WorkflowContext";
import { string2RegExp, ensurePublicExtension } from "../Utils";
import { FileAbstraction } from "../quantum/core/FileAbstraction";

export class QuantumItem {
    public expression: RegExp;
    public name: string;
    public entry: string;
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
    constructor(context: WorkFlowContext) { }

    public register(rule: string, bundleName: string, entryFile: string) {
        this.items.add(new QuantumItem(rule, bundleName, entryFile));
    }

    public getItems(): Set<QuantumItem> {
        return this.items;
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