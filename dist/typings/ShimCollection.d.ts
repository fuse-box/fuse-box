import { ModuleCollection } from "./core/ModuleCollection";
import { WorkFlowContext } from "./core/WorkflowContext";
/**
 *
 *
 * @export
 * @class ShimCollection
 */
export declare class ShimCollection {
    /**
     *
     *
     * @static
     * @param {WorkFlowContext} context
     * @param {string} name
     * @param {string} exports
     *
     * @memberOf ShimCollection
     */
    static create(context: WorkFlowContext, name: string, exports: string): ModuleCollection;
}
