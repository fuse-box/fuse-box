import { WorkFlowContext } from "../../index";

export interface QuantumSplitResolveConfiguration {
    browser?: string;
    server?: string;
    dest?: string;
}

export class QuantumSplitConfig {
    public resolveOptions : QuantumSplitResolveConfiguration
    constructor(public context: WorkFlowContext) {

    }

    public getBrowserPath(){
        if ( this.resolveOptions && this.resolveOptions.browser ){
            return this.resolveOptions.browser;
        }
        return "./";
    }

    public getServerPath(){
        if ( this.resolveOptions && this.resolveOptions.server ){
            return this.resolveOptions.server;
        }
        return "./";
    }

    public getDest(){
        if ( this.resolveOptions && this.resolveOptions.dest ){
            return this.resolveOptions.dest;
        }
        return "./";
    }

    public namedItems = new Map<string, string>();
    public register(name: string, entry: string) {
        this.namedItems.set(name, entry);
    }

    public byName(name: string): string {
        return this.namedItems.get(name);
    }
}