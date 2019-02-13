import * as appRoot from "app-root-path";
import * as fs from "fs";
import * as fsExtra from "fs-extra";
import * as path from "path";
import { each } from "realm-utils";
import { FuseBox, FuseBoxOptions, QuantumPlugin } from "../../../src";
import { removeFolder } from "../../../src/Utils";

const jsdom = require("jsdom");

function createFiles(dir: string, files: any) {
	for (let name in files) {
		const content = files[name];
		const filePath = path.join(dir, name);
		fsExtra.ensureDirSync(path.dirname(filePath));
		fs.writeFileSync(filePath, content);
	}
}

export class TestFolder {
	folder: string;
	constructor(public customName?: string) {}
	public make() {
		this.folder = path.join(
			appRoot.path,
			".fusebox",
			"tests",
			this.customName ? this.customName : new Date().getTime().toString(),
		);
		fsExtra.ensureDirSync(this.folder);
	}

	public shouldFindFile(file: string) {
		let target = path.join(this.folder, file);
		if (!fs.existsSync(target)) {
			throw new Error(`Expected to find file ${target}`);
		}
		return target;
	}

	public readFile(file: string): string {
		let target = this.shouldFindFile(file);
		return fs.readFileSync(target).toString();
	}

	public writeFile(file: string, contents: string): void {
		let target = this.shouldFindFile(file);
		fs.writeFileSync(target, contents);
	}

	public clean() {
		//removeFolder(this.folder);
	}
}

export function getStubsFolder() {
	return path.join(appRoot.path, "tests/_helpers/stubs");
}

export function createOptimisedBundleEnv(opts: any) {
	process.env.NODE_ENV = "production";
	const randomName = `test-${new Date().getTime()}-${Math.random()}`;
	const root = path.join(appRoot.path, ".fusebox/old-tests/", randomName);
	const projectsHomeDir = path.join(root, "project");
	let modulesFolder = path.join(root, "modules");
	fsExtra.ensureDirSync(projectsHomeDir);
	fsExtra.ensureDirSync(modulesFolder);

	const output: any = {
		modules: {},
	};
	const scripts = [];

	const optimisedBundleOpts = opts.options || {};

	if (opts.stubs) {
		modulesFolder = path.join(appRoot.path, "tests/_helpers/stubs/test_modules");
	}

	// creating modules
	return each(opts.modules, (moduleParams, name) => {
		return new Promise((resolve, reject) => {
			moduleParams.homeDir = path.join(modulesFolder, name);
			moduleParams.output = path.join(modulesFolder, name, "dist/index.js");
			moduleParams.package = name;
			moduleParams.cache = false;
			moduleParams.log = moduleParams.log || false;

			moduleParams.tsConfig = path.join(appRoot.path, "tests/_helpers/fixtures", "tsconfig.json");
			const fuse = FuseBox.init(moduleParams);
			fuse
				.bundle("index.js")
				.cache(false)
				.instructions(moduleParams.instructions);
			return fuse
				.run()
				.then(bundle => {
					if (moduleParams.onDone) {
						moduleParams.onDone({
							root,
							filePath: moduleParams.output,
							projectDir: moduleParams.homeDir,
						});
					}
					scripts.push(moduleParams.output);
					return resolve();
				})
				.catch(reject);
		});
	})
		.then(() => {
			const projectOptions = opts.project;
			projectOptions.homeDir = projectsHomeDir;
			projectOptions.output = path.join(projectsHomeDir, "dist", "index.js");
			projectOptions.cache = false;
			projectOptions.log = projectOptions.log || false;
			projectOptions.tsConfig = path.join(appRoot.path, "tests/_helpers/fixtures", "tsconfig.json");
			projectOptions.modulesFolder = modulesFolder;

			projectOptions.plugins = projectOptions.plugins || [];
			createFiles(projectsHomeDir, projectOptions.files);
			delete projectOptions.files;
			projectOptions.plugins.push(QuantumPlugin(optimisedBundleOpts));
			const fuse = FuseBox.init(projectOptions);

			fuse
				.bundle("index.js")
				.cache(false)
				.log(false)
				.instructions(projectOptions.instructions);
			return fuse.run().then(producer => {
				const contents = {};
				const bundles = producer.sortBundles();
				bundles.forEach(bundle => {
					contents[bundle.name] = bundle.generatedCode.toString();
					scripts.push(bundle.context.output.lastPrimaryOutput.path);
				});

				return new Promise((resolve, reject) => {
					if (optimisedBundleOpts && optimisedBundleOpts.target === "server") {
						let results = [];
						scripts.forEach(script => {
							results.push(require(script));
						});
						output.bundles = results;
						return resolve(output);
					} else {
						jsdom.env({
							html: "<html><head></head><body></body></html>",
							scripts: scripts,
							virtualConsole: jsdom.createVirtualConsole().sendTo(console),
							done: function(err, window) {
								if (err) {
									return reject(err);
								}
								output.contents = contents;
								output.window = window;
								return resolve(output);
							},
						});
					}
				});
			});
		})
		.then(() => {
			return output;
		});
}

