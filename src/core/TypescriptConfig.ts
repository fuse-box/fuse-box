import { WorkFlowContext } from "./WorkflowContext";
import * as path from "path";
import { ensureUserPath, findFileBackwards } from "../Utils";
import { ScriptTarget } from "./File";
import * as fs from "fs";
import { Config } from "../Config";
import * as ts from "typescript";

const CACHED: { [path: string]: any } = {};

export interface ICategorizedDiagnostics {
	errors: ReadonlyArray<ts.Diagnostic & { category: ts.DiagnosticCategory.Error }>,
	warnings: ReadonlyArray<ts.Diagnostic & { category: ts.DiagnosticCategory.Warning }>,
	messages: ReadonlyArray<ts.Diagnostic & { category: ts.DiagnosticCategory.Message }>,
	suggestions: ReadonlyArray<ts.Diagnostic & { category: ts.DiagnosticCategory.Suggestion }>,
}

export class TypescriptConfig {
	// the actual typescript config
	private config: any;
	private customTsConfig: string;
	private configFile: string;
	private formatDiagnosticsHost: ts.FormatDiagnosticsHost;
	constructor(public context: WorkFlowContext) {
		this.formatDiagnosticsHost = {
			getCanonicalFileName: file => file,
			getCurrentDirectory: () => context.homeDir,
			getNewLine: () => ts.sys.newLine,
		}
	}

	public getConfig() {
		this.read();
		return this.config;
	}

	private defaultSetup() {
		const compilerOptions = (this.config.compilerOptions = this.config.compilerOptions || {});
		if (this.context.useSourceMaps) {
			compilerOptions.sourceMap = true;
			compilerOptions.inlineSources = true;
		}
		if (this.context.forcedLanguageLevel) {
			this.forceCompilerTarget(this.context.forcedLanguageLevel);
		}

		if (compilerOptions.baseUrl === "." && this.context.automaticAlias) {
			let aliasConfig = {};
			let log = [];
			fs.readdirSync(this.context.homeDir).forEach(file => {
				const extension = path.extname(file);
				if (!extension || extension === ".ts" || extension === ".tsx") {
					let name = file;
					if (extension) {
						name = file.replace(/\.tsx?/, "");
					}
					log.push(`\t${name} => "~/${name}"`);
					aliasConfig[name] = `~/${name}`;
				}
			});
			this.context.log.echoInfo(`Applying automatic alias based on baseUrl in tsconfig.json`);
			this.context.log.echoInfo(`\n ${log.join("\n")}`);
			this.context.addAlias(aliasConfig);
		}
	}

	public forceCompilerTarget(level: ScriptTarget) {
		this.context.log.echoInfo(`Typescript forced script target: ${ScriptTarget[level]}`);
		const compilerOptions = (this.config.compilerOptions = this.config.compilerOptions || {});
		compilerOptions.target = ScriptTarget[level];
	}

	public setConfigFile(customTsConfig: string) {
		this.customTsConfig = customTsConfig;
	}

	private initializeConfig() {
		const compilerOptions = this.config.compilerOptions;
		compilerOptions.jsx = "react";
		compilerOptions.importHelpers = true;
		compilerOptions.emitDecoratorMetadata = true;
		compilerOptions.experimentalDecorators = true;
		const targetFile = path.join(this.context.homeDir, "tsconfig.json");
		this.context.log.echoInfo(`Generating recommended tsconfig.json:  ${targetFile}`);
		fs.writeFileSync(targetFile, JSON.stringify(this.config, null, 2));
	}

