import * as escodegen from "escodegen";
import * as NativeEmitter from "events";
import * as path from "path";
import * as ts from "typescript";
import { utils } from "realm-utils";
import { BundleSource } from "../BundleSource";
import { Defer } from "../Defer";
import { EventEmitter } from "../EventEmitter";
import { CSSDependencyExtractor, ICSSDependencyExtractorOptions } from "../lib/CSSDependencyExtractor";
import { Log } from "../Log";
import { ModuleCache } from "../ModuleCache";
import { QuantumBit } from "../quantum/plugin/QuantumBit";
import { QuantumSplitConfig, QuantumSplitResolveConfiguration } from "../quantum/plugin/QuantumSplit";
import { ensureDir, removeFolder, ensureFuseBoxPath } from "../Utils";
import { AutoImportedModule, registerDefaultAutoImportModules } from "./AutoImportedModule";
import { Bundle } from "./Bundle";
import { BundleProducer } from "./BundleProducer";
import { ExtensionOverrides } from "./ExtensionOverrides";
import { File, ScriptTarget } from "./File";
import { FuseBox } from "./FuseBox";
import { ModuleCollection } from "./ModuleCollection";
import { AllowedExtensions, IPackageInformation, IPathInformation } from "./PathMaster";
import { isElectronPolyfill, isServerPolyfill } from "./ServerPolyfillList";
import { TypescriptConfig } from "./TypescriptConfig";
import { UserOutput } from "./UserOutput";

const appRoot = require("app-root-path");

/**
 * All the plugin method names
 */
export type PluginMethodName =
	| "init"
	| "preBuild"
	| "preBundle"
	| "bundleStart"
	| "bundleEnd"
	| "postBundle"
	| "postBuild";

/**
 * Interface for a FuseBox plugin
 */
export interface Plugin {
	test?: RegExp;
	options?: any;
	init?(context: WorkFlowContext): any;
	transform?(file: File, ast?: any): any;
	transformGroup?(file: File): any;
	onTypescriptTransform?(file: File): any;
	bundleStart?(context: WorkFlowContext): any;
	bundleEnd?(context: WorkFlowContext): any;
	producerEnd?(producer: BundleProducer): any;
	onSparky?(): any;
	/**
	 * If provided then the dependencies are loaded on the client
	 *  before the plugin is invoked
	 */
	dependencies?: string[];
}

/**
 * Gets passed to each plugin to track FuseBox configuration
 */
export class WorkFlowContext {
	/**
	 * defaults to app-root-path, but can be set by user
	 * @see FuseBox
	 */
	public appRoot: any = appRoot.path;

	public cwd: string = ensureFuseBoxPath(process.cwd());

	public cacheBustPreffix: string;

	public dynamicImportsEnabled = true;

	public tsPathsRegExp?: RegExp;

	public tsModuleResolutionCache?: ts.ModuleResolutionCache;

	public shim: any;

	public writeBundles = true;

	public fuse: FuseBox;

	public useTypescriptCompiler = false;

	public userWriteBundles = true;

	public showWarnings = true;

	public ensureTsConfig = true;

	public useJsNext: boolean | string[] = false;

	public showErrors = true;

	public showErrorsInBrowser = true;

	public hmrEmitter = new EventEmitter<{ event: string; data: any }>();

	public emitter = new NativeEmitter();

	public quantumBits = new Map<string, QuantumBit>();

	/**
	 * The default package name or the package name configured in options
	 */
	public defaultPackageName = "default";

	public transformTypescript?: (contents: string) => string;

	public ignoreGlobal: string[] = [];

	public pendingPromises: Promise<any>[] = [];

	public emitHMRDependencies = false;

	public languageLevel: ScriptTarget & number;

	public forcedLanguageLevel: ScriptTarget & number;

	public filterFile: { (file: File): boolean };

	public customAPIFile: string;

	public defaultEntryPoint: string;

	public output: UserOutput;

	public extensionOverrides?: ExtensionOverrides;

	public hash: string | Boolean;

	public target: string = "universal";

	public inlineCSSPath: string = "css-sourcemaps";

	/**
	 * Explicitly target bundle to server
	 */
	public serverBundle = false;

