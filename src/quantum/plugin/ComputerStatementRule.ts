import { RequireStatement } from "../core/nodes/RequireStatement";
import { QuantumCore } from "./QuantumCore";

export class ComputedStatementRule {
    constructor(public path: string, public rules?: { mapping: string, fn: { (statement: RequireStatement, core: QuantumCore): void; } }) {

    }
}