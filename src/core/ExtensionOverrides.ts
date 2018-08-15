import { File } from "./File";
import * as fs from "fs";
import * as path from "path";

export class ExtensionOverrides {
	public overrides: string[];

	constructor(overrides: string[]) {
		this.overrides = [];
		overrides.forEach(override => this.add(override));
	}

	private isValid(override: string) {
		return typeof override === "string" && override.indexOf(".") === 0;
	}

	public add(override: string) {
		if (this.isValid(override)) {
			this.overrides.push(override);
		}
	}

	public setOverrideFileInfo(file: File): string {
		if (this.overrides.length === 0 || !file.belongsToProject()) {
			return;
		}

		const fileInfo = path.parse(file.info.absPath);

		for (let overrideExtension of this.overrides) {
			const overridePath = path.resolve(fileInfo.dir, `${fileInfo.name}${overrideExtension}`);

			if (overrideExtension.indexOf(fileInfo.ext) > -1 && fs.existsSync(overridePath)) {
				file.absPath = file.info.absPath = overridePath;
				file.hasExtensionOverride = true;
				file.context.log.echoInfo(
					`Extension override found. Mapping ${file.info.fuseBoxPath} to ${path.basename(file.info.absPath)}`,
				);
			}
		}
	}

	public getPathOverride(pathStr: string) {
		if (this.overrides.length === 0) {
			return;
		}

		const fileInfo = path.parse(pathStr);

		for (let overrideExtension of this.overrides) {
			const overridePath = path.resolve(fileInfo.dir, `${fileInfo.name}${overrideExtension}`);

			if (overrideExtension.indexOf(fileInfo.ext) > -1 && fs.existsSync(overridePath)) {
				return overridePath;
			}
		}
	}
}