	public nodeModules: Map<string, ModuleCollection> = new Map();

	public libPaths: Map<string, IPackageInformation> = new Map();

	public homeDir: string;

	public homeDirBase: string;

	public printLogs = true;

	public runAllMatchedPlugins = false;

	public plugins: Plugin[];

	public fileGroups: Map<string, File>;

	public useCache = true;

	public doLog = true;

	public cache: ModuleCache;

	public tsConfig: TypescriptConfig;

	public customModulesFolder: string[];

	public tsMode = false;

	public loadedTsConfig: string;

	public dependents = new Map<string, Set<string>>();

	public globals: { [packageName: string]: /** Variable name */ string };

	public standaloneBundle: boolean = true;

	public source: BundleSource;

	public sourceMapsProject: boolean = false;
	public sourceMapsVendor: boolean = false;
	public inlineSourceMaps: boolean = true;

	public sourceMapsRoot: string = "";
	public useSourceMaps: boolean;

	public lastChangedFuseBoxPath: string;

	public initialLoad = true;

	public debugMode = false;

	public quantumSplitConfig: QuantumSplitConfig = new QuantumSplitConfig(this);

	public log: Log = new Log(this);

	public pluginTriggers: Map<string, Set<String>>;

	public natives = {
		process: true,
		stream: true,
		Buffer: true,
		http: true,
	};
	public autoImportConfig = {};

	public bundle: Bundle;

	public storage: Map<string, any>;

	public aliasCollection: any[];

	public experimentalAliasEnabled = false;

	public customCodeGenerator: any;

	public defer = new Defer();

	public cacheType = "file";

	public initCache() {
		this.cache = new ModuleCache(this);
	}

	public resolve() {
		return Promise.all(this.pendingPromises).then(() => {
			this.pendingPromises = [];
		});
	}

	public queue(obj: any) {
		this.pendingPromises.push(obj);
	}

	public convertToFuseBoxPath(name: string) {
		let root = this.homeDir;
		name = name.replace(/\\/g, "/");
		root = root.replace(/\\/g, "/");
		name = name.replace(root, "").replace(/^\/|\\/, "");
		return name;
	}
	public isBrowserTarget() {
		return this.target === "browser";
	}

	public shouldUseJsNext(libName: string) {
		if (this.useJsNext === true) {
			return true;
		}
		if (Array.isArray(this.useJsNext)) {
			return this.useJsNext.indexOf(libName) > -1;
		}
	}

	public nameSplit(name: string, filePath: string) {
		this.quantumSplitConfig.register(name, filePath);
	}

	public configureQuantumSplitResolving(opts: QuantumSplitResolveConfiguration) {
		this.quantumSplitConfig.resolveOptions = opts;
	}

	public setCodeGenerator(fn: any) {
		this.customCodeGenerator = fn;
	}

	public generateCode(ast: any, opts?: any) {
		if (this.customCodeGenerator) {
			try {
				return this.customCodeGenerator(ast);
			} catch (e) {}
		}
		return escodegen.generate(ast, opts);
	}

	public replaceTSPathAliases(requireStatement: string): { requireStatement: string; replaced: boolean } {
		let replaced = false;

		const { compilerOptions } = this.tsConfig.getConfig();
		const normalizedRequireStmt = requireStatement.replace(/\\/g, "/");
		const { resolvedModule } = ts.resolveModuleName(
			normalizedRequireStmt,
			"",
			compilerOptions,
			ts.sys,
			this.tsModuleResolutionCache,
		);

		if (!resolvedModule) return { requireStatement, replaced };

		if (resolvedModule.packageId) {
			requireStatement = ensureFuseBoxPath(resolvedModule.packageId.name);
			replaced = true;
		} else if (resolvedModule.resolvedFileName) {
			requireStatement = ensureFuseBoxPath(path.relative(this.homeDir, resolvedModule.resolvedFileName));

			if (resolvedModule.extension) {
				requireStatement = requireStatement.substr(0, requireStatement.length - resolvedModule.extension.length);
			}

			requireStatement = `~/${requireStatement}`;

			replaced = true;
		}

		return { requireStatement, replaced };
	}

