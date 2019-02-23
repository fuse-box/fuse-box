import * as fs from "fs-extra";
import * as path from "path";
import * as appRoot from "app-root-path";

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

export function createRealNodeModule(name: string, packageJSON, files: { [key: string]: string }) {
	const path2Module = path.join(appRoot.path, "node_modules", name);
	if (fs.existsSync(path2Module)) {
		removeFolder(path2Module);
	}
	fs.ensureDirSync(path2Module);

	packageJSON.name = name;
	files["package.json"] = JSON.stringify(packageJSON);

	createFiles(path2Module, files);
}
