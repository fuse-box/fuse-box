import { File } from "../File";
import { WorkFlowContext } from "./../WorkflowContext";
import { Plugin } from "../WorkflowContext";
export declare class FuseBoxCSSPlugin implements Plugin {
    test: RegExp;
    init(context: WorkFlowContext): void;
    transform(file: File): void;
}
export declare const CSSPlugin: FuseBoxCSSPlugin;
