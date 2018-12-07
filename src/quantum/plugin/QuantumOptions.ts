import { WebIndexPluginClass } from "../../plugins/WebIndexPlugin";
import { QuantumCore } from "./QuantumCore";
import { readFuseBoxModule, hashString, joinFuseBoxPath } from "../../Utils";
import { FileAbstraction } from "../core/FileAbstraction";
import { BundleProducer, Bundle } from "../../index";
export interface ITreeShakeOptions {
	shouldRemove: { (file: FileAbstraction): void };
}
export interface IQuantumExtensionParams {
	target?: string;
	uglify?: any;
	removeExportsInterop?: boolean;
	removeUseStrict?: boolean;
	replaceTypeOf?: boolean;
	replaceProcessEnv?: boolean;
	webIndexPlugin?: WebIndexPluginClass;
	ensureES5?: boolean;
	treeshake?: boolean | ITreeShakeOptions;
	api?: { (core: QuantumCore): void };
	warnings?: boolean;
	bakeApiIntoBundle?: string | string[] | true;
	shimsPath?: string;
	globalRequire?: boolean;
	extendServerImport?: boolean;
	polyfills?: string[];
	definedExpressions?: { [key: string]: boolean | string | number };
	processPolyfill?: boolean;
	sourceMaps?: {
		path?: string;
		vendor: boolean;
	};
	css?:
		| {
				path?: string;
				clean?: boolean;
		  }
		| boolean;
	cssFiles?: { [key: string]: string };
	hoisting?: boolean | { names: string[] };
	containedAPI?: boolean;
	noConflictApi?: boolean;
	manifest?: boolean | string;
	runtimeBundleMapping?: string;
}

export class QuantumOptions {
	private uglify: any;
	private removeExportsInterop = false;
	private removeUseStrict = true;
	private ensureES5 = false;
	private replaceProcessEnv = true;
	private containedAPI = false;
	private processPolyfill = false;
	private sourceMapsOption: {
		vendor: boolean;
		path?: string;
	};
	private bakeApiIntoBundle: string[] | true | undefined;
	private noConflictApi = false;

	private replaceTypeOf: boolean = true;

	private showWarnings = true;
	private treeshakeOptions: ITreeShakeOptions;
	private hoisting = false;
	private polyfills: string[];
	public globalRequire = true;
	private hoistedNames: string[];
	private extendServerImport = false;
	private manifestFile: string;
	public shimsPath = "shims.js";
	public apiCallback: { (core: QuantumCore): void };
	public optsTarget: string = "browser";
	public treeshake = false;
	private cleanCSS: any;
	private css = false;
	private cssPath = "styles.css";
	private readonly cssFiles: { [key: string]: string };
	public quantumVariableName = "$fsx";
	public definedExpressions: { [key: string]: boolean | string | number };
	public webIndexPlugin: WebIndexPluginClass;
	public runtimeBundleMapping: string;