	public replaceAliases(requireStatement: string, file: File): { requireStatement: string; replaced: boolean } {
		const aliasCollection = this.aliasCollection;
		let replaced = false;

		if (
			file.collection.name === this.defaultPackageName &&
			this.tsPathsRegExp &&
			this.tsPathsRegExp.test(requireStatement)
		) {
			const resolved = this.replaceTSPathAliases(requireStatement);
			if (resolved.replaced) {
				return resolved;
			}
		}

		if (aliasCollection) {
			aliasCollection.forEach(props => {
				if (props.expr.test(requireStatement)) {
					replaced = true;
					requireStatement = requireStatement.replace(props.expr, `${props.replacement}$2`);
				}
			});
		}
		return { requireStatement, replaced };
	}

	public emitJavascriptHotReload(file: File) {
		if (file.ignoreCache || !this.lastChangedFuseBoxPath) {
			return;
		}

		if (file.info.fuseBoxPath !== this.lastChangedFuseBoxPath) {
			this.fuse.context.log.echoInfo(`Changed but not emitted ${file.info.fuseBoxPath} to HMR`);
			return;
		}
		this.emitter.addListener("bundle-collected", () => {
			const hmrDependencies = [];
			file.resolvedDependencies.map(f => {
				const info = f.info;
				if (!info.isNodeModule) {
					hmrDependencies.push({ module: this.defaultPackageName, path: `${info.fuseBoxPath}` });
				} else {
					let requiredVendorCheck = true;
					// electron should be handled differently
					if (this.target === "electron") {
						const otherBannedVendors = ["electron"];
						if (isElectronPolyfill(info.nodeModuleName)) {
							requiredVendorCheck = false;
						}
						if (otherBannedVendors.includes(info.nodeModuleName)) {
							requiredVendorCheck = false;
						}
						let foundInVendors = false;
						this.nodeModules.forEach((collection, key) => {
							if (foundInVendors) {
								return;
							}
							const [name] = key.split("@");
							foundInVendors = info.nodeModuleName === name;
						});
						if (!foundInVendors) {
							requiredVendorCheck = false;
						}
					}

					if (requiredVendorCheck) {
						hmrDependencies.push({ module: info.nodeModuleName, path: info.fuseBoxPath });
					}
				}
			});

			let dependants = {};
			if (file.context.emitHMRDependencies) {
				this.dependents.forEach((set, key) => {
					dependants[key] = [...set];
				});
			}

			this.hmrEmitter.emit({
				event: "source-changed",
				data: {
					type: "js",
					dependencies: hmrDependencies,
					dependants: dependants,
					content: file.getHMRContent(),
					path: file.info.fuseBoxPath,
				},
			});
		});
	}

	public debug(group: string, text: string) {
		if (this.debugMode) {
			this.log.echo(`${group} : ${text}`);
		}
	}

	public nukeCache() {
		this.resetNodeModules();
		this.pendingPromises = [];
		if (this.cache) {
			removeFolder(this.cache.cacheFolder);
			this.cache.initialize();
		}
	}

	public setSourceMapsProperty(params: any) {
		if (typeof params === "boolean") {
			this.sourceMapsProject = params;
		} else {
			if (utils.isPlainObject(params)) {
				if (params.inlineCSSPath) {
					this.inlineCSSPath = params.inlineCSSPath;
				}
				this.sourceMapsProject = params.project !== undefined ? params.project : true;
				this.sourceMapsVendor = params.vendor === true;
				if (params.inline !== undefined) {
					this.inlineSourceMaps = params.inline;
				}
				if (params.sourceRoot || params.sourceRoot === "") {
					this.sourceMapsRoot = params.sourceRoot;
				}
			}
		}
		if (this.sourceMapsProject || this.sourceMapsVendor) {
			this.useSourceMaps = true;
		}
	}

	public warning(str: string) {
		return this.log.echoWarning(str);
	}

	public deprecation(str: string) {
		setTimeout(() => {
			this.log.echoWarning(str);
		}, 1000);
	}

	public fatal(str: string) {
		throw new Error(str);
	}
	public debugPlugin(plugin: Plugin, text: string) {
		const name = plugin.constructor && plugin.constructor.name ? plugin.constructor.name : "Unknown";
		this.debug(name, text);
	}

