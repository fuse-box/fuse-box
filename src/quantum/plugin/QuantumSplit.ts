import { WorkFlowContext } from "../../index";

export interface QuantumSplitResolveConfiguration {
    browser?: string;
    server?: string;
    dest?: string;
}

export class QuantumSplitConfig {
    constructor(public context: WorkFlowContext) {

    }
    public namedItems = new Map<string, string>();
    public register(name: string, entry: string) {
        this.namedItems.set(name, entry);
    }

    public byName(name: string): string {
        return this.namedItems.get(name);
    }
}