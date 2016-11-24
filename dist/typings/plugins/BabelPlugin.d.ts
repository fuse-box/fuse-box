import { File } from "../File";
import { WorkFlowContext } from "./../WorkflowContext";
import { Plugin } from "../WorkflowContext";
export declare class BabelPlugin implements Plugin {
    test: RegExp;
    context: WorkFlowContext;
    init(context: WorkFlowContext): void;
    transform(file: File, ast: any): Promise<{}>;
}