	public isShimed(name: string): boolean {
		if (!this.shim) {
			return false;
		}
		return this.shim[name] !== undefined;
	}

	public isHashingRequired() {
		const hashOption = this.hash;
		let useHash = false;
		if (typeof hashOption === "string") {
			if (hashOption !== "md5") {
				throw new Error(`Uknown algorythm ${hashOption}`);
			}
			useHash = true;
		}
		if (hashOption === true) {
			useHash = true;
		}
		return useHash;
	}

	/**
	 * Resets significant class members
	 */
	public reset() {
		this.log.reset();

		this.cacheBustPreffix = new Date().getTime().toString();
		this.dependents = new Map<string, Set<string>>();
		this.emitter = new NativeEmitter();
		this.storage = new Map();
		this.source = new BundleSource(this);
		this.nodeModules = new Map();
		this.pluginTriggers = new Map();
		this.fileGroups = new Map();
		this.libPaths = new Map();
	}

	public registerDependant(target: File, dependant: File) {
		let fileSet: Set<string>;
		if (!this.dependents.has(target.info.fuseBoxPath)) {
			fileSet = new Set<string>();
			this.dependents.set(target.info.fuseBoxPath, fileSet);
		} else {
			fileSet = this.dependents.get(target.info.fuseBoxPath);
		}
		if (!fileSet.has(dependant.info.fuseBoxPath)) {
			fileSet.add(dependant.info.fuseBoxPath);
		}
	}

	public initAutoImportConfig(userNatives, userImports) {
		if (this.target !== "server") {
			this.autoImportConfig = registerDefaultAutoImportModules(userNatives);
		}
		if (utils.isPlainObject(userImports)) {
			for (let varName in userImports) {
				this.autoImportConfig[varName] = new AutoImportedModule(varName, userImports[varName]);
			}
		}
	}

	public setItem(key: string, obj: any) {
		this.storage.set(key, obj);
	}

	public getItem(key: string, defaultValue?: any): any {
		return this.storage.get(key) !== undefined ? this.storage.get(key) : defaultValue;
	}

	public setCSSDependencies(file: File, userDeps: string[]) {
		let collection = this.getItem("cssDependencies") || {};
		collection[file.info.absPath] = userDeps;
		this.setItem("cssDependencies", collection);
	}

	public extractCSSDependencies(file: File, opts: ICSSDependencyExtractorOptions): string[] {
		const extractor = CSSDependencyExtractor.init(opts);
		this.setCSSDependencies(file, extractor.getDependencies());
		return extractor.getDependencies();
	}

	public getCSSDependencies(file: File): string[] {
		let collection = this.getItem("cssDependencies") || {};
		return collection[file.info.absPath];
	}
	/**
	 * Create a new file group
	 * Mocks up file
	 */
	public createFileGroup(name: string, collection: ModuleCollection, handler: Plugin): File {
		let info = <IPathInformation>{
			fuseBoxPath: name,
			absPath: name,
		};
		let file = new File(this, info);
		file.collection = collection;
		file.contents = "";
		file.groupMode = true;
		// Pass it along
		// Transformation might happen in a different plugin
		file.groupHandler = handler;

		this.fileGroups.set(name, file);
		return file;
	}

	public getFileGroup(name: string): File {
		return this.fileGroups.get(name);
	}

	public allowExtension(ext: string) {
		if (!AllowedExtensions.has(ext)) {
			AllowedExtensions.add(ext);
		}
	}

	public addAlias(obj: any, value?: any) {
		const aliases = [];
		if (!value) {
			for (const key in obj) {
				if (obj.hasOwnProperty(key)) {
					if (path.isAbsolute(key)) {
						// dying in agony
						this.fatal(`Can't use absolute paths with alias "${key}"`);
					}

					aliases.push({ expr: new RegExp(`^(${key})(/|$)`), replacement: obj[key] });
				}
			}
		} else {
			aliases.push({ expr: new RegExp(`^(${obj})(/|$)`), replacement: value });
		}

		this.aliasCollection = this.aliasCollection || [];
		this.aliasCollection = this.aliasCollection.concat(aliases);
		this.experimentalAliasEnabled = true;
	}
	public setHomeDir(dir: string) {
		this.homeDir = ensureDir(dir);
		this.homeDirBase = path.parse(this.homeDir).base;
	}

