import { WorkFlowContext } from "./WorkflowContext";
import * as path from "path";

const NODE_MODULE = /^([a-z].*)$/;

export interface PathInformation {
    isNodeModule : boolean;
}
/**
 * PathMaster
 */
export class PathMaster {
    constructor(public context: WorkFlowContext, public moduleRoot?: string) { }

    public resolve(name: string, root: string) : PathInformation {
        let isNodeModule =  NODE_MODULE.test(name);
        if ( isNodeModule){

        }
        return {
            isNodeModule : isNodeModule
        };
    }
}
