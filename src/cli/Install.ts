import * as path from "path";
import * as fsExtra from "fs-extra";
import * as fs from "fs";
import { exec } from "child_process";
import * as log from "./log";

const HOME = process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE;
const REPOSITORY_PATH = path.join(HOME, ".fuse-box", "bootstrap-collection");
const SKELETONS = path.join(REPOSITORY_PATH, "skeletons");
function listProjects(dirname) {
	const results = fs.readdirSync(dirname).filter(function(file) {
		return fs.statSync(path.join(dirname, file)).isDirectory();
	});
	const output = [];
	results.forEach(dir => {
		const absPath = path.join(dirname, dir);
		const packageJSON = path.join(absPath, "package.json");
		if (fs.existsSync(packageJSON)) {
			const json = require(packageJSON);
			output.push({ dir: absPath, json: json });
		}
	});
	return output;
}

export class Install {
	constructor(args) {
		const major = args._;
		if (major.length === 0) {
			if (args.update) {
				this.update();
			} else {
				this.search(args.search);
			}
		} else {
			this.install(major[0], major[1]);
		}
	}

	private async update() {
		await this.verifyRepository();
		await this.pullRepository();
	}

	private async pullRepository() {
		return new Promise((resolve, reject) => {
			fsExtra.ensureDirSync(REPOSITORY_PATH);
			log.info("pulling https://github.com/fuse-box/bootstrap-collection");
			exec("git pull", { cwd: REPOSITORY_PATH }, (error, stdout, stderr) => {
				if (error) {
					return reject(error);
				}
				log.info("Pulled successfully");
				return resolve();
			});
		});
	}
	private cloneRepository() {
		return new Promise((resolve, reject) => {
			fsExtra.ensureDirSync(REPOSITORY_PATH);
			log.info("Cloning https://github.com/fuse-box/bootstrap-collection");
			exec(
				"git clone https://github.com/fuse-box/bootstrap-collection .",
				{ cwd: REPOSITORY_PATH },
				(error, stdout, stderr) => {
					if (error) {
						return reject(error);
					}
					log.info("Cloned successfully");
					return resolve();
				},
			);
		});
	}
	private async verifyRepository() {
		if (!fs.existsSync(REPOSITORY_PATH)) {
			log.info("Repository not found");
			this.cloneRepository();
		}
	}

	private async search(searchName?: string) {
		log.info("Listing available skeletons");
		await this.verifyRepository();
		const projects = listProjects(SKELETONS);
		const results = projects.filter(item => {
			if (typeof searchName !== "string") return item;
			if (item.json.name.toLowerCase().indexOf(searchName.toLowerCase()) > -1) {
				return item;
			}
		});
		results.forEach(item => {
			log.title(item.json.name);
			log.desc(item.json.description);
		});
	}

	private async install(name: string, targetPath: string) {
		log.info(`Installing ${name}`);
		const projects = listProjects(SKELETONS);
		const result = projects.filter(item => {
			if (item.json.name.toLowerCase().indexOf(name.toLowerCase()) > -1) {
				return item;
			}
		});
		if (!result.length) {
			return log.error("Skeleton was not found. Try 'fuse install --search'");
		}
		if (result.length > 1) {
			return log.error("More than one repository found");
		}
		const item = result[0];
		const source = item.dir;
		targetPath = path.join(process.cwd(), targetPath ? targetPath : item.json.name);
		if (fs.existsSync(targetPath)) {
			log.error(`Directory ${targetPath} exists`);
			log.error(`Choose a different one by typing:`);
			log.info(`fuse install "${name}" dirname`);
			return;
		}
		log.info(`Copying to ${targetPath}`);
		await fsExtra.copy(source, targetPath);
		log.info(`Done!`);
		log.info(`   cd ${targetPath};`);
		log.info(`   yarn;`);
	}
}