	constructor(public producer: BundleProducer, opts: IQuantumExtensionParams) {
		opts = opts || ({} as IQuantumExtensionParams);
		if (opts.target) {
			this.optsTarget = opts.target;
		} else {
			this.optsTarget = this.producer.fuse.context.target;
		}
		if (opts.css) {
			this.css = true;
			if (typeof opts.css === "object") {
				this.cssPath = opts.css.path || "styles.css";
				this.cleanCSS = opts.css.clean !== undefined ? opts.css.clean : true;
			} else {
				this.cleanCSS = true;
			}
		}
		if (opts.cssFiles) {
			this.cssFiles = opts.cssFiles;
		}
		if (opts.api) {
			this.apiCallback = opts.api;
		}
		if (opts.definedExpressions) {
			this.definedExpressions = opts.definedExpressions;
		}
		if (opts.manifest !== undefined) {
			if (typeof opts.manifest === "string") {
				this.manifestFile = opts.manifest;
			}
			if (opts.manifest === true) {
				this.manifestFile = "manifest.json";
			}
		}
		if (opts.sourceMaps) {
			this.sourceMapsOption = opts.sourceMaps;
		}
		if (opts.uglify) {
			this.uglify = opts.uglify;
		}

		if (opts.noConflictApi !== undefined) {
			this.noConflictApi = opts.noConflictApi;
		}

		if (opts.processPolyfill !== undefined) {
			this.processPolyfill = opts.processPolyfill;
		}

		if (opts.shimsPath) {
			this.shimsPath = opts.shimsPath;
		}

		if (opts.warnings !== undefined) {
			this.showWarnings = opts.warnings;
		}

		if (opts.globalRequire !== undefined) {
			this.globalRequire = opts.globalRequire;
		}
		if (opts.replaceTypeOf !== undefined) {
			this.replaceTypeOf = opts.replaceTypeOf;
		}
		if (opts.containedAPI !== undefined) {
			this.containedAPI = opts.containedAPI;
		}

		if (Array.isArray(opts.polyfills)) {
			this.polyfills = opts.polyfills;
		}
		// stupid exports.__esModule = true;
		if (opts.removeExportsInterop !== undefined) {
			this.removeExportsInterop = opts.removeExportsInterop;
		}
		if (opts.replaceProcessEnv !== undefined) {
			this.replaceProcessEnv = opts.replaceProcessEnv;
		}
		if (opts.removeUseStrict !== undefined) {
			this.removeUseStrict = opts.removeUseStrict;
		}
		if (opts.webIndexPlugin) {
			this.webIndexPlugin = opts.webIndexPlugin;
		}

		if (opts.hoisting !== undefined) {
			if (typeof opts.hoisting === "boolean") {
				this.hoisting = opts.hoisting as boolean;
			} else {
				this.hoisting = true;
				const hoistingOptions = opts.hoisting as { names: string[] };
				this.hoistedNames = hoistingOptions.names;
			}
		}

		if (opts.bakeApiIntoBundle) {
			if (typeof opts.bakeApiIntoBundle === "string") {
				this.bakeApiIntoBundle = [opts.bakeApiIntoBundle];
			} else {
				this.bakeApiIntoBundle = opts.bakeApiIntoBundle;
			}
		}

		if (opts.extendServerImport !== undefined) {
			this.extendServerImport = opts.extendServerImport;
		}
		if (opts.ensureES5 !== undefined) {
			this.ensureES5 = opts.ensureES5;
		}
		if (opts.treeshake !== undefined) {
			if (typeof opts.treeshake === "boolean") {
				this.treeshake = opts.treeshake;
			} else {
				this.treeshake = true;
				this.treeshakeOptions = opts.treeshake as ITreeShakeOptions;
			}
		}
		if (this.isContained() || this.noConflictApi === true) {
			this.genenerateQuantumVariableName();
		}

		if (opts.runtimeBundleMapping !== undefined && typeof opts.runtimeBundleMapping == "string") {
			this.runtimeBundleMapping = opts.runtimeBundleMapping;
		}
	}

	public shouldSetBundleMappingsAtRuntime() {
		return !!this.runtimeBundleMapping;
	}

	public shouldGenerateCSS() {
		return this.css === true || this.cssFiles;
	}

	public getCleanCSSOptions() {
		return this.cleanCSS;
	}

	public getCSSPath() {
		return this.cssPath;
	}

	public getSourceMapsPath(file: string) {
		let initial = "./";
		if (this.sourceMapsOption) {
			initial = this.sourceMapsOption.path || "./";
		}
		return joinFuseBoxPath(initial, file);
	}

	public shouldGenerateVendorSourceMaps() {
		if (this.sourceMapsOption) {
			return this.sourceMapsOption.vendor;
		}
		return false;
	}

	public getCSSFiles() {
		return this.cssFiles;
	}

