import * as fs from "fs-extra";
import * as path from "path";
import * as appRoot from "app-root-path";
import { ensureFuseBoxPath } from "./utils";

declare global {
	namespace jest {
		// tslint:disable-next-line:interface-name
		interface Matchers<R> {
			toMatchFilePath(path: string): R;
		}
	}
}

expect.extend({
	toMatchFilePath(expectedPath, comparedPath) {
		expectedPath = ensureFuseBoxPath(expectedPath);
		comparedPath = ensureFuseBoxPath(comparedPath);
		comparedPath = comparedPath
			.split(".")
			.join("\\.")
			.split("/")
			.join("\\/");
		const exp = new RegExp(comparedPath);
		const isMatched = exp.test(expectedPath);
		return {
			pass: isMatched,
			message: () => `Expected ${exp} to match ${expectedPath}`,
		};
	},
});

function createFiles(dir: string, files: any) {
	for (let name in files) {
		const content = files[name];
		const filePath = path.join(dir, name);
		fs.ensureDirSync(path.dirname(filePath));
		fs.writeFileSync(filePath, content);
	}
}

export function removeFolder(userPath) {
	fs.removeSync(userPath);
}

export function createRealNodeModule(name: string, packageJSON, files: { [key: string]: string }): string {
	const path2Module = path.join(appRoot.path, "node_modules", name);
	if (fs.existsSync(path2Module)) {
		removeFolder(path2Module);
	}
	fs.ensureDirSync(path2Module);
	const s = name.split("/");

	packageJSON.name = s[s.length - 1];
	files["package.json"] = JSON.stringify(packageJSON);

	createFiles(path2Module, files);
	return path2Module;
}
