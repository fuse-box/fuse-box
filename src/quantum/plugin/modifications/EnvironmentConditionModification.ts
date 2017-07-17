import { each } from "realm-utils";
import { FileAbstraction } from "../../core/FileAbstraction";
import { QuantumCore } from "../QuantumCore";
import { ReplaceableBlock } from "../../core/nodes/ReplaceableBlock";

export class EnvironmentConditionModification {
    public static perform(core: QuantumCore, file: FileAbstraction) {
        // FuseBox.isServer

        return each(file.fuseboxIsEnvConditions, (replacable: ReplaceableBlock) => {

            if (core.opts.isTargetUniveral()) {
                if (replacable.identifier === "isServer") {
                    replacable.setFunctionName("$fsx.cs");
                }
                if (replacable.identifier === "isBrowser") {
                    replacable.setFunctionName("$fsx.cb");
                }
            } else {
                if (replacable.isConditional) {
                    replacable.handleActiveCode();
                } else {
                    replacable.replaceWithValue();
                }
            }
        });
        // return each(file.fuseboxIsServerConditions, (isServerCondition: FuseBoxIsServerCondition) => {
        //     if (core.opts.isTargetUniveral()) {
        //         core.api.addIsServerFunction();
        //         isServerCondition.setFunctionName("$fsx.cs");
        //     } else {
        //         if (core.opts.isTargetBrowser()) {
        //             isServerCondition.setFunctionName("false");
        //         }
        //         if (core.opts.isTargetServer()) {
        //             isServerCondition.setFunctionName("true");
        //         }
        //     }
        // }).then(() => {

        //     return each(file.fuseboxIsBrowserConditions, (isBrowserCondition: FuseBoxIsBrowserCondition) => {

        //         if (core.opts.isTargetUniveral()) {
        //             core.api.addIsBrowserFunction();
        //             isBrowserCondition.setFunctionName("$fsx.cb")
        //         } else {
        //             if (core.opts.isTargetBrowser()) {
        //                 isBrowserCondition.setFunctionName("true")
        //             }
        //             if (core.opts.isTargetServer()) {
        //                 isBrowserCondition.setFunctionName("false")
        //             }
        //         }
        //     });
        // });
    }
}