	private normalizeAndValidateCompilerOptions() {
		let compilerOptions = this.config.compilerOptions
		let normalizedCompilerOptions = ts.convertCompilerOptionsFromJson(compilerOptions, compilerOptions.baseUrl);

		if (normalizedCompilerOptions.errors.length) {
			this.logAllDiagnostics(normalizedCompilerOptions.errors);
		}
		this.config.compilerOptions = compilerOptions = normalizedCompilerOptions.options;
		/**
		 * Explicitely un-set in `transpileModule`:
		 * https://github.com/Microsoft/TypeScript/blob/865b3e786277233585e1586edba52bf837b61b71/src/services/transpile.ts#L26
		 * */
		compilerOptions.isolatedModules = true;
		compilerOptions.suppressOutputPathCheck = true;
		compilerOptions.allowNonTsExtensions = true;
		compilerOptions.noLib = true;
		compilerOptions.lib = undefined;
		compilerOptions.types = undefined;
		compilerOptions.noEmit = undefined;
		compilerOptions.noEmitOnError = undefined;
		compilerOptions.paths = undefined;
		compilerOptions.rootDirs = undefined;
		compilerOptions.declaration = undefined;
		compilerOptions.composite = undefined;
		compilerOptions.declarationDir = undefined;
		compilerOptions.out = undefined;
		compilerOptions.outFile = undefined;
		compilerOptions.noResolve = true;
	}

	private verifyTsLib() {
		if (this.config.compilerOptions.importHelpers === true) {
			const tslibPath = path.join(Config.NODE_MODULES_DIR, "tslib");
			if (!fs.existsSync(tslibPath)) {
				this.context.log.echoWarning(
					`You have enabled importHelpers. Please install tslib - https://github.com/Microsoft/tslib`,
				);
			}
		}
	}

	public categorizeDiagnostics(diagnostics: ReadonlyArray<ts.Diagnostic> | Readonly<ts.Diagnostic>): ICategorizedDiagnostics {
		const errors = [];
		const warnings = [];
		const messages = [];
		const suggestions = [];
		const diagnosticsArray = Array.isArray(diagnostics)
			? diagnostics
			: [diagnostics];
		const size = diagnosticsArray.length;
		for (let i = 0; i < size; i++) {
			const diagnostic: ts.Diagnostic = diagnosticsArray[i];
			switch (diagnostic.category) {
				case ts.DiagnosticCategory.Error: {
					errors.push(diagnostic);
					break;
				}
				case ts.DiagnosticCategory.Warning: {
					warnings.push(diagnostic);
					break;
				}
				case ts.DiagnosticCategory.Message: {
					messages.push(diagnostic);
					break;
				}
				// Commented for documentation. Technically we shouldn't get this.
				// Displaying fails with "Error: Debug Failure. Should never get an Info diagnostic on the command line."
				// TODO: If you find a known case where this could happen, open an issue
				// case ts.DiagnosticCategory.Suggestion: {
				// 	suggestions.push(diagnostic);
				//	break;
				// }
			}
		}
		return { errors, warnings, messages, suggestions };
	}

	public formatDiagnostic(diagnostic: Readonly<ts.Diagnostic>): string {
		return ts.formatDiagnosticsWithColorAndContext(
			[diagnostic],
			this.formatDiagnosticsHost,
		).replace(/error|warning|message/, match => match.toUpperCase());
	}

	public logDiagnosticsByCategory(diagnostics: ReadonlyArray<ts.Diagnostic>, category: ts.DiagnosticCategory): void {
		if (diagnostics.length) {
			const size = diagnostics.length
			for (let i = 0; i < size; i++) {
				const diagnosticMsg = this.formatDiagnostic(diagnostics[i])
				switch (category) {
					case ts.DiagnosticCategory.Error: {
						this.context.log.echoRed(`  → ${diagnosticMsg}`);
						break;
					}
					case ts.DiagnosticCategory.Warning: {
						this.context.log.echoYellow(`  → ${diagnosticMsg}`);
						break;
					}
					case ts.DiagnosticCategory.Message: {
						this.context.log.echoBlue(`  → ${diagnosticMsg}`);
						break;
					}
				}
			}
		}
	}

