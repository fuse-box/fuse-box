import { OptimisedCore } from "../OptimisedCore";

import { each } from "realm-utils";
import { FuseBoxIsBrowserCondition } from "../../core/nodes/FuseBoxIsBrowserCondition";
import { FuseBoxIsServerCondition } from "../../core/nodes/FuseBoxIsServerCondition";
import { FileAbstraction } from "../../core/FileAbstraction";



export class EnvironmentConditionModification {
    public static perform(core: OptimisedCore, file: FileAbstraction) {
        // FuseBox.isServer
        return each(file.fuseboxIsServerConditions, (isServerCondition: FuseBoxIsServerCondition) => {
            if (core.opts.isTargetUniveral()) {
                core.api.addIsServerFunction();
                isServerCondition.setFunctionName("$fsx.cs")
            } else {
                if (core.opts.isTargetBrowser()) {
                    isServerCondition.setFunctionName("false")
                }
                if (core.opts.isTargetServer()) {
                    isServerCondition.setFunctionName("true")
                }
            }
        }).then(() => {

            return each(file.fuseboxIsBrowserConditions, (isBrowserCondition: FuseBoxIsBrowserCondition) => {

                if (core.opts.isTargetUniveral()) {
                    core.api.addIsBrowserFunction();
                    isBrowserCondition.setFunctionName("$fsx.cb")
                } else {
                    if (core.opts.isTargetBrowser()) {
                        isBrowserCondition.setFunctionName("true")
                    }
                    if (core.opts.isTargetServer()) {
                        isBrowserCondition.setFunctionName("false")
                    }
                }
            })
        })
    }
}