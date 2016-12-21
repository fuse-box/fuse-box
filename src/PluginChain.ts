import { camelCase } from './Utils';
import { WorkFlowContext } from "./WorkflowContext";
import { File } from "./File";


export class PluginChain {
    public context: WorkFlowContext;
    public methodName: string;
    constructor(name: string, public file: File, public opts?: any) {
        let methodName = camelCase(name);
        this.methodName = `on${methodName.charAt(0).toUpperCase() + methodName.slice(1)}Chain`;
    }

    public setContext(context: WorkFlowContext) {
        this.context = context;
    }
}