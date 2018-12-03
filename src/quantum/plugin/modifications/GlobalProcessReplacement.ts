import { FileAbstraction } from "../../core/FileAbstraction";
import { QuantumCore } from "../QuantumCore";

export class GlobalProcessReplacement {
	public static perform(core: QuantumCore, file: FileAbstraction) {
		if (!file.processVariableDefined && core.opts.isTargetBrowser()) {
			file.globalProcess.forEach(item => {
				item.replaceWithString(undefined);
			});
		}
	}
}