	public logAllDiagnostics(diagnostics: ReadonlyArray<ts.Diagnostic>) {
		const categorizedDiagnostics = this.categorizeDiagnostics(diagnostics);
		this.logDiagnosticsByCategory(categorizedDiagnostics.messages, ts.DiagnosticCategory.Message);
		this.logDiagnosticsByCategory(categorizedDiagnostics.warnings, ts.DiagnosticCategory.Warning);
		this.throwOnDiagnosticErrors(categorizedDiagnostics.errors);
	}

	public throwOnDiagnosticErrors(diagnostics: ReadonlyArray<ts.Diagnostic>): never | void {
		if (diagnostics.length) {
			this.logDiagnosticsByCategory(diagnostics, ts.DiagnosticCategory.Error)

			this.context.fatal('Invalid `compilerOptions` settings')
		}
	}

	public read() {
		const cacheKey =
			(typeof this.customTsConfig === "string" ? this.customTsConfig : this.context.homeDir) +
			this.context.target +
			this.context.languageLevel;
		if (CACHED[cacheKey]) {
			this.config = CACHED[cacheKey];
			return;
		} else {
			let tsConfigFilePath;
			let config: any = {
				compilerOptions: {},
			};
			let configFileFound = false;
			let tsConfigOverride: any;
			if (typeof this.customTsConfig === "string") {
				this.configFile = ensureUserPath(this.customTsConfig);
			} else {
				tsConfigFilePath = path.join(this.context.homeDir, "tsconfig.json");
				let tsconfig = findFileBackwards(tsConfigFilePath, this.context.appRoot);
				if (tsconfig) {
					configFileFound = true;
					this.configFile = tsconfig;
				}
			}
			if (this.configFile) {
				const configFileRelPath = this.configFile.replace(this.context.appRoot, "");
				this.context.log.echoInfo(`Typescript config file:  ${configFileRelPath}`);
				configFileFound = true;
				const res = readConfigFile(this.configFile, this.context.appRoot);
				config = res.config;
				if (res.error) {
					this.logAllDiagnostics([res.error]);
				}
			}

			if (Array.isArray(this.customTsConfig)) {
				tsConfigOverride = this.customTsConfig[0];
			}

			config.compilerOptions.module = "commonjs";
			if (!("target" in config.compilerOptions)) {
				config.compilerOptions.target = ScriptTarget[this.context.languageLevel];
			}
			if (tsConfigOverride) {
				config.compilerOptions = Object.assign(config.compilerOptions, tsConfigOverride);
			}
			// allowSyntheticDefaultImports
			if (config.compilerOptions.allowSyntheticDefaultImports !== undefined) {
				if (this.context.fuse && this.context.fuse.producer) {
					this.context.fuse.producer.allowSyntheticDefaultImports = config.compilerOptions.allowSyntheticDefaultImports;
				}
			}
			this.config = config;

			this.defaultSetup();
			if (!configFileFound && this.context.ensureTsConfig === true) {
				this.initializeConfig();
			}
			if (this.context.ensureTsConfig === true) {
				this.verifyTsLib();
			}
			this.normalizeAndValidateCompilerOptions()
			this.context.log.echoInfo(`Typescript script target: ${ts.ScriptTarget[config.compilerOptions.target]}`);
			CACHED[cacheKey] = this.config;
		}
	}
}

function readConfigFile(configFilePath: string, rootDir: string) {
	const res = ts.readConfigFile(configFilePath, ts.sys.readFile);
	if (res.error || !res.config || !res.config.extends) return res

	const extendsFilePath = res.config.extends
	const parentRes = readConfigFile(path.isAbsolute(extendsFilePath) ? extendsFilePath : path.join(rootDir, extendsFilePath), rootDir)
	if (parentRes.config) {
		const config = { ...res.config };
		delete config.extends;
		res.config = { ...parentRes.config, ...config, compilerOptions: { ...parentRes.config.compilerOptions, ...config.compilerOptions } };
	}
	return res
}