	public getCSSSourceMapsPath() {
		return `${this.cssPath}.map`;
	}
	public genenerateQuantumVariableName() {
		let randomHash = hashString(new Date().getTime().toString() + Math.random());
		if (randomHash.indexOf("-") === 0) {
			randomHash = randomHash.slice(1);
		}
		if (randomHash.length >= 7) {
			randomHash = randomHash.slice(2, 6);
		}
		this.quantumVariableName = "_" + randomHash;
	}

	public shouldBundleProcessPolyfill() {
		return this.processPolyfill === true;
	}

	public enableContainedAPI() {
		return (this.containedAPI = true);
	}

	public shouldReplaceTypeOf() {
		return this.replaceTypeOf;
	}

	public getPromisePolyfill() {
		if (this.polyfills && this.polyfills.indexOf("Promise") > -1) {
			return readFuseBoxModule("fuse-box-responsive-api/promise-polyfill.js");
		}
	}

	public getManifestFilePath(): string {
		return this.manifestFile;
	}

	public canBeRemovedByTreeShaking(file: FileAbstraction) {
		if (this.treeshakeOptions) {
			if (this.treeshakeOptions.shouldRemove) {
				return this.treeshakeOptions.shouldRemove(file);
			}
		}
		return true;
	}

	public isContained() {
		return this.containedAPI;
	}

	public throwContainedAPIError() {
		throw new Error(`
           - Can't use contained api with more than 1 bundle
           - Use only 1 bundle and bake the API e.g {bakeApiIntoBundle : "app"}
           - Make sure code splitting is not in use
        `);
	}

	public shouldRemoveUseStrict() {
		return this.removeUseStrict;
	}
	public shouldEnsureES5() {
		return this.ensureES5;
	}

	public shouldDoHoisting() {
		return this.hoisting;
	}

	public getHoistedNames(): string[] {
		return this.hoistedNames;
	}

	public isHoistingAllowed(name: string) {
		if (this.hoistedNames) {
			return this.hoistedNames.indexOf(name) > -1;
		}
		return true;
	}

	public shouldExtendServerImport() {
		return this.extendServerImport;
	}

	public shouldShowWarnings() {
		return this.showWarnings;
	}

	public shouldUglify() {
		return this.uglify;
	}

	public shouldCreateApiBundle() {
		return !this.bakeApiIntoBundle;
	}

	public shouldBakeApiIntoBundle(bundleName: string) {
		return (
			this.bakeApiIntoBundle && (this.bakeApiIntoBundle === true || this.bakeApiIntoBundle.indexOf(bundleName) !== -1)
		);
	}

	public getMissingBundles(bundles: Map<string, Bundle>) {
		if (!this.bakeApiIntoBundle || this.bakeApiIntoBundle === true) {
			return [];
		}

		return this.bakeApiIntoBundle.filter(bundle => !bundles.has(bundle));
	}

	public shouldTreeShake() {
		return this.treeshake;
	}
	public shouldRemoveExportsInterop() {
		return this.removeExportsInterop;
	}

	public shouldReplaceProcessEnv() {
		return this.replaceProcessEnv;
	}

	public getTarget() {
		return this.optsTarget;
	}

	public isTargetElectron() {
		return this.optsTarget === "electron";
	}
	public isTargetUniveral() {
		return this.optsTarget === "universal" || this.optsTarget === "npm-universal";
	}
	public isTargetNpm() {
		return (
			this.optsTarget === "npm" ||
			this.optsTarget === "npm-server" ||
			this.optsTarget === "npm-browser" ||
			this.optsTarget === "npm-universal"
		);
	}

	public isTargetServer() {
		return (
			this.optsTarget === "server" ||
			this.optsTarget === "electron" ||
			this.optsTarget === "npm" ||
			this.optsTarget === "npm-server"
		);
	}

	public isTargetBrowser() {
		return this.optsTarget === "browser" || this.optsTarget === "npm-browser";
	}
}
