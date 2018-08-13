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
					replacable.setFunctionName(`${core.opts.quantumVariableName}.cs`);
				}
				if (replacable.identifier === "isBrowser") {
					replacable.setFunctionName(`${core.opts.quantumVariableName}.cb`);
				}
			} else {
				if (replacable.isConditional) {
					replacable.handleActiveCode();
				} else {
					replacable.replaceWithValue();
				}
			}
		});
	}
}