export function createEnv(opts: any) {
	const randomName = `test-${new Date().getTime()}-${Math.random()}`;
	const root = path.join(appRoot.path, ".fusebox/old-tests/", randomName);
	const projectsHomeDir = path.join(root, "project");
	const modulesFolder = path.join(root, "modules");
	fsExtra.ensureDirSync(projectsHomeDir);
	fsExtra.ensureDirSync(modulesFolder);

	const serverOnly = opts.server === true;

	const output: any = {
		modules: {},
	};
	const scripts = [];

	// creating modules
	return each(opts.modules, (moduleParams, name) => {
		return new Promise((resolve, reject) => {
			moduleParams.homeDir = path.join(modulesFolder, name);
			moduleParams.output = path.join(modulesFolder, name, "dist/index.js");
			moduleParams.package = name;
			moduleParams.ensureTsConfig = false;
			moduleParams.cache = false;
			moduleParams.log = false;

			moduleParams.tsConfig = path.join(appRoot.path, "tests/_helpers/fixtures", "tsconfig.json");
			createFiles(moduleParams.homeDir, moduleParams.files);
			delete moduleParams.files;
			const fuse = FuseBox.init(moduleParams);
			fuse
				.bundle("index.js")
				.cache(false)
				.instructions(moduleParams.instructions);
			return fuse
				.run()
				.then(bundle => {
					if (moduleParams.onDone) {
						moduleParams.onDone({
							root,
							filePath: moduleParams.output,
							projectDir: projectsHomeDir,
						});
					}

					if (serverOnly) {
						output.modules[name] = require(moduleParams.output);
					} else {
						scripts.push(moduleParams.output);
					}

					return resolve();
				})
				.catch(reject);
		});
	})
		.then(() => {
			const projectOptions = opts.project;
			projectOptions.homeDir = projectsHomeDir;
			projectOptions.output = path.join(projectsHomeDir, "dist", "index.js");
			projectOptions.cache = false;
			projectOptions.log = false;
			projectOptions.ensureTsConfig = false;
			projectOptions.tsConfig = path.join(appRoot.path, "tests/_helpers/fixtures", "tsconfig.json");
			projectOptions.modulesFolder = modulesFolder;
			createFiles(projectsHomeDir, projectOptions.files);
			delete projectOptions.files;
			const fuse = FuseBox.init(projectOptions);

			fuse
				.bundle("index.js")
				.cache(false)
				.log(false)
				.instructions(projectOptions.instructions);
			return fuse.run().then(producer => {
				if (producer.bundles) {
					producer.bundles.forEach(bundle => {
						projectOptions.output = bundle.context.output.lastPrimaryOutput.path;
					});
				}
				return new Promise((done, reject) => {
					setTimeout(() => {
						let contents = fs.readFileSync(projectOptions.output);
						const length = contents.buffer.byteLength;
						output.projectContents = contents;
						output.dist = path.dirname(projectOptions.output);

						output.projectSize = length;
						output.shouldExistInDist = name => {
							let target = path.join(output.dist, name);

							if (!fs.existsSync(target)) {
								throw new Error(`Expected to find ${name} in dist!`);
							}
						};
						if (serverOnly) {
							output.project = require(projectOptions.output);
						} else {
							scripts.push(projectOptions.output);
							return new Promise((resolve, reject) => {
								jsdom.env({
									html: "<html><head></head><body></body></html>",
									scripts: scripts,
									done: function(err, window) {
										if (err) {
											return reject(err);
										}

										output.project = window;
										output.projectSize = length;
										output.querySelector = window.document.querySelector;
										output.querySelectorAll = window.document.querySelectorAll;
										output.projectContents = contents;
										return done(output);
									},
								});
							});
						}
						return done(output);
					}, 1);
				});
			});
		})
		.then(() => {
			return output;
		});
}

export class TestingFuseBox extends FuseBox {
	constructor(opts: FuseBoxOptions, public tmpFolder: string) {
		super(opts);
	}

	public runAndLoad(modules: string[], callback: (any, string) => any) {
		// todo: move cleanup to afterAll

		return this.run()
			.then(producer => {
				return modules.reduce((acc, m) => {
					const bundle = producer.bundles.get(m);
					if (!bundle) {
						throw new Error(`Module ${m} not found`);
					}
					acc[m] = require(bundle.context.output.lastPrimaryOutput.path);
					return acc;
				}, {});
			})
			.then(loaded => callback(loaded, path.dirname(this.opts.output)) || loaded);
	}
}

export function createFuseBox(opts: any): TestingFuseBox {
	const name = opts.name || `test-${new Date().getTime()}`;

	let tmpFolder = path.join(appRoot.path, ".fusebox", "tests", name);

	fsExtra.ensureDirSync(tmpFolder);

	const defaultProjectOptions = {
		output: path.join(tmpFolder, "dist", "$name.js"),
		cache: false,
		log: false,
		tsConfig: path.join(appRoot.path, "tests/_helpers/fixtures", "tsconfig.json"),
	};

	const projectOptions = Object.assign({}, defaultProjectOptions, opts);

	return new TestingFuseBox(projectOptions, tmpFolder);
}