	public setLibInfo(name: string, version: string, info: IPackageInformation) {
		let key = `${name}@${version}`;
		if (!this.libPaths.has(key)) {
			return this.libPaths.set(key, info);
		}
	}

	/** Converts the file extension from `.ts` to `.js` */
	public convert2typescript(name: string) {
		return name.replace(/\.ts$/, ".js");
	}

	public getLibInfo(name: string, version: string): IPackageInformation {
		let key = `${name}@${version}`;
		if (this.libPaths.has(key)) {
			return this.libPaths.get(key);
		}
	}

	public setPrintLogs(printLogs: boolean) {
		this.printLogs = printLogs;
	}

	public setUseCache(useCache: boolean) {
		this.useCache = useCache;
	}

	public hasNodeModule(name: string): boolean {
		return this.nodeModules.has(name);
	}

	public isGlobalyIgnored(name: string): boolean {
		if (this.ignoreGlobal.indexOf(name) > -1) {
			return true;
		}
		if (this.target === "server") {
			return isServerPolyfill(name);
		}

		if (this.target === "electron") {
			return isElectronPolyfill(name);
		}

		return false;
	}

	public resetNodeModules() {
		this.nodeModules = new Map<string, ModuleCollection>();
	}

	public addNodeModule(name: string, collection: ModuleCollection) {
		this.nodeModules.set(name, collection);
	}

	public isFirstTime() {
		return this.initialLoad === true;
	}

	public async writeOutput(outFileWritten?: () => any) {
		return new Promise((resolve, reject) => {
			this.initialLoad = false;

			const res = this.source.getResult();
			if (this.bundle) {
				this.bundle.generatedCode = res.content;
			}

			if (this.output && (!this.bundle || (this.bundle && this.bundle.producer.writeBundles))) {
				this.output.writeCurrent(res.content).then(() => {
					if (this.source.includeSourceMaps) {
						this.writeSourceMaps(res);
					}

					this.defer.unlock();
					if (utils.isFunction(outFileWritten)) {
						outFileWritten();
					}
					return resolve();
				});
			} else {
				this.defer.unlock();
				outFileWritten();
				return resolve();
			}
		});
	}

	protected writeSourceMaps(result: any) {
		// Writing sourcemaps
		if (this.sourceMapsProject || this.sourceMapsVendor) {
			this.output.writeToOutputFolder(`${this.output.filename}.js.map`, result.sourceMap);
		}
	}

	public getNodeModule(name: string): ModuleCollection {
		return this.nodeModules.get(name);
	}

	/**
	 * @param fn if provided, its called once the plugin method has been triggered
	 */
	public triggerPluginsMethodOnce(name: PluginMethodName, args: any, fn?: { (plugin: Plugin): void }) {
		this.plugins.forEach(plugin => {
			if (Array.isArray(plugin)) {
				plugin.forEach(p => {
					if (utils.isFunction(p[name])) {
						if (this.pluginRequiresTriggering(p, name)) {
							p[name].apply(p, args);
							if (fn) {
								fn(p);
							}
						}
					}
				});
			}
			if (plugin && utils.isFunction(plugin[name])) {
				if (this.pluginRequiresTriggering(plugin, name)) {
					plugin[name].apply(plugin, args);
					if (fn) {
						fn(plugin);
					}
				}
			}
		});
	}

	/**
	 * Makes sure plugin method is triggered only once
	 * @returns true if the plugin needs triggering
	 */
	private pluginRequiresTriggering(cls: any, method: PluginMethodName) {
		if (!cls.constructor) {
			return true;
		}
		let name = cls.constructor.name;
		if (!this.pluginTriggers.has(name)) {
			this.pluginTriggers.set(name, new Set());
		}
		let items = this.pluginTriggers.get(name);
		if (!items.has(method)) {
			items.add(method);
			return true;
		}
		return false;
	}
}
