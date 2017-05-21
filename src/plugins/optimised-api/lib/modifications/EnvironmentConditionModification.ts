import { OptimisedCore } from "../OptimisedCore";
import { FlatFileGenerator } from "../FlatFileGenerator";
import { FileAbstraction } from "../../../../bundle-abstraction/FileAbstraction";
import { FuseBoxIsServerCondition } from "../../../../bundle-abstraction/nodes/FuseBoxIsServerCondition";
import { each } from "realm-utils";
import { FuseBoxIsBrowserCondition } from "../../../../bundle-abstraction/nodes/FuseBoxIsBrowserCondition";

export class EnvironmentConditionModification {
    public static perform(core: OptimisedCore, generator: FlatFileGenerator, file: FileAbstraction) {
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